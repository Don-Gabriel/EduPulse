"""Integration checks use isolated SQLite files; no provider requests are made."""
import contextlib
import io
import os
import tempfile
import time

os.environ['EDUPULSE_RUNTIME'] = tempfile.mkdtemp(prefix='edupulse-tests-')
os.environ['EDUPULSE_GEMINI_FREE_VERIFIED'] = '0'

import pytest
from fastapi.testclient import TestClient
from backend import app as system


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(system, 'RUNTIME', tmp_path)
    monkeypatch.setattr(system, 'DB', tmp_path / 'test.sqlite3')
    monkeypatch.setenv('EDUPULSE_GEMINI_FREE_VERIFIED', '0')
    system.initialize()
    with TestClient(system.app) as c:
        yield c


def plan(client, sid='asha', cid='nested_loops'):
    response = client.post('/api/interventions', json={'student_id': sid, 'concept_id': cid})
    assert response.status_code == 200
    return response.json()


def session(client, phase, p=None, sid='asha', cid='nested_loops'):
    payload = {'student_id': sid, 'concept_id': cid, 'phase': phase}
    if p:
        payload['intervention_id'] = p['id']
    response = client.post('/api/sessions', json=payload)
    assert response.status_code == 200, response.text
    return response.json()


def answer(client, s, q, choice=None):
    return client.post(f"/api/sessions/{s['id']}/answers", json={
        'question_id': q['id'], 'answer': system.QUESTIONS[q['id']]['answer'] if choice is None else choice})


def test_bootstrap_empty_evidence_and_private_keys(client):
    data = client.get('/api/bootstrap').json()
    assert len(data['students']) == 70
    assert all('questions' not in c for c in data['concepts'])
    unassessed = next(s for s in data['students'] if s['id'] == 'ishaan')
    assert unassessed['priority'] is None
    assert unassessed['band'] == 'not_assessed'
    assert all(e['score'] is None for e in unassessed['evidence'].values())
    assert data['ai']['enabled'] is False
    s = session(client, 'diagnostic')
    assert all('answer' not in q and 'explanation' not in q for q in s['questions'])


def test_full_loop_persistence_hidden_feedback_and_no_rescoring(client):
    rahul_before = client.get('/api/students/rahul').json()['evidence']
    before = client.get('/api/students/asha').json()['evidence']['nested_loops']
    assert before['score'] == 20
    p = plan(client)
    assert client.post('/api/sessions', json={'student_id':'asha','concept_id':'nested_loops','phase':'retest','intervention_id':p['id']}).status_code == 400
    client.post(f"/api/interventions/{p['id']}/read")
    practice = session(client, 'practice', p)
    for q in practice['questions']:
        assert answer(client, practice, q).status_code == 200
    assert client.get('/api/students/asha').json()['evidence']['nested_loops'] == before
    s = session(client, 'retest', p)
    first = answer(client, s, s['questions'][0]).json()
    assert first['correct'] is None
    assert first['questions'][0]['result'] == {'selected':2, 'pending':True}
    detail = client.get('/api/students/asha').json()
    assert detail['evidence']['nested_loops'] == before
    assert not any(a['phase'] == 'retest' for a in detail['attempts'])
    assert not any(a['phase'] == 'retest' for a in client.get('/api/bootstrap').json()['recent'])
    assert client.get(f"/api/sessions/{s['id']}").json()['answered'] == 1
    assert answer(client, s, s['questions'][0]).json()['answered'] == 1
    assert answer(client, s, s['questions'][0], 0).status_code == 409
    for q in s['questions'][1:]:
        result = answer(client, s, q).json()
    assert result['correct'] == 3 and result['completed_at']
    assert all('pending' not in q['result'] for q in result['questions'])
    p2 = client.get(f"/api/interventions/{p['id']}").json()
    assert p2['status'] == 'verified'
    assert client.get('/api/students/rahul').json()['evidence'] == rahul_before
    assert p2['current']['score'] == 40
    assert plan(client)['id'] == p['id']
    assert session(client, 'retest', p)['id'] == s['id']
    assert client.get('/api/students/asha').json()['evidence']['nested_loops']['score'] == 40


def test_diagnostic_dedup_order_and_validation(client):
    s = session(client, 'diagnostic', sid='ishaan', cid='boundaries')
    assert answer(client, s, s['questions'][1]).status_code == 400
    assert client.post(f"/api/sessions/{s['id']}/answers",json={'question_id':s['questions'][0]['id'],'answer':99}).status_code == 422
    for q in s['questions']:
        answer(client, s, q)
    assert session(client, 'diagnostic', sid='ishaan', cid='boundaries')['id'] == s['id']
    e = client.get('/api/students/ishaan').json()['evidence']['boundaries']
    assert e['score'] == 75 and e['limited'] and e['count'] == 2
    assert client.get('/api/students/missing').status_code == 404
    assert client.post('/api/interventions',json={'student_id':'asha','concept_id':'missing'}).status_code == 404


def test_failed_retest_is_not_success(client):
    p = plan(client)
    client.post(f"/api/interventions/{p['id']}/read")
    s = session(client, 'retest', p)
    for q in s['questions']:
        result = answer(client, s, q, (system.QUESTIONS[q['id']]['answer'] + 1) % 4).json()
    assert result['correct'] == 0
    assert client.get(f"/api/interventions/{p['id']}").json()['status'] == 'needs_support'
    first = client.post(f"/api/interventions/{p['id']}/review").json()
    assert first['ok']
    assert client.post(f"/api/interventions/{p['id']}/review").json()['id'] == first['id']


def test_local_mode_never_calls_provider(client, monkeypatch):
    def forbidden(*args, **kwargs):
        raise AssertionError('No network client may be created in local mode')
    monkeypatch.setattr(system.httpx, 'AsyncClient', forbidden)
    p = plan(client)
    response = client.post(f"/api/interventions/{p['id']}/personalize").json()
    assert response['mode'] == 'reviewed'
    assert 'disabled' in response['notice']
    assert client.get('/api/bootstrap').json()['ai']['daily_calls'] == 0


def test_budget_gate_and_reset_preserve_ledger(client, monkeypatch):
    monkeypatch.setenv('EDUPULSE_GEMINI_FREE_VERIFIED','1')
    monkeypatch.setenv('GEMINI_API_KEY','fake-test-key-never-sent')
    def forbidden(*args, **kwargs):
        raise AssertionError('Exhausted budget must block before network')
    monkeypatch.setattr(system.httpx, 'AsyncClient', forbidden)
    with system.connect() as db:
        db.execute('INSERT INTO ai_calls VALUES(?,?,?,?,?,?)',('old',time.time(),100000,None,'failed','gemini-3.5-flash-lite'))
    p = plan(client)
    response = client.post(f"/api/interventions/{p['id']}/personalize").json()
    assert 'exhausted' in response['notice']
    assert client.post('/api/reset', json={'confirmation':'no'}).status_code == 422
    assert client.post('/api/reset', json={'confirmation':'RESET DEMO'}).json()['usage_preserved']
    assert client.get('/api/bootstrap').json()['ai']['lifetime_tokens'] == 100000
    assert (system.RUNTIME / 'before-reset.sqlite3').exists()


def test_origin_export_reviews_and_missing_routes(client):
    assert client.post('/api/reset',headers={'Origin':'https://untrusted.example'},json={'confirmation':'RESET DEMO'}).status_code == 403
    assert client.get('/api/bootstrap',headers={'Host':'untrusted.example'}).status_code == 403
    assert client.get('/api/nonexistent').status_code == 404
    export = client.get('/api/export')
    assert 'text/csv' in export.headers['content-type'] and 'Student' in export.text
    review = client.get('/api/bootstrap').json()['reviews'][0]
    assert client.post(f"/api/reviews/{review['id']}/acknowledge").json()['ok']
    assert client.get('/api/bootstrap').json()['reviews'][0]['status'] == 'acknowledged'


def test_original_question_keys_match_python_output():
    for q in system.QUESTIONS.values():
        captured = io.StringIO()
        with contextlib.redirect_stdout(captured):
            exec(q['code'], {'__builtins__':{'range':range,'print':print,'len':len,'list':list}})
        assert captured.getvalue().strip() == q['options'][q['answer']], q['id']
