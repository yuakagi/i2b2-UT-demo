
***********************************
PATIENT_DIMENSIONテーブルについて
***********************************

.. figure:: /_static/images/common_images/illustrations/patient_on_bed.svg
   :alt: patient icon
   :width: 200px
   :align: center

   PATIENT_DIMENSIONは患者の基本情報を保存するテーブルです。
  
PATIENT_DIMENSIONの役割は？
================================

| i2b2データベース内で患者を一意に識別し、その基本的な属性情報を保存します。

PATIENT_DIMENSIONはどこにある？
================================

| **i2b2のData Repository (CRC) Cellのスキーマに存在** します。
| データベース名が `i2b2`でCRC Cell用のスキーマ名が `i2b2demodata` の場合、 **`i2b2.i2b2demodata.PATIENT_DIMENSION` などとしてアクセス** します。

PATIENT_DIMENSIONのテーブル定義
================================

| デフォルトのPATIENT_DIMENSIONテーブルの構造は以下の通りです。
| 必要に応じて、数に制限なく列を追加することが許容されています。 

.. note::
   
   - RACE_CDやSEX_CDなどの_CDで終わる列は、コード型の値をとります。
   - **これらの列で使うコード体系はOntology CellのDBスキーマであるmetadata内のテーブルで管理します。**
   - 値として使用するコードはmetadataの方で別途定義してください。
   - UPDATE_DATE, DOWNLOAD_DATE, IMPORT_DATE, SOURCESYSTEM_CD, UPLOAD_IDの５つの列は、i2b2の多くのテーブルで共通のデータ管理用の列です。

.. warning::
   
   - ＊が付いた列(SEX_CDなど)は必須ではない列のようですが、それを明示した文献が見つけられていません。
   - STATECITYZIP_PATHはSTATECITYZIP_CDという名称でも記載されていることがあり、どちらが正しいのかはっきりしていません。

.. list-table::
   :header-rows: 1
   :stub-columns: 1
   :width: 800px

   * - 列名
     - キー
     - データ型
     - 説明
     - SS-MIX2との対応
   * - PATIENT_NUM
     - PK
     - int
     - DB内での患者の一意な識別子。PK。
     - | i2b2内での患者識別子を示すものであり、
       | SS-MIX2のデータ項目とは直接対応しない。 
   * - VITAL_STATUS_CD
     - 
     - varchar(50)
     - 
       | 患者の生存状態を示すコード。これは標準化されたコードはないが、
       | 推奨されるコード表記法がある。 詳細は下方参照。
     - | PPR^ZD1のPRB-14(プロブレムのライフサイクル状態)、
       | ADT^A03のPV1-36(退院時の状態)で間接的に表現可能。
       | しかし、SS-MIX2では患者の生存状態の格納を直接目的にしたフィールドはなく、
       | 上記のフィールドも欠損していることがあるため、
       | SS-MIX2で患者の生存状態を正確に表現することは難しい。
   * - BIRTH_DATE
     - 
     - datetime
     - | 生年月日
     - | ADT^A08等のPID-7(生年月日)。
   * - DEATH_DATE
     - 
     - datetime
     - 患者の死亡日。NULL 可。
     - | PPR^ZD1のPRB-15(プロブレムのライフサイクル状態の 日付／時刻)、
       | 死亡退院ではADT^A03のPV1-45(退院日時)で表現可能。
   * - SEX_CD*
     - 
     - varchar(50)
     - 性別コード。
     - | ADT^A08等のPID-8(性別)。
       | SS-MIXではM:男性、F:女性、O:その他、U:不明の4つのコードを使用。
   * - AGE_IN_YEARS_NUM*
     - 
     - int
     - 年齢（年単位）。
     - | 直接の対応なし。
       | ADT^A08等のPID-7(生年月日)から計算可能だが、
       | 年齢は静的な値として保存しない方が
       | 良いかもしれない。
   * - LANGUAGE_CD*
     - 
     - varchar(50)
     - 言語コード。
     - 対応なし。SS-MIX2では患者言語を扱わない。
   * - RACE_CD
     - 
     - varchar(50)
     - 人種コード。
     - 対応なし。SS-MIX2では人種を扱わない。
   * - MARITAL_STATUS_CD*
     - 
     - varchar(50)
     - 婚姻状態コード。
     - 対応なし。SS-MIX2では婚姻状態を扱わない。
   * - RELIGION_CD*
     - 
     - varchar(50)
     - 宗教コード。任意列。
     - 対応なし。SS-MIX2では宗教を扱わない。
   * - ZIP_CD*
     - 
     - varchar(10)
     - 郵便番号。
     - | ADT^A08等のPID-11(住所)の一部として表現可能。
   * - STATECITYZIP_PATH
     - 
     - varchar(700)
     - | 階層型地理コード。
       | 患者の住所をある程度のレベルまで階層構造で格納。
       | 東京都文京区本郷ならば `TOKYO\\BUNKYO_KU\\HONGO` のように。
       | 文京区の患者だけ取得したければ、 `TOKYO\\BUNKYO_KU*` 
       | のようにワイルドカード「*」で検索することを目的にしている。
       | この値もOntology Cellのmetadata内で管理するとの記載あり。
     - | ADT^A08等のPID-11(住所)の一部として表現可能。 
   * - PATIENT_BLOB
     - 
     - text
     - | 任意の拡張情報を格納するフィールド。
       | XML形式で格納するようです。
     - | 対応なし。追加情報をどうしても患者テーブルに格納したい場合は、
       | ここに格納するより新規に列を追加した方が良いと思われる。
   * - UPDATE_DATE
     - 
     - datetime
     - レコードが最終更新された日時。
     - | i2b2内でのレコード更新日時を示すものであり、
       | SS-MIX2のデータ項目とは直接対応しない。
   * - DOWNLOAD_DATE
     - 
     - datetime
     - レコードがシステムにダウンロードされた日時。
     - | i2b2内でのレコードダウンロード日時を示すものであり、
       | SS-MIX2のデータ項目とは直接対応しない。
   * - IMPORT_DATE
     - 
     - datetime
     - レコードがインポートされた日時。
     - | i2b2内でのレコードインポート日時を示すものであり、
       | SS-MIX2のデータ項目とは直接対応しない。
   * - SOURCESYSTEM_CD
     - 
     - varchar(50)
     - データのソースシステムを識別するコード。
     - | i2b2内でのデータソース識別コードを示すものであり、
       | SS-MIX2のデータ項目とは直接対応しない。
   * - UPLOAD_ID
     - 
     - int
     - アップロード処理の識別子。
     - | i2b2内でのアップロード処理識別子を示すものであり、
       | SS-MIX2のデータ項目とは直接対応しない。


VITAL_STATUS_CDの推奨表記法
================================

| VITAL_STATUS_CDは患者の生存状態を示すコードですが、標準化されたコード体系は存在しません。
| しかし、i2b2は **2文字コード** で表記することを推奨しています。1文字目は死亡日の精度、2文字目は生年月日の精度を表します。
| 例えば、患者が生存していて生年月日が日単位で正確にわかっている場合、コードは "ND" となります。
| 以下に推奨されるコード表記法を示します。
| (実務上は、生存が"_D", 死亡は"YD"とすることが多いかと思います。)

.. note::

   - 下の表で `*` は二文字目に生年月日に関するコードのことであり、必要に応じて入れることを示しています。
   - 下の表で `_` は一文字目の死亡日に関するコードのことであり、必要に応じて入れることを示しています。

=========  ===========================
値         説明
=========  ===========================
N*         生存（DEATH_DATE が NULL）
U*         不明（DEATH_DATE が NULL）
Z*         死亡（DEATH_DATE が NULL）
Y*         死亡（DEATH_DATE 日単位で正確）
M*         死亡（DEATH_DATE 月単位で正確）
X*         死亡（DEATH_DATE 年単位で正確）
R*         死亡（DEATH_DATE 時単位で正確）
T*         死亡（DEATH_DATE 分単位で正確）
S*         死亡（DEATH_DATE 秒単位で正確）
_L         不明（BIRTH_DATE が NULL）
_D         BIRTH_DATE が 日単位で正確
_B         BIRTH_DATE が 月単位で正確
_F         BIRTH_DATE が 年単位で正確
_H         BIRTH_DATE が 時単位で正確
_I         BIRTH_DATE が 分単位で正確
_C         BIRTH_DATE が 秒単位で正確
=========  ===========================



参考文献
======================
このページは主に `i2b2 Community Wiki <https://community.i2b2.org/wiki/>`_ の内容をもとに作成しました。