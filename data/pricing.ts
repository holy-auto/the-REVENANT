// 公式料金表（THE REVENANT ボディーコーティングメニュー）。
// 画像の料金表をそのままデータ化したもの。金額はすべて税込。
// ※この表は /prices ページに描画されます。金額の変更はこのファイルを編集してください。

export type Cell = number | string; // 数値=円、文字列="要相談"など
export type PriceRow = {
  label: string;
  sub?: string;
  values: Cell[];
  trailing?: string; // 末尾列（施工日数など）
  accent?: string; // 行の色アクセント（コーティング等級）
};
export type PriceGrid = {
  id: string;
  title: string;
  columns: string[];
  trailingHeader?: string;
  rows: PriceRow[];
  note?: string;
};

// 車格サイズ SS/S/M/L/XL
const SIZE = ['SS', 'S', 'M', 'L', 'XL'];

export const bodyCoating: PriceGrid = {
  id: 'body-coating',
  title: 'ボディーコーティング',
  columns: SIZE,
  trailingHeader: '施工日数',
  rows: [
    { label: 'ピュアコート', accent: '#1f9d55', values: [88000, 99000, 121000, 132000, 154000], trailing: '1〜2日' },
    { label: 'セラミックコート', accent: '#0878e8', values: [121000, 132000, 154000, 176000, 198000], trailing: '2〜3日' },
    { label: 'セラミックプラス', accent: '#e8850c', values: [154000, 176000, 198000, 220000, 242000], trailing: '4〜5日' },
    { label: 'プレミアム', accent: '#8a3ffc', values: [198000, 220000, 242000, 264000, 286000], trailing: '4〜5日' },
    { label: '極み', accent: '#c9a227', values: [286000, 308000, 330000, 352000, 374000], trailing: '1週間〜' },
  ],
  note: '※車両の状態やサイズにより、施工日数が前後する場合がございます。XL以上のサイズは要相談となります。',
};

export const maintenance: PriceGrid = {
  id: 'maintenance',
  title: 'メンテナンス',
  columns: SIZE,
  rows: [
    { label: '半年入庫', values: [9900, 11000, 12100, 13200, 14300] },
    { label: '1年入庫', values: [12100, 13200, 14300, 15400, 16500] },
  ],
};

export const carWash: PriceGrid = {
  id: 'car-wash',
  title: '洗車',
  columns: SIZE,
  rows: [
    { label: '手洗い洗車', values: [4000, 4500, 5000, 5500, 6000] },
    { label: '3PH(メンテナンス)洗車', values: [8000, 9000, 10000, 11000, 12000] },
    { label: '徹底洗車', values: [16000, 18000, 20000, 22000, 24000] },
    { label: '（トップコート）', values: [1500, 1500, 2000, 2000, 2500] },
  ],
};

export const polishing: PriceGrid = {
  id: 'polishing',
  title: '磨き',
  columns: SIZE,
  rows: [
    { label: 'ライトポリッシュ', values: [27500, 33000, 38500, 44000, 49500] },
    { label: 'スタンダードポリッシュ', values: [55000, 66000, 77000, 88000, 99000] },
    { label: 'プレミアムポリッシュ', values: [68750, 82500, 96250, 110000, 123750] },
    { label: '細部 極み', values: [110000, 132000, 154000, 176000, 198000] },
  ],
};

export const resinCoat: PriceGrid = {
  id: 'resin-coat',
  title: '樹脂クリーニング＋コート',
  columns: SIZE,
  rows: [{ label: '樹脂クリーニング＋コート', values: [7700, 8800, 11000, 12100, 13200] }],
};

export const interior: PriceGrid = {
  id: 'interior',
  title: '内装クリーニング',
  columns: ['2人乗り', '4〜5人(2列)', '6〜8人(3列)', '9人以上'],
  rows: [
    { label: 'ライト', values: [3300, 5500, 7700, 9900] },
    { label: 'スタンダード', values: [9900, 16500, 23100, 29700] },
    { label: 'プレミアム', values: [29700, 49500, 69300, 89100] },
    { label: 'コーティングシートのみ', values: [18000, 33000, 49500, 55000] },
    { label: '内装フルコース', values: [36000, 66000, 99000, 110000] },
  ],
};

export const wheelCoat: PriceGrid = {
  id: 'wheel-coat',
  title: 'ホイールクリーニング＋コート',
  columns: ['12〜14', '15〜17', '18〜20', '21〜23', '24〜'],
  rows: [{ label: 'ホイール（インチ）', values: [25000, 27500, 30000, 32500, '要相談'] }],
  note: '※インチごとに料金が異なります。',
};

export const glassCoat: PriceGrid = {
  id: 'glass-coat',
  title: 'ガラス研磨＋コート',
  columns: ['F', 'F&R', 'フル'],
  rows: [
    { label: 'UME（ライト）', values: [8800, 14300, 27500] },
    { label: 'TAKE（ミディアム）', values: [13200, 21450, 41250] },
    { label: 'MATU（ディープ）', values: [19800, 32175, 61875] },
  ],
};

// 単品メニュー（サイズ別グリッド群）
export const alacarteGrids: PriceGrid[] = [carWash, polishing, resinCoat, interior, wheelCoat, glassCoat];

export const kiwamiCourse = {
  title: '極み',
  subtitle: '極み職人稼働',
  body:
    '細部まで徹底的に美しく仕上げる、最高級のプレミアムコース。美しさ・艶・耐久性、すべてを極めた特別な一台に。' +
    '車種・状態・ご要望に合わせて、細かくご相談・お見積り可能です。',
};

export const serviceBadges = ['代車無料', 'カード決済OK', '各種保険対応', 'お得なセット割引あり'];

export const priceNotes = [
  '※表示価格はすべて税込です。',
  '※車種・状態・オプション料金が変動する場合がございます。詳しくはスタッフまでお問い合わせください。',
];

// 車格サイズの目安（SS〜XL）
export const sizeLegend: { code: string; label: string }[] = [
  { code: 'SS', label: '軽自動車' },
  { code: 'S', label: 'コンパクトカー' },
  { code: 'M', label: '普通車・セダン' },
  { code: 'L', label: 'ミニバン・大型SUV' },
  { code: 'XL', label: '大型車・一部輸入車' },
];
