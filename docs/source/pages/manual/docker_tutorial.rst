
Docker containerを利用したi2b2サーバーの構築マニュアル
================================================

このマニュアルでは、i2b2サーバーをDockerコンテナを利用して構築する手順を説明します。

.. note::
      - i2b2は継続的に開発が進んでおり、バージョンアップに伴い大幅に内容が変わる可能性があります。
      - 当面の間、このマニュアルは2024年8月時点での最新の **i2b2 version===1.8.x** を対象とします。


1. リポジトリのクローン
--------------------

ステップ:

      1. i2b2-jpのリポジトリをクローンします。

         .. code-block:: bash

            cd /path/to/your/working_dir
            git clone https://github.com/yuakagi/i2b2-jp.git

         ここで、/path/to/your/working_dirは、作業ディレクトリのパスに置き換えてください。


2. 設定ファイルを編集
------------------

   
   ステップ:

      1. 環境変数の設定
         - プロジェクトのルートディレクトリにある `.env` ファイルをテキストエディタで開きます。
         - コメントを参考にして、Postgresのユーザー名、パスワードなどの環境変数を適切に設定してください。

      2. リポジトリのルートディレクトリに移動し、Pythonの仮想環境を構築します。

         .. code-block:: bash

               cd /path/to/your/working_dir/ssmixtwins
               python3 -m venv .venv
               source .venv/bin/activate
      
      3. ssmixtwinsをインストールします。

         .. code-block:: bash

            pip install .

         必要な依存関係もインストールされます。

3. SS-MIX2ストレージを生成
------------------------

   :meth:`ssmixtwins.create_ssmix` を使用して、SS-MIX2ストレージを生成します。

   .. code-block:: python

      from ssmixtwins import create_ssmix

      create_ssmix(
         # 元となるCSVファイルが格納されているディレクトリ
         source_dir="/path/to/your/source_data",
         # 出力先ディレクトリ
         output_dir="/path/to/your/output_data",
         # ワーカーの数。大量のデータを処理する場合は、マシンのCPUコア数に応じて調整してください。ワーカーの数が少ないと、非常に時間がかかる場合があります。
         max_workers=10,
         # CSVファイルのバリデーションをスキップしたい場合、Trueに設定します。
         already_validated=False,
      )

   この関数はまず、全てのCSVファイルを一度検証します。全て問題がなければ、SS-MIX2ストレージの生成プロトコルを開始します。  
   もしCSVに問題があった場合（欠損値、フォーマットエラーなど）、途中で終了し、エラーの詳細を含んだJSONファイルをoutput_dirに出力します。  
   検証が成功しない場合、このファイルを参考にして、CSVファイルの修正や除外を行ってください。
   なお、一度検証が済んでおり、CSVファイルの検証をする必要がない場合、 `already_validated=True` を設定することで、検証をスキップできます。

   必要データの生成が完了したらPython仮想環境は不要です。必要に応じて.venvディレクトリを削除してください。

4. 生成されたSS-MIX2ストレージの確認
--------------------------------

   生成されたSS-MIX2ストレージは、 `output_dir` に格納されます。  
   生成されたファイルは、以下のような構造になっています:

   .. code-block:: text

      output_dir/
         ├── ssmixtwins/
         │   ├── ...
         │   ├── ...

   `output_dir/ssmixtwins` がSS-MIX2ストレージのルートディレクトリです。

