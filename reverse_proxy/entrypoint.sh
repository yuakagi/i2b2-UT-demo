#!/bin/sh
set -e

# NGINXのログディレクトリを作成
mkdir -p /var/log/nginx

# ログファイルを作成
touch /var/log/nginx/access.log /var/log/nginx/error.log

# ログファイルの所有権をnginxユーザーに変更 (nginxイメージのデフォルトユーザー)
chown -R nginx:nginx /var/log/nginx

# NGINXをフォアグラウンドで起動
exec nginx -g "daemon off;"