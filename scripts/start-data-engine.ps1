# start-data-engine.ps1
# Called by Windows Task Scheduler at logon.
# Waits for Docker Engine, starts the partpilot-db container, then starts the data-engine scheduler.

param(
    [string]$RepoRoot = "C:\Users\shlomi\Documents\GitProject\buildstack-labs-git\part-pilot"
)

$LogFile = "$env:TEMP\partpilot-engine.log"
$Npm     = "C:\Program Files\nodejs\npm.cmd"

function Write-Log {
    param([string]$Message)
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    "$ts  $Message" | Tee-Object -FilePath $LogFile -Append | Out-Null
}

Write-Log "=== PartPilot data-engine startup ==="

# ── 1. Wait for Docker Engine (up to 2 minutes) ───────────────────────────────
Write-Log "Waiting for Docker Engine..."
$deadline = (Get-Date).AddSeconds(120)
while ((Get-Date) -lt $deadline) {
    $status = & docker info 2>$null
    if ($LASTEXITCODE -eq 0) { break }
    Start-Sleep -Seconds 5
}
if ($LASTEXITCODE -ne 0) {
    Write-Log "ERROR: Docker Engine did not start within 2 minutes. Aborting."
    exit 1
}
Write-Log "Docker Engine is ready."

# ── 2. Ensure partpilot-db container is running ────────────────────────────────
$containerState = & docker inspect --format "{{.State.Status}}" partpilot-db 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Log "ERROR: partpilot-db container not found. Run the migration first."
    exit 1
}
if ($containerState -ne "running") {
    Write-Log "Starting partpilot-db container (was: $containerState)..."
    & docker start partpilot-db | Out-Null
    Start-Sleep -Seconds 3
}
Write-Log "partpilot-db is running."

# ── 3. Wait for Postgres to accept connections (up to 30 seconds) ──────────────
Write-Log "Waiting for Postgres to accept connections..."
$deadline = (Get-Date).AddSeconds(30)
$pgReady  = $false
while ((Get-Date) -lt $deadline) {
    $result = & docker exec partpilot-db pg_isready -U partpilot -d partpilot 2>$null
    if ($LASTEXITCODE -eq 0) { $pgReady = $true; break }
    Start-Sleep -Seconds 2
}
if (-not $pgReady) {
    Write-Log "ERROR: Postgres did not become ready within 30 seconds."
    exit 1
}
Write-Log "Postgres is ready."

# ── 4. Start data-engine scheduler ────────────────────────────────────────────
$DataEngineDir = Join-Path $RepoRoot "data-engine"
Write-Log "Starting data-engine scheduler from $DataEngineDir ..."

$proc = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c `"$Npm`" run dev >> `"$LogFile`" 2>&1" `
    -WorkingDirectory $DataEngineDir `
    -WindowStyle Hidden `
    -PassThru

Write-Log "data-engine PID: $($proc.Id)"
Write-Log "Logs → $LogFile"
