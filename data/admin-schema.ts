// 管理画面（CMS）の各テーブル定義。フォーム・一覧・保存処理はこの設定から生成する。
export type FieldType = 'text' | 'textarea' | 'number' | 'bool' | 'select';

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  nullable?: boolean; // 空文字を null として保存する
  help?: string;
};

export type TableCfg = {
  label: string;
  description: string;
  select: string;
  order?: { column: string; ascending: boolean };
  fields: Field[];
  listCols: string[]; // 一覧の見出しに使うフィールド
  revalidate?: string[]; // 保存後に再生成する公開ページ
};

const STORE_OPTIONS = [
  { value: 'hitachi', label: '日立店' },
  { value: 'hokota', label: '鉾田店' },
];

export const TABLES = {
  posts: {
    label: 'ブログ',
    description: '店舗ごとのブログ記事。',
    select: 'id,store_id,slug,title,excerpt,body,cover_image,published,published_at',
    order: { column: 'published_at', ascending: false },
    listCols: ['title', 'store_id', 'published'],
    revalidate: ['/blog', '/'],
    fields: [
      { name: 'store_id', label: '店舗', type: 'select', options: STORE_OPTIONS },
      { name: 'slug', label: 'スラッグ（URL）', type: 'text', help: '半角英数とハイフン。例: hitachi-first-post' },
      { name: 'title', label: 'タイトル', type: 'text' },
      { name: 'excerpt', label: '抜粋', type: 'textarea', nullable: true },
      { name: 'body', label: '本文', type: 'textarea' },
      { name: 'cover_image', label: 'カバー画像URL', type: 'text', nullable: true },
      { name: 'published_at', label: '公開日時', type: 'text', help: '例: 2026-08-09T09:00:00Z' },
      { name: 'published', label: '公開する', type: 'bool' },
    ],
  },
  cases: {
    label: '施工事例',
    description: '店舗ごとの施工事例。',
    select: 'id,store_id,slug,title,area,maker,car,age,concern,condition,proposal,menu,days,price,comment,published',
    order: { column: 'published_at', ascending: false },
    listCols: ['title', 'store_id', 'published'],
    revalidate: ['/works', '/'],
    fields: [
      { name: 'store_id', label: '店舗', type: 'select', options: STORE_OPTIONS },
      { name: 'slug', label: 'スラッグ（URL）', type: 'text' },
      { name: 'title', label: 'タイトル', type: 'text' },
      { name: 'area', label: 'エリア', type: 'text' },
      { name: 'maker', label: 'メーカー', type: 'text' },
      { name: 'car', label: '車種', type: 'text' },
      { name: 'age', label: '年式区分', type: 'text', help: '例: 新車 / 経年車' },
      { name: 'concern', label: 'お悩み', type: 'textarea' },
      { name: 'condition', label: '状態', type: 'textarea' },
      { name: 'proposal', label: 'ご提案', type: 'textarea' },
      { name: 'menu', label: '施工メニュー', type: 'text' },
      { name: 'days', label: '作業日数', type: 'text' },
      { name: 'price', label: '料金', type: 'text' },
      { name: 'comment', label: '担当者コメント', type: 'textarea' },
      { name: 'published', label: '公開する', type: 'bool' },
    ],
  },
  menus: {
    label: '施工メニュー',
    description: 'トップ店内やメニューページに出るメニュー一覧。',
    select: 'id,slug,name,summary,price,sort,published',
    order: { column: 'sort', ascending: true },
    listCols: ['name', 'price', 'published'],
    revalidate: ['/', '/menus/coating', '/menus/polishing', '/menus/maintenance'],
    fields: [
      { name: 'slug', label: 'スラッグ（URL）', type: 'text', help: '例: /menus/coating' },
      { name: 'name', label: 'メニュー名', type: 'text' },
      { name: 'summary', label: '説明', type: 'textarea' },
      { name: 'price', label: '料金表記', type: 'text', help: '例: 料金は車種・状態確認後にご案内' },
      { name: 'sort', label: '並び順', type: 'number' },
      { name: 'published', label: '公開する', type: 'bool' },
    ],
  },
  price_matrix: {
    label: '価格シミュレーション',
    description: '価格シミュレーターの目安レンジ（施工 × 車格）。',
    select: 'id,service,size,min_price,max_price,published',
    order: { column: 'service', ascending: true },
    listCols: ['service', 'size', 'min_price', 'max_price'],
    revalidate: ['/'],
    fields: [
      {
        name: 'service',
        label: '施工',
        type: 'select',
        options: [
          { value: 'coating', label: '新車コーティング' },
          { value: 'polish', label: '経年車 研磨＋コーティング' },
          { value: 'wash', label: 'メンテナンス・手洗い洗車' },
        ],
      },
      {
        name: 'size',
        label: '車格',
        type: 'select',
        options: [
          { value: 'S', label: 'S（軽・コンパクト）' },
          { value: 'M', label: 'M（普通車・小型SUV）' },
          { value: 'L', label: 'L（ミニバン・大型SUV）' },
          { value: 'XL', label: 'XL（特大・輸入車）' },
        ],
      },
      { name: 'min_price', label: '下限（円）', type: 'number' },
      { name: 'max_price', label: '上限（円）', type: 'number' },
      { name: 'published', label: '有効', type: 'bool' },
    ],
  },
  faqs: {
    label: 'Q&A',
    description: 'よくある質問。店舗を空にすると全店共通になります。',
    select: 'id,store_id,question,answer,sort,published',
    order: { column: 'sort', ascending: true },
    listCols: ['question', 'store_id', 'published'],
    revalidate: ['/', '/faq'],
    fields: [
      { name: 'store_id', label: '店舗', type: 'select', options: STORE_OPTIONS, nullable: true, help: '空＝全店共通' },
      { name: 'question', label: '質問', type: 'text' },
      { name: 'answer', label: '回答', type: 'textarea' },
      { name: 'sort', label: '並び順', type: 'number' },
      { name: 'published', label: '公開する', type: 'bool' },
    ],
  },
  reviews: {
    label: '口コミ',
    description: '実際にいただいた口コミのみを掲載してください。',
    select: 'id,store_id,author,rating,text,review_date,source,sort,published',
    order: { column: 'sort', ascending: true },
    listCols: ['author', 'store_id', 'rating', 'published'],
    revalidate: ['/voices', '/stores/hitachi', '/stores/hokota'],
    fields: [
      { name: 'store_id', label: '店舗', type: 'select', options: STORE_OPTIONS },
      { name: 'author', label: 'お名前', type: 'text' },
      { name: 'rating', label: '評価（1〜5）', type: 'number' },
      { name: 'text', label: '本文', type: 'textarea' },
      { name: 'review_date', label: '日付', type: 'text', help: '例: 2026-08-01' },
      {
        name: 'source',
        label: '出所',
        type: 'select',
        options: [
          { value: 'manual', label: '手入力' },
          { value: 'google', label: 'Google口コミ' },
        ],
      },
      { name: 'sort', label: '並び順', type: 'number' },
      { name: 'published', label: '公開する', type: 'bool' },
    ],
  },
} satisfies Record<string, TableCfg>;

export type TableKey = keyof typeof TABLES;

export function isTableKey(v: string): v is TableKey {
  return Object.prototype.hasOwnProperty.call(TABLES, v);
}
