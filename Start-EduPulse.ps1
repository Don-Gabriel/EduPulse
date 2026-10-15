$ErrorActionPreference = 'Stop'
$projectDir = $PSScriptRoot
Set-Location -LiteralPath $projectDir
$localUrl = 'http://127.0.0.1:8765'
try {
    $health = Invoke-RestMethod -Uri "$localUrl/api/health" -TimeoutSec 2
    if ($health.ok -and $health.version -eq '1.0.0') {
        Start-Process $localUrl
        Write-Host 'EduPulse is already running. Opened the workspace.' -ForegroundColor Green
        exit 0
    }
} catch {}
if (-not (Test-Path -LiteralPath (Join-Path $projectDir 'dist\index.html'))) {
    throw 'The frontend has not been built. Run Setup-EduPulse.ps1 first.'
}
$venvPython = Join-Path $projectDir '.venv\Scripts\python.exe'
$pythonExe = if (Test-Path -LiteralPath $venvPython) { $venvPython } else { (Get-Command python -ErrorAction Stop).Source }
& $pythonExe -c 'import fastapi,uvicorn,httpx,pydantic'
if ($LASTEXITCODE -ne 0) { throw 'Python dependencies are missing. Run Setup-EduPulse.ps1 first.' }
$runtimeDir = Join-Path $projectDir 'runtime'
New-Item -ItemType Directory -Force -Path $runtimeDir | Out-Null
$server = Start-Process -FilePath $pythonExe -ArgumentList @('-m','uvicorn','backend.app:app','--host','127.0.0.1','--port','8765') -WorkingDirectory $projectDir -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $runtimeDir 'server-output.log') -RedirectStandardError (Join-Path $runtimeDir 'server-errors.log')
$server.Id | Set-Content -LiteralPath (Join-Path $runtimeDir 'server.pid')
for ($attempt = 0; $attempt -lt 30; $attempt++) {
    try {
        $health = Invoke-RestMethod -Uri "$localUrl/api/health" -TimeoutSec 1
        if ($health.ok) {
            Start-Process $localUrl
            Write-Host 'EduPulse is ready at http://127.0.0.1:8765' -ForegroundColor Green
            Write-Host 'Speaker notes: http://127.0.0.1:8765/present'
            exit 0
        }
    } catch {}
    if ($server.HasExited) { break }
    Start-Sleep -Milliseconds 300
}
throw "EduPulse could not start. Read runtime\server-errors.log."
