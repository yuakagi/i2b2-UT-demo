***********************************
CONCEPT_DIMENSIONテーブルについて
***********************************

.. figure:: /_static/images/common_images/illustrations/concept_hierarchy.svg
   :alt: concept dimension icon
   :width: 200px
   :align: center

   `CONCEPT_DIMENSION` はStar Schemaの一つで、診断・処置・薬剤・検査など、臨床概念の階層を表します。

CONCEPT_DIMENSIONの役割は？
============================

| Star Schemaにおける **ディメンションテーブル** の1つです。
| 各行は1つの概念（診断、処置、薬剤、検査など）を表します。
| 遺伝学データなどまで、柔軟に格納できるようデザインされています。

CONCEPT_DIMENSIONはどこにある？
================================

| **i2b2のData Repository (CRC) Cellのスキーマに存在** します。  
| 例: データベース名が `i2b2`、CRC Cell用のスキーマ名が `i2b2demodata` の場合、  
| **`i2b2.i2b2demodata.CONCEPT_DIMENSION`** としてアクセスします。

CONCEPT_DIMENSIONのテーブル定義
===============================

| `CONCEPT_DIMENSION` テーブルの代表的な列構成は以下の通りです。  
| **主キーは `CONCEPT_PATH`** です。

.. note::

   - **必須列** は `CONCEPT_PATH`, `CONCEPT_CD`, `NAME_CHAR` の3つです。
   - UPDATE_DATE, DOWNLOAD_DATE, IMPORT_DATE, SOURCESYSTEM_CD, UPLOAD_ID はi2b2に共通のメタ列です。

.. warning::

   - **CONCEPT_PATH** は概念階層を表すために使用されます。重複があるとツリー構造が破壊されます。

.. list-table::
   :header-rows: 1
   :stub-columns: 1
   :width: 800px

   * - 列名
     - キー
     - データ型
     - 説明
     - SS-MIX2との対応
   * - CONCEPT_PATH
     - PK
     - varchar(700)
     - | 概念の階層パス。  
       | 例: `\\Diagnoses\\Endocrine\\Diabetes Mellitus Type 2\\`
     - | SS-MIX2のコード系を階層化して格納可能。
   * - CONCEPT_CD
     - 
     - varchar(50)
     - 概念を一意に表すコード（診断コード、処置コード、薬剤コードなど）。
     - | SS-MIX2の各種コード値 (ICD-10, HOT, JLAC10 など)。
   * - NAME_CHAR
     - 
     - varchar(2000)
     - 概念の名称。  
       | 例: 「糖尿病」「アセトアミノフェン」など。
     - | SS-MIX2の各コードに対応する名称。
   * - CONCEPT_BLOB
     - 
     - text
     - 追加情報を格納可能（しばしば未使用）。
     - | 対応なし。
   * - UPDATE_DATE
     - 
     - datetime
     - レコード最終更新日時。
     - | i2b2独自。SS-MIX2とは対応しない。
   * - DOWNLOAD_DATE
     - 
     - datetime
     - データダウンロード日時。
     - SS-MIX2と対応しない。
   * - IMPORT_DATE
     - 
     - datetime
     - データインポート日時。
     - SS-MIX2と対応しない。
   * - SOURCESYSTEM_CD
     - 
     - varchar(50)
     - データソース識別子。
     - SS-MIX2と対応しない。
   * - UPLOAD_ID
     - 
     - int
     - アップロード処理の識別子。
     - SS-MIX2と対応しない。

参考文献
========
このページは主に `i2b2 Community Wiki <https://community.i2b2.org/wiki/>`_ の内容をもとに作成しました。
