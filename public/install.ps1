$ErrorActionPreference = "Stop"

$MinNodeMajor = 24
$BazilionVersion = if ($env:BAZILION_VERSION) { $env:BAZILION_VERSION } else { "latest" }

function Write-Step($Message) {
  Write-Host "==> $Message"
}

function Fail($Message) {
  Write-Error $Message
  exit 1
}

function Get-NodeMajor {
  try {
    $major = & node -p "Number(process.versions.node.split('.')[0])" 2>$null
    if ($LASTEXITCODE -eq 0 -and $major) { return [int]$major }
  } catch {}
  return $null
}

function Test-Node24 {
  $major = Get-NodeMajor
  return ($null -ne $major -and $major -ge $MinNodeMajor)
}

function Add-VoltaToPath {
  $voltaBin = Join-Path $env:LOCALAPPDATA "Volta\bin"
  if (Test-Path $voltaBin) {
    $env:PATH = "$voltaBin;$env:PATH"
  }
}

function Ensure-Node {
  if (Test-Node24) {
    Write-Step "Node $(& node -v) found"
    return
  }

  Write-Step "Node $MinNodeMajor+ not found; installing Node $MinNodeMajor with Volta"
  if (-not (Get-Command volta -ErrorAction SilentlyContinue)) {
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
      Fail "winget is required to install Volta automatically. Install Node.js $MinNodeMajor+ from https://nodejs.org/ and rerun this installer."
    }
    winget install Volta.Volta --accept-package-agreements --accept-source-agreements
    Add-VoltaToPath
  }

  if (-not (Get-Command volta -ErrorAction SilentlyContinue)) {
    Fail "Volta installed, but volta is not on PATH. Open a new PowerShell window and rerun this installer."
  }

  volta install "node@$MinNodeMajor" npm
  Add-VoltaToPath
}

Ensure-Node
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Fail "npm was not found after installing Node"
}

Write-Step "Installing bazilion@$BazilionVersion"
npm install -g "bazilion@$BazilionVersion"

if (-not (Get-Command bazilion -ErrorAction SilentlyContinue)) {
  Fail "bazilion was installed, but the command is not on PATH"
}

try {
  bazilion dashboard --help *> $null
} catch {
  Fail "installed bazilion does not include 'dashboard' yet. Publish the Bazilion release that contains BAZ-007, then rerun this installer."
}

Write-Step "Bazilion installed"
Write-Host ""
Write-Host "Run:"
Write-Host "  bazilion dashboard"
