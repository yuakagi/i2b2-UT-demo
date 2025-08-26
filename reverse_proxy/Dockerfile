# ============================
# NGINX reverse proxy image
# ============================
FROM nginx:1.27-alpine

# Copy your tuned nginx.conf (the one you posted)
COPY nginx.conf /etc/nginx/nginx.conf

# エントリーリポイントスクリプトをコピーして実行権限を付与
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
# エントリポイントスクリプトを実行
# (entrypoint.shをご確認ください)
ENTRYPOINT ["/entrypoint.sh"]
