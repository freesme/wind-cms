#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# 脚本：构建所有服务的 Docker 镜像
# 用法：./script/docker_build_services.sh [version]

VERSION=${1:-1.0.0}
SERVICES=(admin app core)

# 切换到脚本所在目录的上一级（项目根）
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$script_dir/.."
cd "$repo_root" || { echo "Failed to cd to repo root: $repo_root" >&2; exit 1; }

echo "=========================================="
echo "Building Docker images for all services"
echo "Version: $VERSION"
echo "=========================================="
echo ""

# 检查 docker 是否可用
if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker command not found. Please install Docker." >&2
  exit 1
fi

# 构建每个服务
for service in "${SERVICES[@]}"; do
  echo "----------------------------------------"
  echo "Building ${service}-service:${VERSION}"
  echo "----------------------------------------"

  if docker build \
    --build-arg SERVICE_NAME="$service" \
    --build-arg APP_VERSION="$VERSION" \
    -t "go-wind-cms/${service}-service:${VERSION}" \
    -t "go-wind-cms/${service}-service:latest" \
    -f Dockerfile \
    .; then
    echo "✓ Successfully built ${service}-service:${VERSION}"
  else
    echo "✗ Failed to build ${service}-service:${VERSION}" >&2
    exit 1
  fi
  echo ""
done

echo "=========================================="
echo "All services built successfully!"
echo "=========================================="
echo ""
echo "Built images:"
for service in "${SERVICES[@]}"; do
  echo "  - go-wind-cms/${service}-service:${VERSION}"
done
echo ""
echo "To deploy, run:"
echo "  docker compose up -d"

