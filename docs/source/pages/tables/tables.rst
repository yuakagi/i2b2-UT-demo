***********************************
i2b2の様々なテーブルについて
***********************************

.. figure:: /_static/images/common_images/illustrations/tables.svg
   :alt: i2b2 tables icon
   :width: 200px
   :align: center

   i2b2のDBはCellごとにスキーマがあり、その中に様々なテーブルが存在します。

| i2b2は数多くのテーブルで構成されています。
| これらのテーブルは基本的にCRC CellやONT Cellなど、i2b2の各Cellがそれぞれのスキーマ内で管理する形になっています。
| このページでは、各Cellとの関連でテーブルの詳細をまとめています。

1. Data Repository (CRC) Cellのテーブル
======================================

.. figure:: /_static/images/common_images/illustrations/data_analysis.svg
   :alt: Data Repository Cell (CRC)
   :width:  100px
   :align: center

   CRC Cellは臨床レコードを管理するCellです。

1-1. スタースキーマのテーブル
--------------------------------------
| CRC Cellのスキーマ内にあるi2b2 Data Martのテーブル群は、スタースキーマを形成しています。
| スタースキーマのテーブルについては、 :doc:`ここ </pages/i2b2_cells/crc_cell/i2b2_data_mart_tables/i2b2_data_mart_tables>` で説明しています。

1-1-1. ファクトテーブル
^^^^^^^^^^^^^^^^^^^^^^^^^^
| スタースキーマの中心に位置するファクトテーブルは以下の通りです。
- :doc:`OBSERVATION_FACT </pages/i2b2_cells/crc_cell/i2b2_data_mart_tables/star_schema/observation_fact/observation_fact>` : 臨床観測値データを保存します。診断、処方、検査結果などの情報が含まれ、ほか5つのテーブルと関連付けられます。

1-1-2. ディメンションテーブル
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
| スタースキーマを構成する5つのディメンションテーブルは以下の通りです。 

- :doc:`PATIENT_DIMENSION </pages/i2b2_cells/crc_cell/i2b2_data_mart_tables/star_schema/patient_dimension/patient_dimension>`: 患者の基本情報を保存します。患者ID、性別、生年月日、死亡情報などが含まれます。
- :doc:`CONCEPT_DIMENSION </pages/i2b2_cells/crc_cell/i2b2_data_mart_tables/star_schema/concept_dimension/concept_dimension>`: 医療概念・オントロジー（診断、処方、検査コードなど）を保存します。各概念のコード、名称、階層情報など。
- `VISIT_DIMENSION`: 患者の受診情報を保存します。受診日時、病院コード、診療科コードなどが含まれます。
- `PROVIDER_DIMENSION`: 医療提供者（医師、看護師など）の情報を保存します。提供者ID、名前、所属など。
- `MODIFIER_DIMENSION`: 事象に付加情報を提供する修飾子を保存します。


参考文献
======================
このページは主に `i2b2公式ウェブサイト <https://www.i2b2.org/>`_ および `i2b2 Community Wiki <https://community.i2b2.org/wiki/>`_ の内容をもとに作成しました。