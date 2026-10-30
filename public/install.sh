#!/usr/bin/env bash
set -euo pipefail

INSTALL_NODE_VERSION=26.12.1
BAZILION_VERSION="${BAZILION_VERSION:-latest}"

log() {
  printf '==> %s\n' "$1"
}

fail() {
  printf 'error: %s\n' "$1" >&2
  exit 1
}

has_supported_node() {
  node -e 'const v = process.versions.node; const m = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(v); const p = m ? m.slice(1).map(Number) : []; process.exit(v === v.trim() && m && p.every(Number.isSafeInteger) && p[0] === 26 && (p[1] > 12 || (p[1] === 12 && p[2] >= 1)) ? 0 : 1)' 2>/dev/null
}

ensure_curl() {
  command -v curl >/dev/null 2>&1 || fail "curl is required to install Node via Volta"
}

ensure_node() {
  if has_supported_node; then
    log "Node $(node -v) found"
    return
  fi

  ensure_curl
  log "Supported Node (26.12.1+ within 26.x) not found; installing Node ${INSTALL_NODE_VERSION} with Volta"
  if ! command -v volta >/dev/null 2>&1; then
    curl -fsSL https://get.volta.sh | bash
  fi

  export VOLTA_HOME="${VOLTA_HOME:-$HOME/.volta}"
  export PATH="$VOLTA_HOME/bin:$PATH"
  command -v volta >/dev/null 2>&1 || fail "Volta installed, but volta is not on PATH"
  volta install "node@${INSTALL_NODE_VERSION}" npm
  has_supported_node || fail "Node must be 26.12.1+ within 26.x"
}

ensure_node
command -v npm >/dev/null 2>&1 || fail "npm was not found after installing Node"

log "Installing bazilion@${BAZILION_VERSION}"
npm install -g "bazilion@${BAZILION_VERSION}"

command -v bazilion >/dev/null 2>&1 || fail "bazilion was installed, but the command is not on PATH"

if ! bazilion dashboard --help >/dev/null 2>&1; then
  fail "installed bazilion does not include 'dashboard'. Re-run with BAZILION_VERSION=latest, or install manually with: npm install -g bazilion@latest"
fi

log "Bazilion installed"
printf '\nRun:\n  bazilion dashboard\n\n'
