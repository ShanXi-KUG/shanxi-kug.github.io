#!/usr/bin/env bash
# 把已推送的 main 快进到 release，由 CI 部署；不能快进时直接失败，不做合并
set -euo pipefail

git fetch origin
git push origin origin/main:refs/heads/release
