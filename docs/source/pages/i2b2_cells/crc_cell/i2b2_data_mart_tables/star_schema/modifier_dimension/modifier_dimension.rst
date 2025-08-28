***********************************
MODIFIER_DIMENSIONテーブルについて
***********************************

.. figure:: /_static/images/common_images/illustrations/paint_and_brush.svg
   :alt: modifier dimension icon
   :width: 200px
   :align: center

   `MODIFIER_DIMENSION` は観測値に付随する修飾子を階層構造で管理します。

MODIFIER_DIMENSIONの役割は？
============================

| Star Schemaにおける **ディメンションテーブル** の1つです。
| 各行は1つの修飾子（modifier）を表します。
| 概念(CONCEPT_DIMENSION)に「修飾子」を付与することで、観測値に追加の意味を与えます。  
| 例: 薬剤であれば「投与経路 (ROUTE)」「投与量 (DOSE)」、診断であれば「確定/疑い」など。  
| オントロジーセル (Ontology Cell) が修飾子の適用対象（概念階層のどのレベルで適用されるか）を管理します。

MODIFIER_DIMENSIONはどこにある？
================================

| **i2b2のData Repository (CRC) Cellのスキーマに存在** します。  
| 例: データベース名が `i2b2`、CRC Cell用のスキーマ名が `i2b2demodata` の場合、  
| **`i2b2.i2b2demodata.MODIFIER_DIMENSION`** としてアクセスします。

MODIFIER_DIMENSIONのテーブル定義
===============================

| `MODIFIER_DIMENSION` テーブルの代表的な列構成は以下の通りです。  
| **主キーは `MODIFIER_PATH`** です。

.. note::

   - **必須列** は `MODIFIER_PATH`, `MODIFIER_CD`, `NAME_CHAR` の3つです。
   - UPDATE_DATE, DOWNLOAD_DATE, IMPORT_DATE, SOURCESYSTEM_CD, UPLOAD_ID はi2b2に共通のメタ列です。

.. list-table::
   :header-rows: 1
   :stub-columns: 1
   :width: 800px

   * - 列名
     - キー
     - データ型
     - 説明
     - SS-MIX2との対応
   * - MODIFIER_PATH
     - PK
     - varchar(700)
     - | 修飾子の階層パス。  
       | 例: `\\Medication\\Frequency\\`
       |    `\\Medication\\Route\\`
       | **バックスラッシュ** `\\` を使ってください。スラッシュ `\/` ではありません。
       | PKです。 **ユニーク制限があります**。
     - | 
   * - MODIFIER_CD
     - 
     - varchar(50)
     - | 修飾子を表すコード。
       | 例: `MED:FREQ`, `MED:ROUTE` など。
       | `:` で区切られた2つの部分から成り、
       | 前半は修飾子の大分類、後半は小分類を表す
       | ことが慣例のようですが、単純に1や2などの
       | 数字などのこともあります。
     - | 
   * - NAME_CHAR
     - 
     - varchar(2000)
     - | 修飾子の名称。  
       | 例: `Medication Frequency`, `Medication Route` など。
     - | 
   * - MODIFIER_BLOB
     - 
     - text
     - 拡張情報を格納可能（しばしば未使用）。
     - 対応なし。
   * - UPDATE_DATE
     - 
     - datetime
     - レコード最終更新日時。
     - SS-MIX2とは対応しない。
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

SS-MIX2との対応
================

| 修飾子をSS-MIX2のどのフィールドに対応させるかは、下のように考えられます。

診断の修飾子
------------
| 診断でおそらく最も一般的な修飾子は疑いフラグと思われます。
| そのほかにも、「入院時」「手術時」などの修飾子、それから解決済みフラグなども考えられます。
| 関連しそうなSS-MIX2のフィールドを下に例示します。

.. list-table::
   :header-rows: 1
   :stub-columns: 1
   :width: 800px
    
   * - メッセージ型
     - フィールド
     - 説明
     - i2b2実装例
   * - PPR^ZD1
     - PRB-13
     - 疑いフラグ (1:疑い)
     - | MODIFIER_PATH: `\\Diagnosis\\Provisional\\`
       | MODIFIER_CD: `DIAG:PROV`
       | NAME_CHAR: `Provisional Status`
       | とし、OBSERVATION_FACTでは、
       | `CONCEPT_CD = DIAG:PROV`, `NVAL_NUM = 1` として格納する。

処方オーダーの修飾子
-------------------
| 処方オーダーでよく使われる修飾子には、投与経路 (ROUTE)、投与量 (DOSE)、投与頻度 (FREQ) などがあります。
| 関連しそうなSS-MIX2のフィールドを下に例示します。

.. list-table::
   :header-rows: 1
   :stub-columns: 1
   :width: 800px
    
   * - メッセージ型
     - フィールド
     - 説明
     - i2b2実装例
   * - RDE^O11
     - RXR-1
     - 投与経路
     - | MODIFIER_PATH: `\\Medication\\Route\\`
       | MODIFIER_CD: `MED:ROUTE`
       | NAME_CHAR: `Medication Route`
       | とし、OBSERVATION_FACTでは、
       | `CONCEPT_CD = MED:ROUTE`, `TVAL_CHAR` に
       | 使用者定義書「0162-投薬経路」より「PO（口）」
       | 「AP （外用）」「SC（皮下）」などを格納する。
   * - RDE^O11
     - | 処方オーダーはRXE-3 (一回あたりの投与量)、
       | 注射オーダーはRXC-3 (一回あたりの投与量)。
     - 処方量 (DOSE)
     - | MODIFIER_PATH: `\\Medication\\Dose\\`
       | MODIFIER_CD: `MED:DOSE`
       | NAME_CHAR: `Medication Dose`
       | とし、OBSERVATION_FACTでは、
       | `CONCEPT_CD = MED:DOSE`, `NVAL_NUM` に投与量を格納する。
       | なお、処方回数(〜回分)、処方日数(TQ1-6)や調剤量(RXE-10)は
       | OBSERVATION_FACTの`QUANTITY_NUM` の使用を使用するのか、
       | あるいは別の修飾子として扱うのかは運用次第と思われる。
   * - RDE^O11
     - TQ1-3 (繰り返しパターン)
     - 投与頻度 (FREQ)
     - | MODIFIER_PATH: `\\Medication\\Frequency\\`
       | MODIFIER_CD: `MED:FREQ`
       | NAME_CHAR: `Medication Frequency`
       | とし、OBSERVATION_FACTでは、
       | `CONCEPT_CD = MED:FREQ`, `TVAL_CHAR` に
       | 「処方オーダリ ングシステム用標準用法
       | 『服用回数、服用のタイミングに関する標準用法マスタ』
       | （内服および外用編）」のコードを格納する。


参考文献
========
このページは主に `i2b2 Community Wiki <https://community.i2b2.org/wiki/>`_ の内容をもとに作成しました。
