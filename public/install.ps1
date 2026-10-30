# Windows is UNSUPPORTED (operator decision 2026-09-23): untested, no CI, and
# no Agent-turn qualification is claimed. Kept for contributors who want to
# maintain it; see the platform note in the docs.
$ErrorActionPreference = "Stop"

$InstallNodeVersion = "26.12.1"
$BazilionVersion = if ($env:BAZILION_VERSION) { $env:BAZILION_VERSION } else { "latest" }

function Write-Step($Message) {
  Write-Host "==> $Message"
}

function Fail($Message) {
  Write-Error $Message
  exit 1
}

function Test-SupportedNode {
  try {
    & node -e 'const v = process.versions.node; const m = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(v); const p = m ? m.slice(1).map(Number) : []; process.exit(v === v.trim() && m && p.every(Number.isSafeInteger) && p[0] === 26 && (p[1] > 12 || (p[1] === 12 && p[2] >= 1)) ? 0 : 1)' 2>$null
    return ($LASTEXITCODE -eq 0)
  } catch { return $false }
}

function Add-VoltaToPath {
  $voltaBin = Join-Path $env:LOCALAPPDATA "Volta\bin"
  if (Test-Path $voltaBin) {
    $env:PATH = "$voltaBin;$env:PATH"
  }
}

function Ensure-Node {
  if (Test-SupportedNode) {
    Write-Step "Node $(& node -v) found"
    return
  }

  Write-Step "Node 26.12.1+ within 26.x not found; installing Node $InstallNodeVersion with Volta"
  if (-not (Get-Command volta -ErrorAction SilentlyContinue)) {
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
      Fail "winget is required to install Volta automatically. Install Node.js 26.12.1+ within 26.x from https://nodejs.org/ and rerun this installer."
    }
    winget install Volta.Volta --accept-package-agreements --accept-source-agreements
    Add-VoltaToPath
  }

  if (-not (Get-Command volta -ErrorAction SilentlyContinue)) {
    Fail "Volta installed, but volta is not on PATH. Open a new PowerShell window and rerun this installer."
  }

  volta install "node@$InstallNodeVersion" npm
  Add-VoltaToPath
  if (-not (Test-SupportedNode)) { Fail "Node must be 26.12.1+ within 26.x" }
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
  Fail "installed bazilion does not include 'dashboard'. Re-run with `$env:BAZILION_VERSION='latest'`, or install manually with: npm install -g bazilion@latest"
}

Write-Step "Bazilion installed"
Write-Host ""
Write-Host "Run:"
Write-Host "  bazilion dashboard"
