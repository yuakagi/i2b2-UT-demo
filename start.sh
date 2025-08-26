#!/bin/bash
set -e

# .envファイルから環境変数を読み込み
export $(grep -v '^#' .env | xargs)
echo ">>> Using MOUNT_DIR=$MOUNT_DIR"

# 必要なディレクトリを作成
#   - Postgresのデータディレクトリ: `${MOUNT_DIR}/var/lib/postgresql/data`
#   - Postgresのログディレクトリ: `${MOUNT_DIR}/var/log/postgresql`
#   - NGINXのログディレクトリ: `${MOUNT_DIR}/var/log/nginx`
mkdir -p "${MOUNT_DIR}/var/lib/postgresql/data"
mkdir -p "${MOUNT_DIR}/var/log/postgresql"
mkdir -p "${MOUNT_DIR}/var/log/nginx"

# ディレクトリの所有権とパーミッションを設定
chmod 700 "${MOUNT_DIR}/var/lib/postgresql/data"
chmod 755 "${MOUNT_DIR}/var/log/postgresql" "${MOUNT_DIR}/var/log/nginx"
chown -R 999:999 "${MOUNT_DIR}/var/lib/postgresql/data"   # Postgresの公式イメージのpostgresユーザーはuid=999

echo ">>> Starting Docker Compose..."
docker compose up -d
