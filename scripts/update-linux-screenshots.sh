#!/usr/bin/env bash
# Regenerates the Linux screenshot baselines that CI compares against.
# CI runs on Linux, and Linux renders fonts differently from macOS, so these
# baselines must come from the same Playwright image that CI uses.
# Needs a running Docker daemon.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PW_VERSION="$(node -p "require('${ROOT}/node_modules/@playwright/test/package.json').version")"
IMAGE="mcr.microsoft.com/playwright:v${PW_VERSION}-noble"

mkdir -p "${ROOT}/e2e/__screenshots__/linux"

docker run --rm --ipc=host \
  -v "${ROOT}:/src:ro" \
  -v "${ROOT}/e2e/__screenshots__/linux:/out" \
  -e CI=1 \
  "${IMAGE}" \
  bash -euo pipefail -c '
    mkdir /work
    cd /src
    tar --exclude=./node_modules --exclude=./dist --exclude=./coverage \
        --exclude=./test-results --exclude=./playwright-report -cf - . | tar -xf - -C /work
    cd /work
    npm ci --no-audit --no-fund
    npx playwright test --grep screenshot --update-snapshots=all
    cp -R e2e/__screenshots__/linux/. /out/
  '

echo "Linux baselines written to e2e/__screenshots__/linux"
