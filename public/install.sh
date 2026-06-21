#!/usr/bin/env bash
set -euo pipefail

MIN_NODE_MAJOR=24
BAZILION_VERSION="${BAZILION_VERSION:-latest}"

log() {
  printf '==> %s\n' "$1"
}

fail() {
  printf 'error: %s\n' "$1" >&2
  exit 1
}

node_major() {
  node -p "Number(process.versions.node.split('.')[0])" 2>/dev/null || true
}

has_node_24() {
  local major
  major="$(node_major)"
  [[ -n "$major" && "$major" -ge "$MIN_NODE_MAJOR" ]]
}

ensure_curl() {
  command -v curl >/dev/null 2>&1 || fail "curl is required to install Node via Volta"
}

ensure_node() {
  if has_node_24; then
    log "Node $(node -v) found"
    return
  fi

  ensure_curl
  log "Node ${MIN_NODE_MAJOR}+ not found; installing Node ${MIN_NODE_MAJOR} with Volta"
  if ! command -v volta >/dev/null 2>&1; then
    curl -fsSL https://get.volta.sh | bash
  fi

  export VOLTA_HOME="${VOLTA_HOME:-$HOME/.volta}"
  export PATH="$VOLTA_HOME/bin:$PATH"
  command -v volta >/dev/null 2>&1 || fail "Volta installed, but volta is not on PATH"
  volta install "node@${MIN_NODE_MAJOR}" npm
}

ensure_node
command -v npm >/dev/null 2>&1 || fail "npm was not found after installing Node"

log "Installing bazilion@${BAZILION_VERSION}"
npm install -g "bazilion@${BAZILION_VERSION}"

command -v bazilion >/dev/null 2>&1 || fail "bazilion was installed, but the command is not on PATH"

if ! bazilion dashboard --help >/dev/null 2>&1; then
  fail "installed bazilion does not include 'dashboard' yet. Publish the Bazilion release that contains BAZ-007, then rerun this installer."
fi

log "Bazilion installed"
printf '\nRun:\n  bazilion dashboard\n\n'
