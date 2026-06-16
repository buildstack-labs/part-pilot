# register-startup-task.ps1
# Run ONCE as Administrator to register the data-engine as a startup task.
# The task fires at user logon and keeps the scheduler alive in the background.
#
# Usage (elevated PowerShell):
#   .\scripts\register-startup-task.ps1

#Requires -RunAsAdministrator

$TaskName   = "PartPilot-DataEngine"
$RepoRoot   = "C:\Users\shlomi\Documents\GitProject\buildstack-labs-git\part-pilot"
$ScriptPath = Join-Path $RepoRoot "scripts\start-data-engine.ps1"

if (-not (Test-Path $ScriptPath)) {
    Write-Error "Script not found: $ScriptPath"
    exit 1
}

# Remove existing task if present
if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Write-Host "Removing existing task '$TaskName'..."
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

$action  = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$ScriptPath`""

$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME

$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Hours 0) `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 2) `
    -StartWhenAvailable

$principal = New-ScheduledTaskPrincipal `
    -UserId $env:USERNAME `
    -LogonType Interactive `
    -RunLevel Highest

Register-ScheduledTask `
    -TaskName  $TaskName `
    -Action    $action `
    -Trigger   $trigger `
    -Settings  $settings `
    -Principal $principal `
    -Description "Starts the PartPilot data-engine price-sync scheduler at user logon." | Out-Null

Write-Host ""
Write-Host "Task '$TaskName' registered successfully." -ForegroundColor Green
Write-Host "It will run automatically at your next logon."
Write-Host ""
Write-Host "Useful commands:"
Write-Host "  Start now : Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "  Status    : Get-ScheduledTask -TaskName '$TaskName' | Select-Object State"
Write-Host "  Remove    : Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false"
Write-Host "  Logs      : Get-Content `$env:TEMP\partpilot-engine.log -Tail 50"
