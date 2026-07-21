export const site = {
  name: 'THE REVENANT',
  concept: '地域の愛車の、かかりつけ磨きサロン。',
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  instagramUrl: 'https://www.instagram.com/the_revenant2022/',
  lineUrl: process.env.NEXT_PUBLIC_LINE_URL || '#line-url-placeholder',
  ogImage: '/images/og.svg',
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '',
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
};
export const stores = [
  { id:'hitachi', name:'日立店', slug:'/stores/hitachi', area:'日立市', title:'日立市のカーコーティング・車磨き相談窓口', description:'日立市でカーコーティングや車磨きを検討している方へ。車の状態、保管環境、予算を確認し、必要な施工だけを一緒に考えます。', phone:'000-0000-0000', address:'茨城県日立市（正式住所を設定してください）', hours:'営業時間を設定してください', mapUrl:'#map-url-placeholder', serviceAreas:['東海村','常陸太田市','高萩市','その他の日立店周辺地域']},
  { id:'hokota', name:'鉾田店', slug:'/stores/hokota', area:'鉾田市', title:'鉾田市のカーコーティング・車磨き相談窓口', description:'鉾田市でカーコーティングや車磨きを検討している方へ。普段の使い方に合う守り方を、写真相談から気軽にご相談いただけます。', phone:'000-0000-0000', address:'茨城県鉾田市（正式住所を設定してください）', hours:'営業時間を設定してください', mapUrl:'#map-url-placeholder', serviceAreas:['大洗町','小美玉市','鹿嶋市','行方市','その他の鉾田店周辺地域']},
] as const;
export const menus = [
  { slug:'/menus/coating', name:'コーティングメニュー', summary:'新車・経年車それぞれの状態に合わせ、塗装を守る施工を提案します。', price:'料金は車種・状態確認後にご案内' },
  { slug:'/menus/polishing', name:'車磨き・下地処理', summary:'洗車傷、くすみ、水シミなどを確認し、必要な範囲で塗装面を整えます。', price:'状態により変動' },
  { slug:'/menus/maintenance', name:'メンテナンス・手洗い洗車', summary:'施工後のきれいを保つための洗車やメンテナンス相談に対応します。', price:'店舗へお問い合わせください' },
];
export const prices = [
  { item:'写真相談・現車確認', range:'無料相談枠として設定予定', note:'正式な運用ルールを設定してください' },
  { item:'新車コーティング', range:'要見積もり', note:'車種サイズ・保管環境で提案内容が変わります' },
  { item:'経年車研磨＋コーティング', range:'要見積もり', note:'塗装状態と磨き工程により変動します' },
  { item:'メンテナンス洗車', range:'要見積もり', note:'施工歴と汚れ方を確認します' },
];
export const faqs = [
  ['初めてでも相談できますか？','はい。専門用語を前提にせず、写真や現車の状態を見ながら必要な施工を一緒に整理します。'],
  ['新車でも磨きは必要ですか？','車両状態により異なります。納車直後でも軽い付着物や洗車傷がある場合があるため、確認して必要な範囲だけご提案します。'],
  ['料金はどこで分かりますか？','料金の目安ページに考え方を掲載しています。正式金額は車種、状態、希望内容を確認してからご案内します。'],
  ['写真だけで相談できますか？','可能です。気になる部分、車種、保管環境が分かる写真を送っていただくと案内しやすくなります。'],
];
export const cases = [{ slug:'hitachi-toyota-alphard-polish-coating', store:'日立店', area:'日立市', maker:'トヨタ', car:'アルファード', age:'経年車', title:'日立市｜トヨタ・アルファード｜経年車研磨＋コーティング', concern:'黒いボディの洗車傷とくすみが気になる', condition:'写真差し替え前のサンプル事例です。実施工情報に更新してください。', proposal:'塗装状態を確認し、必要な研磨と保護施工を組み合わせる設計。', menu:'車磨き・下地処理／コーティング', days:'要確認', price:'要確認', comment:'実際の担当者コメントに差し替えてください。'}];
