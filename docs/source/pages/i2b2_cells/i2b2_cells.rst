***********************************
i2b2のCellについて
***********************************

.. figure:: /_static/images/common_images/illustrations/bees_and_hive.svg
   :alt: i2b2 Hive and Cells
   :width: 200px
   :align: center

   i2b2 CellとHiveについて説明します。

1. i2b2のCell構成 (i2b2 Hive)
=================================

.. figure:: /_static/images/common_images/i2b2_logos/I2b2_logo.svg
   :alt: i2b2 logo
   :width: 100px
   :align: left

   i2b2のロゴマーク

| i2b2は `Cell` と呼ばれるコンポーネントから成り立っています。
| i2b2のロゴマークが蜂の巣であることが象徴しているように、i2b2は蜂の巣の小部屋(cell)が集まって一つの蜂の巣(Hive)のようにシステムを構成しています。
| なので、i2b2のCellの全体構成を **i2b2 Hive** と呼びます。
| それぞれのCellは特定の機能を担当し、連携してi2b2システム全体を構成します。
| 以下にi2b2 Hiveを構成する主要なCellを示します。
|
|

2. 主要なi2b2 Cellの説明
=================================

- :doc:`CRC Cell (Data Repository Cell) </pages/i2b2_cells/crc_cell/crc_cell>` : i2b2の中心的なCellで、データの保存とクエリ処理を担当します。ユーザーがデータを検索・取得する際に利用されます。
- **ONT Cell (Ontology Management Cell)**: 概念（コンセプト）情報を管理するCellです。ユーザーが利用する用語やコード体系を定義・保存します。
- **PM Cell (Project Management Cell)**: プロジェクトやユーザー管理を担当するCellです。ユーザーの認証や権限管理を行います。
- **WORK Cell (Workflow Framework Cell)**: このセルは、Hive内のさまざまな情報を処理するために使用されます。処理された情報のほとんどは、CRC Cellに保存されるか、あるいはユーザーへの表示として利用されます
- **i2b2 Web Client Application**: ユーザーがブラウザを通じてi2b2にアクセスするためのWebアプリケーションです。一応Cellに含まれますが、他のCellとは異なり、ユーザーインターフェースを提供し、他のCellと連携します。
- **File Repository Cell**: ファイルの保存と管理を担当するCellです。大きなデータファイルやドキュメントを格納します。これは必須でなく、オプションのCellです。なくてもi2b2は動作します。
- **Identity Management Cell**: 主にHIPAA準拠を目的として、患者の匿名化や識別情報の保護に関わる機能を提供するCellです。これは必須でなく、オプションのCellです。なくてもi2b2は動作します。

| これのCell(小部屋)が集まってi2b2システム全体を構成しているイメージです。


参考文献
======================
このページは主に `i2b2公式ウェブサイト <https://www.i2b2.org/>`_ および `i2b2 Community Wiki <https://community.i2b2.org/wiki/>`_ の内容をもとに作成しました。