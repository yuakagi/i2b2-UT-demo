# ===============================
# NGINXリバースプロキシ用Dockerfile
# ===============================
FROM nginx:1.27-alpine

# NGINXの設定ファイルをコンテナにコピー
COPY nginx.conf /etc/nginx/nginx.conf

# ユーザーをnginx (nginxイメージのデフォルトユーザー)に変更
# なお、uid=101(nginx) gid=101(nginx) groups=101(nginx)です
USER nginx

# NGINXのデフォルトのHTTPポート80を公開
EXPOSE 80

# 以下のコマンドはベースイメージに含まれていて不要かもしれませんが、念のため明示的に指定しています。
CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf"]

#  === 必要に応じて以下に追加のセットアップを記入してください。===


# =======================================================