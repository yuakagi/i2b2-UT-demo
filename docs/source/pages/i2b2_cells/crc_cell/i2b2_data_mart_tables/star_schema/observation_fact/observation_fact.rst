***********************************
OBSERVATION_FACTテーブルについて
***********************************

.. figure:: /_static/images/common_images/illustrations/pen_and_note.svg
   :alt: observation fact icon
   :width: 200px
   :align: center
   
   `OBSERVATION_FACT` はStar Schemaの中心で、臨床観測値データを保存します。

OBSERVATION_FACTの役割は？
==========================

| Star Schemaにおける **ファクトテーブル** です。
| 1行が「患者の1回の受診(visit)中に記録された1つの観測値」を表します。
| ほとんどのクエリは、OBSERVATION_FACT と1つ以上のディメンション・テーブル（PATIENT_DIMENSION、VISIT_DIMENSION、PROVIDER_DIMENSION、CONCEPT_DIMENSION、MODIFIER_DIMENSION）を結合して実行します。

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

   - **複合主キー** : `ENCOUNTER_NUM`, `CONCEPT_CD`, `PATIENT_NUM`, `PROVIDER_ID`, `START_DATE`, `MODIFIER_CD`, `INSTANCE_NUM` の7列の組み合わせ。
   - UPDATE_DATE, DOWNLOAD_DATE, IMPORT_DATE, SOURCESYSTEM_CD, UPLOAD_ID はi2b2に共通のデータ管理用メタ列です。

.. warning::

   - **一意性** : 複合主キーのいずれかが欠けたり矛盾すると、一意性が保てず、重複行の原因になります。

.. list-table::
   :header-rows: 1
   :stub-columns: 1
   :width: 800px

   * - 列名
     - キー
     - データ型
     - 説明
     - SS-MIX2との対応
   * - ENCOUNTER_NUM
     - PK
     - int
     - | `VISIT_DIMENSION` の `ENCNTR_NUM` と外部キーで関連付けられる。  
       | Null不可。
     - | `VISIT_DIMENSION`を参照のこと。
   * - PATIENT_NUM
     - PK
     - int
     - | `PATIENT_DIMENSION` の `PATIENT_NUM` と外部キーで関連付けられる。
       | Null不可。
     - | `PATIENT_DIMENSION`を参照のこと。
   * - CONCEPT_CD
     - PK
     - varchar(50)
     - | `CONCEPT_DIMENSION` の `CONCEPT_CD` と外部キーで関連付けられる。  
       | 観測された医療概念（診断、処方、検査など）を示すコード。Null不可。
     - | `CONCEPT_DIMENSION`を参照のこと。
   * - PROVIDER_ID
     - PK
     - varchar(50)
     - | `PROVIDER_DIMENSION` の `PROVIDER_ID` と外部キーで関連付けられる。
       | 実施者（医療者・診療科等）の識別子。Null不可。
     - | i2b2内での医療提供者識別子を示すもの。
       | SS-MIX2のデータ項目とは直接対応しないが、
       | 一貫したルールを定めれば
       | ORC-10(入力者),ORC-12(依頼者),ORC-17(入力組織),PV1-7(主治医)
       | などが対応可能。
   * - START_DATE
     - PK
     - datetime
     - Null不可。観測の開始日時 (mm/dd/yyyy)。
     - | SS-MIX2の各種日時フィールドと対応可能。
       | 検体検査結果 (OUL^R22): SPM-17(採取日時),
       |     OBX-14(検査日時),OBR-22(報告/更新日時)など
       | 処方・注射オーダー (RDE^O11): ORC-9(オーダー日時),
       |     ORC-15(オーダー有効日),TQ1-7(投薬開始予定日)など
       | 診断 (PPR^ZD1): PBR-2(更新日時),PRB-7(診断日),PRB-16(開始日/発症日)など。
       | など。
   * - MODIFIER_CD
     - PK
     - varchar(50)
     - | **Null許容**
       | `MODIFIER_DIMENSION` の `MODIFIER_CD` と外部キーで関連付けられる。
       | 概念の修飾子（例: ROUTE, DOSE など）。  
       | 対応する値（ DOSEでは「100」mg、ROUTEでは「PO」など）はしばしば
       | `TVAL_CHAR` / `NVAL_NUM` などの値列に格納される。
       | 修飾子がない場合はNULL。
       | 使い方は `ページ下の例 <modifier_usage>` を参照。
     - | `MODIFIER_DIMENSION`を参照。
   * - INSTANCE_NUM
     - PK
     - int
     - | **Null許容**
       | 同一 `CONCEPT_CD` に複数の修飾子を紐づけるためのインスタンス番号。  
       | 適応する場合、各行は異なる `MODIFIER_CD` を持ち、
       | 関連行は同じ `INSTANCE_NUM` をもつ。
       | 修飾子がない場合はNULL。
       | 使い方は `ページ下の例 <modifier_usage>` を参照。
     - | i2b2独自。
   * - VALTYPE_CD
     - 
     - varchar(50)
     - | 値の形式。  
       | N = 数値型  T = 文字列 (列挙型/短文)など
       | 詳細は :ref:`ページ下の表 <valtype_cd_values>` を参照。
       | B = 生のテキスト（長文/レポート等）
     - | OBX-2(値型)など対応するフィールドはあるが、
       | 行に応じて適切に設定すべき。
   * - TVAL_CHAR
     - 
     - varchar(255)
     - | `VALTYPE_CD` に応じた文字値。  
       | `VALTYPE_CD` が "T" または "N" の場合の時だけ使用。
       | `VALTYPE_CD = "T"` の場合: テキスト値そのもの  
       | `VALTYPE_CD = "N"` の場合: 演算子を格納する。
       | 使い方詳細は :ref:`ページ下の表 <val_columns>` を参照。
     - | SS-MIX2の各種フィールドと対応可能。
       | 検体検査結果 (OUL^R22): OBX-5(結果値)
       | など。
   * - NVAL_NUM
     - 
     - decimal(18,5)
     - 数値値（ `VALTYPE_CD = "N"` のときに使用）。
     - | SS-MIX2の各種フィールドと対応可能。
       | 検体検査結果 (OUL^R22): OBX-5(結果値)
       | 処方・注射オーダー (RDE^O11): RXE-3(与薬量－最小/一回あたりの投与量),
       |    RXE-10(調剤量),RXE-19(1 日あたりの総投与量),
       |    TQ1-2(数量),
       | など。
   * - VALUEFLAG_CD
     - 
     - varchar(50)
     - | 値のフラグ。   
       | H = High, L = Low, A = Abnormalなど。
       | 使い方詳細は :ref:`ページ下の表 <val_columns>` を参照。
     - | SS-MIX2ではOBX-7(基準範囲), OBX-8(異常フラグ)などが対応可能。
   * - QUANTITY_NUM
     - 
     - decimal(18,5)
     - | `NVAL_NUM` の値の量（数量）。
       | `NVAL_NUM` が値そのものを表すのに対し、
       | `QUANTITY_NUM` はその値の数量やカウント、
       | 回数、量的情報 を補足的に保持します
       | 例えば、血液検査で「赤血球数（RBC count = 4.5e6/μL）」 →
       |    NVAL_NUM = 4.5、UNITS_CD = 10^6/μL、QUANTITY_NUM = 1（単一検査）
       | 投薬で「アスピリン 325mg 錠を 2 錠」 →
       |    NVAL_NUM = 325、UNITS_CD = mg、QUANTITY_NUM = 2
       | **この列は使用せず実装することも多いようです**。
     - | SS-MIX2ではデータ種別に応じて対応可能。
       | 検体検査結果 (OUL^R22): 常に 1 でよいはず。
       | 処方・注射オーダー (RDE^O11): TQ1-3(繰り返しパターン), RXE-10(調剤量),
       |    RXE-19(1 日あたりの総投与量),TQ1-6(サービス時間/処方日数)
       | などが関連。
   * - UNITS_CD
     - 
     - varchar(50)
     - `NVAL_NUM` の単位。
     - | SS-MIX2ではデータ種別に応じて対応可能。
       | 処方・注射オーダー (RDE^O11): RXE-11(調剤単位)
       | 検体検査結果 (OUL^R22): OBX-6(単位)
       | など。
   * - END_DATE
     - 
     - datetime
     - 観測の終了日時。
     - | SS-MIX2の各種日時フィールドと対応可能。
       | 検体検査結果 (OUL^R22): OBR-8(検査/採取終了日時),
       |     OBX-14(検査日時),OBR-22(報告/更新日時)など
       | 処方・注射オーダー (RDE^O11): ORC-9(オーダー日時),
       |     ORC-15(オーダー有効日),TQ1-8(終了日時)など
       | 診断 (PPR^ZD1): PRB-9(実際のプロブレム解決日付／時刻)
       | など。
       | ただし、終了日時を明確にできない事象も多いため、
       | あえて使わないという選択肢もあり得る。
   * - LOCATION_CD
     - 
     - varchar(50)
     - 施設や外来/病棟などのロケーションコード。
     - | ORC-13(入力場所), PV1-3(患者の所在)など。
   * - CONFIDENCE_NUM
     - 
     - decimal(18,5)
     - データの確からしさ、正確性。
     - SS-MIX2で特に対応するフィールドはない。
   * - OBSERVATION_BLOB
     - 
     - text
     - | 生データ/長文/その他を格納
       | 多くの場合、暗号化したPHI
       | (Protected Health Information、保護対象医療情報)
       | を格納。
     - | SS-MIX2で特に対応するフィールドはない。
   * - UPDATE_DATE
     - 
     - datetime
     - レコード最終更新日時。
     - | i2b2内でのレコード更新日時を示すものであり、
       | SS-MIX2のデータ項目とは直接対応しない。
   * - DOWNLOAD_DATE
     - 
     - datetime
     - ダウンロード日時。
     - SS-MIX2と対応しない。
   * - IMPORT_DATE
     - 
     - datetime
     - インポート日時。
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

.. _modifier_usage:

修飾子(modifier)の使い方は？
==========================

| 処方に対して投与経路(ROUTE)や用量(DOSE)など、修飾子が必要な場合があります。
| このセクションでは、`OBSERVATION_FACT` テーブルにおける **修飾子 (modifier)** の使い方を示します。  
| 特に、 `@` がベースコンセプトを表すために必要であること、そして `INSTANCE_NUM` によって同日の複数の事象を区別することを説明します。

帝王切開手術の例
--------------------------

| 処置コードとしてCPTコードを例に使います。
| CPTコードは日本ではあまり使われませんが、米国では手術・処置を表す代表的なコード体系です。  
| ここでは、公式の例から引用し、修飾子の例としてCPTコードを用います。

| 患者 #123 が 2006年3月4日の入院 (#107) で帝王切開手術 (CPTコード:59622) を受けた場合:

.. list-table::
   :header-rows: 1
   :stub-columns: 1

   * - PATIENT_NUM
     - ENCOUNTER_NUM
     - INSTANCE_NUM
     - CONCEPT_CD
     - START_DATE
     - MODIFIER_CD
     - VALTYPE_CD
     - TVAL_CHAR
     - NVAL_NUM
   * - 123
     - 107
     - 1
     - cpt:59622
     - 20060304
     - @
     - <null>
     - <null>
     - <null>
   * - 123
     - 107
     - 1
     - cpt:59622
     - 20060304
     - cptmod:62
     - <null>
     - <null>
     - <null>
   * - 123
     - 107
     - 1
     - cpt:59622
     - 20060304
     - cptmod:AA
     - <null>
     - <null>
     - <null>
   * - 123
     - 107
     - 1
     - cpt:59622
     - 20060304
     - cptmod:TH
     - <null>
     - <null>
     - <null>

| ここで、`@` がベースとなる手術コードを表し、  
| `cptmod:62`, `cptmod:AA`, `cptmod:TH` が修飾子 (modifier) として追加されています。

薬剤処方 (アスピリン) の例
--------------------------

患者 #123 が 2010年4月4日の外来 (#567) で **325 mgのアスピリンを1日1回 (QD) 経口 (PO)** で処方された場合:

.. list-table::
   :header-rows: 1
   :stub-columns: 1

   * - PATIENT_NUM
     - ENCOUNTER_NUM
     - INSTANCE_NUM
     - CONCEPT_CD
     - START_DATE
     - MODIFIER_CD
     - VALTYPE_CD
     - TVAL_CHAR
     - NVAL_NUM
   * - 123
     - 567
     - 1
     - med:aspirin
     - 20100404
     - @
     - <null>
     - <null>
     - <null>
   * - 123
     - 567
     - 1
     - med:aspirin
     - 20100404
     - MED:DOSE
     - N
     - E
     - 325
   * - 123
     - 567
     - 1
     - med:aspirin
     - 20100404
     - MED:FREQ
     - T
     - QD
     - <null>
   * - 123
     - 567
     - 1
     - med:aspirin
     - 20100404
     - MED:ROUTE
     - T
     - PO
     - <null>

| そして、同日に **83 mg アスピリン BID (1日2回) PO** が追加で処方された場合、 `INSTANCE_NUM` を「2」として区別します:

.. list-table::
   :header-rows: 1
   :stub-columns: 1

   * - PATIENT_NUM
     - ENCOUNTER_NUM
     - INSTANCE_NUM
     - CONCEPT_CD
     - START_DATE
     - MODIFIER_CD
     - VALTYPE_CD
     - TVAL_CHAR
     - NVAL_NUM
   * - 123
     - 567
     - 2
     - med:aspirin
     - 20100404
     - @
     - <null>
     - <null>
     - <null>
   * - 123
     - 567
     - 2
     - med:aspirin
     - 20100404
     - MED:DOSE
     - N
     - E
     - 83
   * - 123
     - 567
     - 2
     - med:aspirin
     - 20100404
     - MED:FREQ
     - T
     - BID
     - <null>
   * - 123
     - 567
     - 2
     - med:aspirin
     - 20100404
     - MED:ROUTE
     - T
     - PO
     - <null>

.. _valtype_cd_values:

VALTYPE_CDがとりうる値
==========================

| `VALTYPE_CD` 列は、観測値のデータ型を示します。  
| とりうる値は以下です。

.. note::

    - nullと@の使い分けがドキュメントからはっきりしません。

.. list-table::
   :header-rows: 1
   :stub-columns: 1
   :width: 600px

   * - 値
     - 説明
   * - @
     - 該当なし
   * - N
     - 数値型 (Numeric)
   * - T
     - 文字列型 (Text) - 列挙型/短文
   * - B
     - 生テキスト (Blob) - 長文/レポート等
   * - NLP
     - NLP結果のXMLオブジェクト

.. _val_columns:

OBSERVATION_FACTの値に関連するカラム
=================================

| OBSERVATION_FACTテーブルには、値に関連する6つのカラムがあります。
| 以下では、それぞれのカラムについて補足情報を示します。

.. note::

   - `VALTYPE_CD=N` の時、 特に演算子が不要と思われる場合もデフォルトで `E` を入れるようです。
   - 「観察値が `NVAL_NUM` の値の通り」という意味だと思われます。

.. list-table::
   :header-rows: 1
   :stub-columns: 1
   :width: 800px

   * - VALTYPE_CD
     - TVAL_CHAR
     - NVAL_NUM
     - VALUEFLAG_CD
     - UNITS_CD
     - OBS_BLOB
   * - N
     - | 演算子を格納します。  
       | 使用できる演算子は:
       |    E:Equals (=)
       |    NE:Not Equals (≠)
       |    L:Less Than (\<)
       |    LE:Less Than or Equals (≤)
       |    G:Greater Than (\>)
       |    GE:Greater Than or Equals (≥)
     - | 実際の数値を格納します。
     - | 数値に関連するフラグ。 
       | H (高)  
       | L (低)  
       | N (正常)  
       | [null] (不明)
     - | 単位を格納します。
     - | その他の暗号化された情報を格納します。
   * - T
     - | 実際の短いテキスト値を格納します。
     - | N/A
     - | テキストに関連するフラグ。  
       | A (異常)  
       | N (正常)  
       | [null] (不明)
     - | 単位を格納します。
     - | その他の暗号化された情報を格納します。
   * - B
     - | N/A
     - | N/A
     - | X (暗号化(encrypted)されていれば、X)
     - | N/A
     - | 生テキストデータ (Raw text)
   * - NLP
     - | N/A
     - | N/A
     - | X (暗号化(encrypted)されていれば、X)
     - | N/A
     - | NLPの結果のXMLオブジェクト

参考文献
========
このページは主に `i2b2 Community Wiki <https://community.i2b2.org/wiki/>`_ の内容をもとに作成しました。
