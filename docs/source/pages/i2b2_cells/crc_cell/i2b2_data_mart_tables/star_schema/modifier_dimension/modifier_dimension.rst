***********************************
MODIFIER_DIMENSIONテーブルについて
***********************************

.. figure:: e/_static/images/common_images/illustrations/paint_and_brush.svg
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
       | **ユニーク制限があります**。
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

参考文献
========
このページは主に `i2b2 Community Wiki <https://community.i2b2.org/wiki/>`_ の内容をもとに作成しました。
