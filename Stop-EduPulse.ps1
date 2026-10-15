$pidFile = Join-Path $PSScriptRoot 'runtime\server.pid'
if (Test-Path -LiteralPath $pidFile) {
    $savedId = [int](Get-Content -LiteralPath $pidFile)
    $server = Get-CimInstance Win32_Process -Filter "ProcessId=$savedId" -ErrorAction SilentlyContinue
    if ($server -and $server.CommandLine -like '*uvicorn backend.app:app*' -and $server.CommandLine -like '*8765*') {
        Stop-Process -Id $savedId
        Write-Host 'EduPulse server stopped.'
    } else { Write-Host 'No matching EduPulse server is running.' }
} else { Write-Host 'No launcher-owned server was found.' }
