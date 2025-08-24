# 公式i2b2 DockerイメージをベースにしたPostgreSQL用のDockerfileを作成します
ARG I2B2_DATA_PGSQL_TAG=latest
FROM i2b2/i2b2-data-pgsql:${I2B2_DATA_PGSQL_TAG}


# Postgresのlog出力用のディレクトリを作成します
RUN mkdir -p /var/log/postgresql && chown postgres:postgres /var/log/postgresql
# postgresql.confをコンテナ内にコピーし、PostgreSQLの設定を上書きします
COPY postgresql.conf /var/lib/postgresql/data/postgresql.conf


