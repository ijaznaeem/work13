#!/usr/bin/env pwsh

Write-Host "Setting up IKMF Copilot Context with MCP Server..." -ForegroundColor Green

# Check if Node.js is installed
try {
  $nodeVersion = node --version
  Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
}
catch {
  Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
  exit 1
}

# Navigate to the .copilot directory
$copilotDir = Join-Path $PSScriptRoot ".copilot"
if (-not (Test-Path $copilotDir)) {
  Write-Host "Error: .copilot directory not found" -ForegroundColor Red
  exit 1
}

Set-Location $copilotDir

# Install dependencies
Write-Host "Installing MCP server dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
  Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
  exit 1
}

# Build the MCP server
Write-Host "Building MCP server..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Error: Failed to build MCP server" -ForegroundColor Red
  exit 1
}

# Return to original directory
Set-Location $PSScriptRoot

Write-Host "✅ IKMF Copilot Context setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart VS Code to activate the new Copilot context" -ForegroundColor White
Write-Host "2. Use 'Ctrl+Shift+P' and run 'setup-copilot-context' task" -ForegroundColor White
Write-Host "3. Start the MCP server with 'start-mcp-server' task" -ForegroundColor White
Write-Host ""
Write-Host "The MCP server provides:" -ForegroundColor Cyan
Write-Host "- Project structure context" -ForegroundColor White
Write-Host "- Angular patterns and conventions" -ForegroundColor White
Write-Host "- Component analysis tools" -ForegroundColor White
Write-Host "- Architecture suggestions" -ForegroundColor White
