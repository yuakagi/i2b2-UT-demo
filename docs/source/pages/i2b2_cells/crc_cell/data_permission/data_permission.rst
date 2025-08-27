***********************************
ユーザーロールとデータアクセス権限
***********************************

.. figure:: /_static/images/common_images/illustrations/user_permission.svg
   :alt: i2b2 User Roles and Data Permissions
   :width: 200px
   :align: center
   
   CRC Cellはユーザーロールに基づいて、データへのアクセス権限を制御しています。

1. CRC Cellにおけるユーザーロールとは?
=================================

| CRC Cellは、ユーザーの役割（ロール）に基づいて、データの提示方法や範囲を決定します。
| ロールはProject Management (PM)セルでユーザーごとに指定されます。

.. note::

   - i2b2で `user role` という場合、二つの意味があります。
   - 一つは **Data Protection Trackのuser role** とも言われるもので、このページで解説します。
   - もう一つは **Hive Management Trackのuser role** とも言われます。これはi2b2の他のユーザーのクエリ結果にアクセスできるかどうかを制御します。このページでは解説しません。

2. CRC Cellのユーザーロールの詳細
=================================

| 以下の表は、ユーザーロールとアクセス権限を、アクセス可能範囲が少ないものから多いものへ順にまとめたものです。

.. list-table::
   :header-rows: 1
   :stub-columns: 1
   :width: 800px

   * - ロール
     - 意味
     - アクセス説明
     - 例
   * - DATA_OBFSC
     - OBFSC = Obfuscated
     - | 集計結果をだけを参照でき、値はマスキングされる。
       | 例: 患者数。  
       | 同一クエリの実行回数には制限があり、上限を超えるとアカウントがロックされ、管理者のみ解除可能。
     - .. code-block:: xml

          <query_result_instance>
            <result_instance_id>0</result_instance_id>
            <query_instance_id>0</query_instance_id>
            <query_result_type>
              <name>PATIENTSET</name>
            </query_result_type>
            <set_size>101</set_size>
            <obfuscate_method>OBSUBTOTAL</obfuscate_method>
            <start_date>2000-12-30T00:00:00</start_date>
          </query_result_instance>
   * - DATA_AGG
     - AGG = Aggregated
     - | 集計結果を参照可能。値はマスキングされない。
       | 実行回数の制限もない。
     - .. code-block:: xml

          <query_result_instance>
            <result_instance_id>0</result_instance_id>
            <query_instance_id>0</query_instance_id>
            <query_result_type>
              <name>PATIENTSET</name>
            </query_result_type>
            <set_size>101</set_size>
            <obfuscate_method/>
            <start_date>2000-12-30T00:00:00</start_date>
          </query_result_instance>
   * - DATA_LDS
     - LDS = Limited Data Set
     - | 暗号化された列以外のすべての項目を参照可能。
       | 暗号化される代表例: factテーブルやdimensionテーブルのblob列。
     - .. code-block:: xml

          <observation_set blob="false" onlykeys="false"/>
   * - DATA_DEID
     - DEID = De-identified Data
     - | 暗号化された列を含め、すべての項目を参照可能。
       | 暗号化される代表例: blob列。
     - .. code-block:: xml

          <observation_set blob="true" onlykeys="false"/>
   * - DATA_PROT
     - PROT = Protected Data
     - | すべてのデータにアクセス可能。
       | Identity Management Cell内に保存されている患者識別情報も含む。
     - (PDO例: すべての情報が返却される)

参考文献 (References)
======================
このページは主に `i2b2 Community Wiki <https://community.i2b2.org/wiki/>`_ の内容をもとに作成しました。
一部の例などは、そのまま引用をしています。詳細はWikiの該当ページをご覧ください。
