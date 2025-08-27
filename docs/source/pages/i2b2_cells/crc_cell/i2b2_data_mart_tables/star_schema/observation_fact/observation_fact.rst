***********************************
OBSERVATION_FACTテーブルについて
***********************************

OBSERVATION_FACTの役割は？
==========================

| i2b2スター・スキーマにおける **ファクトテーブル** で、各ディメンションの交点を表します。
| 1行が「患者の1回の受診(visit)中に記録された1つの観測値」を表します。
| ほとんどのクエリは、OBSERVATION_FACT と1つ以上のディメンション・テーブル（PATIENT_DIMENSION、VISIT_DIMENSION、PROVIDER_DIMENSION、CONCEPT_DIMENSION、MODIFIER_DIMENSIONなど）を結合して実行します。

OBSERVATION_FACTはどこにある？
==============================

| **i2b2のData Repository (CRC) Cellのスキーマに存在** します。
| 例として、データベース名が `i2b2`、CRC Cell用のスキーマ名が `i2b2demodata` の場合、  
| **`i2b2.i2b2demodata.OBSERVATION_FACT`** としてアクセスします。

OBSERVATION_FACTのテーブル定義
==============================

| 代表的な列構成は以下の通りです。  
| 主キーは **複合主キー** で、同一の観測を一意に識別します（下表の「PK」欄を参照）。

.. note::

   - **複合主キー**（一般的には以下7列）:
     `ENCOUNTER_NUM`, `CONCEPT_CD`, `PATIENT_NUM`, `PROVIDER_ID`, `START_DATE`, `MODIFIER_CD`, `INSTANCE_NUM`
   - 値表現は `VALTYPE_CD` により解釈が分かれます（数値・短文・生テキスト）。  
     例: 数値なら `NVAL_NUM`、短いテキスト/列挙値なら `TVAL_CHAR` を使用。
   - UPDATE_DATE, DOWNLOAD_DATE, IMPORT_DATE, SOURCESYSTEM_CD, UPLOAD_ID はi2b2に共通のデータ管理用メタ列です。

.. warning::

   - **一意性**: 複合主キーのいずれかが欠けたり矛盾すると、一意性が保てず、重複行の原因になります。
   - **MODIFIERとINSTANCE**: 同一の `CONCEPT_CD` に対して複数の修飾子を持つ場合、`MODIFIER_CD` は行ごとに異なり、`INSTANCE_NUM` が同一観測グループを関連付けます。

.. list-table::
   :header-rows: 1
   :stub-columns: 1
   :width: 800px

   * - 列名
     - キー
     - データ型
     - 説明
   * - ENCOUNTER_NUM
     - PK
     - int
     - i2b2の受診(visit)番号（符号化）。患者の来院単位を表す。
   * - PATIENT_NUM
     - PK
     - int
     - i2b2の患者番号（符号化）。
   * - CONCEPT_CD
     - PK
     - varchar(50)
     - 観測対象の概念コード（診断・処置・投薬・検査など）。
   * - PROVIDER_ID
     - PK
     - varchar(50)
     - 実施者（医療者・診療科等）の識別子。
   * - START_DATE
     - PK
     - datetime
     - 観測の開始日時。
   * - MODIFIER_CD
     - PK
     - varchar(50)
     - 概念の修飾子（例: ROUTE, DOSE など）。  
       値（用量「100」、投与経路「PO」など）はしばしば `TVAL_CHAR` / `NVAL_NUM` に保持されます。
   * - INSTANCE_NUM
     - PK
     - int
     - 同一 `CONCEPT_CD` に複数の修飾子を紐づけるためのインスタンス番号。  
       各行は異なる `MODIFIER_CD` を持ち、関連行は同一の `INSTANCE_NUM` でまとまる。
   * - VALTYPE_CD
     - 
     - varchar(50)
     - 値の形式。  
       | N = Numeric（数値）  
       | T = Text（列挙/短文）  
       | B = Raw Text（長文/レポート等）
   * - TVAL_CHAR
     - 
     - varchar(255)
     - `VALTYPE_CD` に応じた文字値。  
       | `VALTYPE_CD = "T"` の場合: テキスト値そのもの  
       | `VALTYPE_CD = "N"` の場合: 演算子（E, NE, L, LE, G, GE）
   * - NVAL_NUM
     - 
     - decimal(18,5)
     - 数値値（`VALTYPE_CD = "N"` のときに使用）。
   * - VALUEFLAG_CD
     - 
     - varchar(50)
     - 値のフラグ。  
       | `VALTYPE_CD = "N"` または `"T"` で外れ値・異常値を示すことに使用  
       | H = High, L = Low, A = Abnormal
   * - QUANTITY_NUM
     - 
     - decimal(18,5)
     - `NVAL_NUM` の量（数量）。
   * - UNITS_CD
     - 
     - varchar(50)
     - `NVAL_NUM` の単位。
   * - END_DATE
     - 
     - datetime
     - 観測の終了日時。
   * - LOCATION_CD
     - 
     - varchar(50)
     - 施設や外来/病棟などのロケーションコード。
   * - CONFIDENCE_NUM
     - 
     - decimal(18,5)
     - データの確からしさ（品質指標など）。
   * - OBSERVATION_BLOB
     - 
     - text
     - 生データ/長文/その他を格納（しばしばPHIを含むため暗号化対象）。
   * - UPDATE_DATE
     - 
     - datetime
     - レコード最終更新日時。
   * - DOWNLOAD_DATE
     - 
     - datetime
     - ダウンロード日時。
   * - IMPORT_DATE
     - 
     - datetime
     - インポート日時。
   * - SOURCESYSTEM_CD
     - 
     - varchar(50)
     - データソース識別子。
   * - UPLOAD_ID
     - 
     - int
     - アップロード処理の識別子。

値カラムの使い分け（早見）
==========================

| **数値**: `VALTYPE_CD = "N"` → `NVAL_NUM` に数値、必要に応じて `TVAL_CHAR` に演算子（E/NE/L/LE/G/GE）。  
| **短文/列挙**: `VALTYPE_CD = "T"` → `TVAL_CHAR` に値（例: 「PO」「POSITIVE」）。  
| **生テキスト**: `VALTYPE_CD = "B"` → `OBSERVATION_BLOB` に格納（NLP対象のレポートなど）。  
| **異常値フラグ**: `VALUEFLAG_CD`（H/L/A など）を併用。  
| **単位**: `UNITS_CD`、量は `QUANTITY_NUM`。

参考文献
========
このページは主に `i2b2 Community Wiki <https://community.i2b2.org/wiki/>`_ の内容をもとに作成しました。
