# start-all.ps1
# Interactive dev launcher: Docker → partpilot-db → data-engine → Next.js
# Run from repo root: .\start-all.ps1

$RepoRoot      = $PSScriptRoot
$Npm           = "C:\Program Files\nodejs\npm.cmd"
$DockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"

function Write-Step {
    param([string]$Text)
    Write-Host "`n▸ $Text" -ForegroundColor Cyan
}
function Write-Ok   { param([string]$T) Write-Host "  ✓ $T" -ForegroundColor Green }
function Write-Fail { param([string]$T) Write-Host "  ✗ $T" -ForegroundColor Red }

Write-Host ""
Write-Host "  PartPilot — dev launcher" -ForegroundColor White
Write-Host "  ─────────────────────────" -ForegroundColor DarkGray

# ── 1. Docker Engine ──────────────────────────────────────────────────────────
Write-Step "Checking Docker Engine..."
$dockerReady = $false
& docker info 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    $dockerReady = $true
    Write-Ok "Docker Engine already running."
} else {
    if (Test-Path $DockerDesktop) {
        Write-Host "  Starting Docker Desktop..." -ForegroundColor Yellow
        Start-Process -FilePath $DockerDesktop
        Write-Host "  Waiting for Docker Engine (up to 90 s)..." -ForegroundColor DarkGray
        $deadline = (Get-Date).AddSeconds(90)
        while ((Get-Date) -lt $deadline) {
            Start-Sleep -Seconds 4
            & docker info 2>$null | Out-Null
            if ($LASTEXITCODE -eq 0) { $dockerReady = $true; break }
            Write-Host "  ." -NoNewline -ForegroundColor DarkGray
        }
        Write-Host ""
    }
    if ($dockerReady) { Write-Ok "Docker Engine is ready." }
    else { Write-Fail "Docker Engine did not start. Start Docker Desktop manually and re-run."; exit 1 }
}

# ── 2. partpilot-db container ─────────────────────────────────────────────────
Write-Step "Checking partpilot-db container..."
$state = & docker inspect --format "{{.State.Status}}" partpilot-db 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Fail "Container 'partpilot-db' not found."
    Write-Host "  Run the migration first:" -ForegroundColor Yellow
    Write-Host "    docker run -d --name partpilot-db --restart unless-stopped \" -ForegroundColor DarkGray
    Write-Host "      -e POSTGRES_USER=partpilot -e POSTGRES_PASSWORD=partpilot -e POSTGRES_DB=partpilot \" -ForegroundColor DarkGray
    Write-Host "      -p 5432:5432 postgres:16-alpine" -ForegroundColor DarkGray
    Write-Host "    cd data-engine && npm run migrate" -ForegroundColor DarkGray
    exit 1
}
if ($state -ne "running") {
    Write-Host "  Starting container (was: $state)..." -ForegroundColor Yellow
    & docker start partpilot-db | Out-Null
    Start-Sleep -Seconds 3
}
Write-Ok "partpilot-db is running."

# ── 3. Wait for Postgres ──────────────────────────────────────────────────────
Write-Step "Waiting for Postgres..."
$pgReady  = $false
$deadline = (Get-Date).AddSeconds(30)
while ((Get-Date) -lt $deadline) {
    & docker exec partpilot-db pg_isready -U partpilot -d partpilot 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { $pgReady = $true; break }
    Start-Sleep -Seconds 2
}
if (-not $pgReady) { Write-Fail "Postgres did not become ready within 30 s."; exit 1 }
Write-Ok "Postgres is accepting connections."

# ── 4. data-engine (hidden window) ───────────────────────────────────────────
Write-Step "Starting data-engine scheduler..."
$EngineLog = "$env:TEMP\partpilot-engine.log"
$engineProc = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c `"$Npm`" run dev >> `"$EngineLog`" 2>&1" `
    -WorkingDirectory (Join-Path $RepoRoot "data-engine") `
    -WindowStyle Hidden `
    -PassThru
Write-Ok "data-engine started (PID $($engineProc.Id))"
Write-Host "  Logs → $EngineLog" -ForegroundColor DarkGray

# ── 5. Next.js (new visible window) ──────────────────────────────────────────
Write-Step "Starting Next.js dev server..."
$nextArgs = "/k title PartPilot-Frontend && `"$Npm`" run dev"
$nextProc  = Start-Process -FilePath "cmd.exe" `
    -ArgumentList $nextArgs `
    -WorkingDirectory (Join-Path $RepoRoot "frontend") `
    -PassThru
Write-Ok "Next.js starting in a new window (PID $($nextProc.Id))"

# ── Summary ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  ─────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host "  All services started." -ForegroundColor Green
Write-Host ""
Write-Host "  App          → http://localhost:3000" -ForegroundColor White
Write-Host "  DB           → postgresql://partpilot:partpilot@localhost:5432/partpilot" -ForegroundColor White
Write-Host "  Engine logs  → $EngineLog" -ForegroundColor White
Write-Host ""
Write-Host "  Press Ctrl+C in the Next.js window to stop the frontend." -ForegroundColor DarkGray
Write-Host "  To stop data-engine: Stop-Process -Id $($engineProc.Id)" -ForegroundColor DarkGray
Write-Host ""
