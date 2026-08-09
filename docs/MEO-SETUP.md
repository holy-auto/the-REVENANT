# MEO（Googleマップ最適化）セットアップ手順

このサイトは、Googleビジネスプロフィール（GBP）の実データを `data/site.ts` に入力すると、
店舗ページの**構造化データ（LocalBusiness / AutoRepair）・地図埋め込み・営業時間・経路案内・
Google口コミ導線**へ自動的に反映されるよう配線済みです。

MEOの順位は Google の3要素（**関連性・距離・視認性/知名度**）で決まります。
コードで対応できるのは主に「関連性」と「視認性」です。**最大の効果はGBP本体の整備**なので、
下記の入力とあわせてGBP側の運用（後述）を必ず行ってください。

---

## 1. まずGBP（Googleビジネスプロフィール）を整える（最重要）

コードより先に、以下をGBP管理画面で行ってください。順位への寄与が最も大きい項目です。

- [ ] **オーナー確認（verify）** を完了する（日立店・鉾田店それぞれ）
- [ ] **NAP**（店名 / 住所 / 電話）をサイトと**完全一致**させる（表記ゆれ厳禁）
- [ ] **主カテゴリ**を「カーコーティング店」など最適なものに設定、副カテゴリに「洗車場」「自動車修理・整備」等を追加
- [ ] **営業時間**（祝日・臨時も）を設定
- [ ] **写真**を継続的に追加（外観・内観・施工前後）— 施工写真は関連性に効く
- [ ] **サービス / メニュー**（コーティング・研磨・手洗い洗車）を登録
- [ ] **属性**（駐車場、支払い方法、バリアフリー等）を設定
- [ ] **投稿（Google Posts）** を定期更新（キャンペーン・事例）
- [ ] **口コミ**を依頼し、**すべてに返信**する（視認性に直結）
- [ ] サービス提供地域（東海村・常陸太田市・大洗町 等）を登録

---

## 2. `data/site.ts` の `storeSeo` に実データを入力

`hitachi` / `hokota` それぞれ、以下のプレースホルダーを実値に置き換えます。
**空欄の項目は構造化データに出力しません（虚偽を出さない設計）。**

| フィールド | 説明 | 例 |
| --- | --- | --- |
| `streetAddress` | 番地まで（GBPと一致） | `幸町1-1-1` |
| `postalCode` | 郵便番号 | `317-0073` |
| `latitude` / `longitude` | 緯度・経度（GBPのピン位置） | `36.5991`, `140.6510` |
| `googleMapsUrl` | GBPの共有リンク（地図で見る） | `https://maps.app.goo.gl/xxxx` |
| `googleReviewUrl` | 口コミ投稿リンク（後述の取得方法） | `https://g.page/r/xxxx/review` |
| `googleBusinessProfileUrl` | GBP公開ページURL（`sameAs`用） | `https://g.co/kgs/xxxx` |
| `placeId` | Place ID（経路案内・口コミ同期用） | `ChIJxxxxxxxx` |
| `openingHours` | 営業時間（曜日・開閉） | 下記参照 |
| `paymentAccepted` | 支払い方法（設定時のみ出力） | `['現金','クレジットカード','QRコード決済']` |
| `priceRange` | 価格帯記号 | `¥¥` |

### 緯度・経度 / Place ID の調べ方
- 緯度経度：Googleマップで店舗ピンを右クリック→先頭に数値が表示されます。
- Place ID：[Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder) で店名検索。

### `googleReviewUrl`（口コミ投稿リンク）の作り方
GBP管理画面 →「レビューを増やす」→ リンクをコピー、
または `https://search.google.com/local/writereview?placeid=<PLACE_ID>` の形式。

### `openingHours` の書き方
```ts
openingHours: [
  { days: ['Mo','Tu','We','Th','Fr'], opens: '10:00', closes: '19:00' },
  { days: ['Sa','Su'],                opens: '10:00', closes: '18:00' },
],
```
`days` は `Mo Tu We Th Fr Sa Su`。定休日はその曜日を含めなければOK（出力されません）。

---

## 3. `data/site.ts` の `stores`（表示用テキスト）も更新

- `address`：住所（表示用テキスト。`storeSeo.streetAddress` とNAP一致させる）
- `phone`：電話番号（`tel:` リンクにも使用）
- `hours`：営業時間テキスト（`openingHours` 未設定時のフォールバック表示）
- `mapUrl`：不要（`storeSeo.googleMapsUrl` を使用）

---

## 4. 口コミの掲載（任意・虚偽厳禁）

`data/site.ts` の `storeReviews`、またはSupabaseの `reviews` テーブルに
**実在する口コミのみ**を入力すると、店舗ページと `/voices` に表示され、
`aggregateRating` / `review` 構造化データが出力されます（星評価リッチリザルト候補）。
**捏造・自作自演は絶対に入れない**でください（ガイドライン違反＋景表法リスク）。

---

## 5. 反映されるもの（入力後に自動で有効化）

- 店舗ページに **Googleマップ埋め込み**（緯度経度設定時）
- **営業時間テーブル** / **経路案内リンク** / **電話タップ発信**
- LocalBusiness(AutoRepair) 構造化データに
  `geo` / `openingHoursSpecification` / `hasMap` / `sameAs`(GBP・口コミ) / `paymentAccepted` を出力
- 口コミ入力時は `aggregateRating` と `review`

---

## 6. 公開後にやること

- [ ] Google Search Console に登録し `sitemap.xml` を送信（`NEXT_PUBLIC_GSC_VERIFICATION` を設定）
- [ ] [リッチリザルトテスト](https://search.google.com/test/rich-results) で各店舗ページの LocalBusiness を検証
- [ ] GBPの口コミ返信・写真追加・投稿を**継続**（MEOは運用で伸びます）
