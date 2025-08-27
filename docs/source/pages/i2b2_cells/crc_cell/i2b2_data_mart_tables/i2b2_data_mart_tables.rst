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
| このデータウェアハウスは、以下に説明する **Star Schema** と呼ばれる一連のテーブルを中心に構成されています。


1. Star Schemaとは？
=================================

| i2b2 Data Martの主要な臨床データを保存するためのテーブル群を **Star Schema** と呼びます。
| ある事象（例: 患者の診断、処方、検査結果など）を中心に、その周辺情報（患者情報、オントロジー、など）が放射状に関連付けられる構造を持ちます。
| 中心となる事象を格納するのは `observation_fact` テーブルで、ここに処方や血液検査結果、診断情報などが保存されます。
| それを取り囲むように、患者情報を保存する `PATIENT_DIMENSION` テーブル、オントロジー情報を保存する `CONCEPT_DIMENSION` テーブル、受診状態を保存する `VISIT_DIMENSION` テーブル、さらに、プロバイダー情報を保存する `PROVIDER_DIMENSION` テーブル、付加情報を保存する `MODIFIER_DIMENSION` テーブル配置されます。
| これら5つのテーブルをまとめて **Star Schema** と呼びます。
| 実際にi2b2のユーザーが利用する臨床データのほとんどは、このStar Schemaのテーブルに保存されます。

- :doc:`OBSERVATION_FACT </pages/i2b2_cells/crc_cell/i2b2_data_mart_tables/star_schema/observation_fact/observation_fact>` : 臨床観測値データを保存します。診断、処方、検査結果などの情報が含まれ、ほか5つのテーブルと関連付けられます。
- :doc:`PATIENT_DIMENSION </pages/i2b2_cells/crc_cell/i2b2_data_mart_tables/star_schema/patient_dimension/patient_dimension>` : 患者の基本情報を保存します。患者ID、性別、生年月日、死亡情報などが含まれます。
- `CONCEPT_DIMENSION`: 医療概念・オントロジー（診断、処方、検査コードなど）を保存します。各概念のコード、名称、階層情報など。
- `VISIT_DIMENSION`: 患者の受診情報を保存します。受診日時、病院コード、診療科コードなどが含まれます。
- `PROVIDER_DIMENSION`: 医療提供者（医師、看護師など）の情報を保存します。提供者ID、名前、所属など。
- `MODIFIER_DIMENSION`: 事象に付加情報を提供する修飾子を保存します。



