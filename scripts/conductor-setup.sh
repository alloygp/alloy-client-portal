#!/usr/bin/env bash
set -euo pipefail

# Worktree setup hook.
#
# Invoked by:
#   - Conductor (via conductor.json "setup")
#   - Humans running it directly inside a worktree
#
# Accepts WORKTREE_* env vars (preferred) or CONDUCTOR_* (legacy). Auto-
# generates any value not provided.

find_free_port_block() {
  # Probe for 6 consecutive free TCP ports, base aligned to /10 in [20000,60000).
  local base i ok
  for _ in {1..50}; do
    base=$(( 20000 + (RANDOM % 4000) * 10 ))
    ok=1
    for i in 0 1 2 3 4 5; do
      if lsof -iTCP:"$((base + i))" -sTCP:LISTEN >/dev/null 2>&1; then
        ok=0
        break
      fi
    done
    if [ "$ok" = 1 ]; then
      echo "$base"
      return 0
    fi
  done
  echo "find_free_port_block: could not find 6 consecutive free ports in [20000,60000)" >&2
  return 1
}

PORT="${WORKTREE_PORT:-${CONDUCTOR_PORT:-}}"
if [ -z "$PORT" ]; then
  PORT="$(find_free_port_block)"
fi

WORKSPACE="${WORKTREE_NAME:-${CONDUCTOR_WORKSPACE_NAME:-$(basename "$PWD")}}"

ROOT="${WORKTREE_ROOT_PATH:-${CONDUCTOR_ROOT_PATH:-}}"
if [ -z "$ROOT" ]; then
  ROOT="$(git worktree list --porcelain | awk '/^worktree/{print $2; exit}')"
fi

if [ "$(cd "$ROOT" && pwd -P)" = "$(pwd -P)" ]; then
  echo "error: source repo resolved to the current directory — run this script from inside a worktree, not the main checkout" >&2
  exit 1
fi

echo "Setting up worktree: $WORKSPACE"
echo "  base port:   $PORT"
echo "  source repo: $ROOT"

CLIENT_PORT=$((PORT))
CLIENT_HMR_PORT=$((PORT + 1))
SERVER_PORT=$((PORT + 2))
SERVER_DEBUG_PORT=$((PORT + 3))
WORKER_PORT=$((PORT + 4))
POSTGRES_PORT=$((PORT + 5))

cat > .env <<EOF
COMPOSE_PROJECT_NAME=alloy-${WORKSPACE}
PORT_OFFSET=worktree
POSTGRES_PORT=${POSTGRES_PORT}
SERVER_PORT=${SERVER_PORT}
SERVER_DEBUG_PORT=${SERVER_DEBUG_PORT}
WORKER_PORT=${WORKER_PORT}
CLIENT_PORT=${CLIENT_PORT}
CLIENT_HMR_PORT=${CLIENT_HMR_PORT}
EOF

echo "Wrote .env (COMPOSE_PROJECT_NAME=alloy-${WORKSPACE})"

for subdir in server client; do
  if [ -f "$ROOT/$subdir/.env" ]; then
    cp "$ROOT/$subdir/.env" "./$subdir/.env"
    echo "Copied $subdir/.env from $ROOT"
  elif [ -f "./$subdir/.env-example" ]; then
    cp "./$subdir/.env-example" "./$subdir/.env"
    echo "Copied $subdir/.env from .env-example"
  fi
done

# upsert KEY=VALUE in a .env file (replace if present, append if not)
upsert_env() {
  local file="$1" key="$2" value="$3"
  if grep -q "^${key}=" "$file"; then
    perl -i -pe "s|^${key}=.*|${key}=${value}|" "$file"
  else
    [ -s "$file" ] && [ "$(tail -c1 "$file")" != "" ] && echo "" >> "$file"
    echo "${key}=${value}" >> "$file"
  fi
}

if [ -f "./server/.env" ]; then
  upsert_env ./server/.env PORT "${SERVER_PORT}"
  upsert_env ./server/.env VITE_SERVER_BASE_URL "http://localhost:${SERVER_PORT}"
  upsert_env ./server/.env VITE_CLIENT_BASE_URL "http://localhost:${CLIENT_PORT}"
  echo "Patched server/.env (PORT=${SERVER_PORT})"
fi

if [ -f "./client/.env" ]; then
  upsert_env ./client/.env VITE_SERVER_BASE_URL "http://localhost:${SERVER_PORT}"
  upsert_env ./client/.env VITE_CLIENT_BASE_URL "http://localhost:${CLIENT_PORT}"
  upsert_env ./client/.env VITE_HMR_PORT "${CLIENT_HMR_PORT}"
  echo "Patched client/.env"
fi

docker compose down -v --remove-orphans || true
docker compose build
docker compose up -d

echo ""
echo "Worktree ready. Port mapping:"
echo "  Server:   http://localhost:${SERVER_PORT}"
echo "  Client:   http://localhost:${CLIENT_PORT}"
echo "  Worker:   http://localhost:${WORKER_PORT}"
echo "  Postgres: localhost:${POSTGRES_PORT}"
