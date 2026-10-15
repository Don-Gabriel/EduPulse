$ErrorActionPreference = 'Stop'
Write-Host 'This restores the original 70 generated class profiles and backs up current activity.'
Write-Host 'API usage counters are preserved.'
$confirmation = Read-Host 'Type RESET DEMO to restore the class, or press Enter to cancel'
if ($confirmation -ne 'RESET DEMO') { Write-Host 'Cancelled.'; exit 0 }
$result = Invoke-RestMethod -Method Post -Uri 'http://127.0.0.1:8765/api/reset' -ContentType 'application/json' -Body '{"confirmation":"RESET DEMO"}'
if ($result.ok) { Write-Host 'Class restored. Refresh the browser. Backup: runtime\before-reset.sqlite3' }
