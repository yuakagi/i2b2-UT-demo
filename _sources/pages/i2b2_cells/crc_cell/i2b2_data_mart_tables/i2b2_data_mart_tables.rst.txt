***********************************
i2b2 Data Martとそのテーブルについて
***********************************

.. figure:: /_static/images/common_images/illustrations/mart.svg
   :alt: data warehouse icon
   :width: 200px
   :align: center
   
   i2b2 Data Martはi2b2システム内のデータウェアハウスです。


1. i2b2 Data Martとは？
=================================

| i2b2 Data Martはi2b2システム内のデータウェアハウス(データの倉庫)で、ユーザー向けに臨床データを提供します。
| このデータウェアハウスは、以下に説明する **スタースキーマ** と呼ばれる一連のテーブルを中心に構成されています。


1. ⭐️ スタースキーマとは？
=================================

| **スタースキーマ** とは、データウェアハウスでよく使われるデータモデルの一つです。
| ひとつの **ファクトテーブル** と 複数 **ディメンションテーブル** から構成され、中心に位置するファクトテーブルを複数のディメンションテーブルが取り囲む形状から「星(star)」に例えられます。
| i2b2 Data Martでもスタースキーマが採用されており、臨床データ(診断、処方、検査結果など)はこのスタースキーマのテーブルに保存されます。
| なので、i2b2のドキュメントには **i2b2 Star Schema** という言葉が頻出します。
| i2b2 におけるファクトテーブルは `OBSERVATION_FACT` テーブルです。ここに臨床観測値(検査値、処方薬のコード、診断コードなど)データが保存されます。
| ディメンションテーブルは `PATIENT_DIMENSION`, `CONCEPT_DIMENSION`, `VISIT_DIMENSION`, `PROVIDER_DIMENSION`, `MODIFIER_DIMENSION` の5つです。
| これら5つディメンションテーブルが `OBSERVATION_FACT` テーブルを取り囲む形で関連付け、観測値に関する様々な属性情報を提供します。

2. i2b2 Data Martのスタースキーマのテーブル
=========================================

ファクトテーブル
-------------------

| :doc:`OBSERVATION_FACT </pages/i2b2_cells/crc_cell/i2b2_data_mart_tables/star_schema/observation_fact/observation_fact>` 

| 臨床観測値データを保存します。診断、処方、検査結果などの情報が含まれ、ほか5つのテーブルと関連付けられます。

ディメンションテーブル
-------------------

| :doc:`PATIENT_DIMENSION </pages/i2b2_cells/crc_cell/i2b2_data_mart_tables/star_schema/patient_dimension/patient_dimension>` 
|     患者の基本情報を保存します。患者ID、性別、生年月日、死亡情報などが含まれます。
| :doc:`CONCEPT_DIMENSION </pages/i2b2_cells/crc_cell/i2b2_data_mart_tables/star_schema/concept_dimension/concept_dimension>` 
|     医療概念・オントロジー（診断、処方、検査コードなど）を保存します。各概念のコード、名称、階層情報など。
| :doc:`MODIFIER_DIMENSION </pages/i2b2_cells/crc_cell/i2b2_data_mart_tables/star_schema/modifier_dimension/modifier_dimension>`
|     事象に付加情報を提供する修飾子を保存します。
| `VISIT_DIMENSION`: 患者の受診情報を保存します。受診日時、病院コード、診療科コードなどが含まれます。
| `PROVIDER_DIMENSION`: 医療提供者（医師、看護師など）の情報を保存します。提供者ID、名前、所属など。



