'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { site } from '@/data/site';
import { StoreSkyImage } from '@/components/SkyAtmosphere';
import type { BlogPost, CaseStudy, MenuItem, PriceMatrix, Faq } from '@/data/content';

type Phase = 'select' | 'inside';
type StoreId = 'hitachi' | 'hokota';

const doorVisuals: Record<StoreId, { image: string; catchcopy: string; area: string; name: string }> = {
  hitachi: {
    // 時刻＋天気で出し分け（sky/ 配下）。これは最終フォールバック用の静止画。
    image: '/images/stores/hitachi/exterior-front.svg',
    catchcopy: '磨きの仕上がりまで、じっくり相談。',
    area: '日立市',
    name: '日立店',
  },
  hokota: {
    image: '/images/stores/hokota/exterior-front.svg',
    catchcopy: '毎日の乗り方に合う、愛車の守り方。',
    area: '鉾田市',
    name: '鉾田店',
  },
};

// トップビューでの店舗の並び順（左 → 右）。
const storeOrder: StoreId[] = ['hokota', 'hitachi'];

type HotspotId = 'menu' | 'price' | 'qa' | 'craft' | 'blog' | 'works';

// 共通のポイント内容（ラベル・見出し）。座標・場所名は店舗ごとに設定。
const hotspotContent: Record<HotspotId, { label: string; kicker: string }> = {
  menu: { label: '施工メニュー', kicker: 'MENU' },
  price: { label: '価格シミュレーション', kicker: 'ESTIMATE' },
  qa: { label: 'Q&A', kicker: 'Q&A' },
  craft: { label: 'こだわり', kicker: 'CRAFT' },
  blog: { label: 'ブログ', kicker: 'BLOG' },
  works: { label: '施工事例', kicker: 'WORKS' },
};

type HotspotSpot = { id: HotspotId; x: number; y: number; spot: string };

// 店内画像上でのポイント配置（店舗ごとに画像が違うため位置を分ける）。
const hotspotLayout: Record<StoreId, HotspotSpot[]> = {
  hitachi: [
    { id: 'menu', x: 0.352, y: 0.47, spot: '棚・掲示ボード' },
    { id: 'price', x: 0.6, y: 0.505, spot: '受付カウンター' },
    { id: 'qa', x: 0.208, y: 0.62, spot: '商談テーブル' },
    { id: 'craft', x: 0.642, y: 0.26, spot: '壁の掲示' },
    { id: 'blog', x: 0.27, y: 0.30, spot: '壁の時計まわり' },
    { id: 'works', x: 0.86, y: 0.34, spot: '窓ぎわの棚' },
  ],
  hokota: [
    { id: 'menu', x: 0.378, y: 0.5, spot: '施工ガレージ' },
    { id: 'price', x: 0.607, y: 0.565, spot: '受付コンテナ' },
    { id: 'qa', x: 0.802, y: 0.565, spot: '保管ガレージ' },
    { id: 'craft', x: 0.232, y: 0.6, spot: '入口ゲート' },
    { id: 'blog', x: 0.5, y: 0.72, spot: '掲示スタンド' },
    { id: 'works', x: 0.915, y: 0.5, spot: '保管棟のボード' },
  ],
};

const interiorScenes: Record<StoreId, { image: string; alt: string }> = {
  hitachi: {
    image: '/images/stores/hitachi/interior-scene.svg',
    alt: 'THE REVENANT日立店の店内。商談テーブル、受付カウンター、メニュー棚が見える。',
  },
  hokota: {
    image: '/images/stores/hokota/interior-scene.svg',
    alt: 'THE REVENANT鉾田店の敷地。施工ガレージ、受付コンテナ、保管ガレージが見える。',
  },
};

const ZOOM = 2.4;

// オープニングの表示時間（ms）。Netflix 風のタイトル演出 → 店選びへ。
const INTRO_HOLD = 3600;
const INTRO_HOLD_REDUCED = 1900;

export function StoreJourney({
  postsByStore = { hitachi: [], hokota: [] },
  casesByStore = { hitachi: [], hokota: [] },
  faqsByStore = { hitachi: [], hokota: [] },
  menus = [],
  priceMatrix = {},
}: {
  postsByStore?: Record<StoreId, BlogPost[]>;
  casesByStore?: Record<StoreId, CaseStudy[]>;
  faqsByStore?: Record<StoreId, Faq[]>;
  menus?: MenuItem[];
  priceMatrix?: PriceMatrix;
}) {
  const [phase, setPhase] = useState<Phase>('select');
  const [store, setStore] = useState<StoreId>('hitachi');
  const [entering, setEntering] = useState<StoreId | null>(null);
  const [active, setActive] = useState<HotspotId | null>(null);
  const [transform, setTransform] = useState('translate(0px, 0px) scale(1)');
  // Full-screen welcome shown once on load, then it clears into the top view.
  const [intro, setIntro] = useState(true);

  const stageRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const computeTransform = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    // On mobile the scene is a swipeable panorama, not a zoom target.
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTransform('translate(0px, 0px) scale(1)');
      return;
    }
    const spot = hotspotLayout[store].find((h) => h.id === active);
    if (!spot) {
      setTransform('translate(0px, 0px) scale(1)');
      return;
    }
    const { width: W, height: H } = el.getBoundingClientRect();
    const s = ZOOM;
    const fx = spot.x * W;
    const fy = spot.y * H;
    let tx = W / 2 - fx * s;
    let ty = H / 2 - fy * s;
    // Keep the scene covering the stage (no empty edges).
    tx = Math.min(0, Math.max(W - W * s, tx));
    ty = Math.min(0, Math.max(H - H * s, ty));
    setTransform(`translate(${tx}px, ${ty}px) scale(${s})`);
  }, [active, store]);

  useEffect(() => {
    computeTransform();
  }, [computeTransform]);

  useEffect(() => {
    const onResize = () => computeTransform();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [computeTransform]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (active) setActive(null);
      else if (phase === 'inside') backToSelect();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, phase]);

  useEffect(() => {
    return () => {
      if (enterTimer.current) clearTimeout(enterTimer.current);
    };
  }, []);

  // イントロの終了はタイプライター（IntroStory）が駆動する。
  // ただし何らかの理由でタイマーが進まない場合の保険として最大表示時間を設ける。
  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 9000);
    return () => clearTimeout(t);
  }, []);

  // ヘッダーのロゴ（/ へのリンク）はトップページでは同一URLのため既定では無反応。
  // トップページにいる間は、ロゴのクリックで店内・パネルを閉じてトップビューへ戻す。
  useEffect(() => {
    const logo = document.querySelector<HTMLAnchorElement>('.brand-sign');
    if (!logo) return;
    const onClick = (e: MouseEvent) => {
      // 修飾キー付き（新規タブ等）はブラウザ既定に任せる。
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      setActive(null);
      setPhase('select');
      setIntro(false);
    };
    logo.addEventListener('click', onClick);
    return () => logo.removeEventListener('click', onClick);
  }, []);

  // Center the panorama when entering a store so it reads as "look around".
  useEffect(() => {
    if (phase !== 'inside') return;
    const el = viewRef.current;
    if (!el) return;
    el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2);
  }, [phase, store]);

  function enterStore(id: StoreId) {
    setEntering(id);
    if (enterTimer.current) clearTimeout(enterTimer.current);
    enterTimer.current = setTimeout(() => {
      setStore(id);
      setActive(null);
      setPhase('inside');
      setEntering(null);
    }, 720);
  }

  function backToSelect() {
    setActive(null);
    setPhase('select');
  }

  if (phase === 'select') {
    return (
      <section className="station-journey" aria-label="相談する店舗を選ぶ">
        <div className="journey-topbar">
          <p>THE REVENANT / STORE ENTRANCE</p>
          <p>2 STORES ・ <span>相談したい店舗を選ぶ</span></p>
        </div>
        <div className="store-doors" aria-label="相談する店舗を選ぶ">
          {storeOrder.map((id) => {
            const v = doorVisuals[id];
            const isEntering = entering === id;
            const isDimmed = entering !== null && entering !== id;
            return (
              <button
                type="button"
                key={id}
                className={`store-door store-door-${id}${isEntering ? ' is-entering' : ''}${isDimmed ? ' is-dimmed' : ''}`}
                onClick={() => enterStore(id)}
                aria-label={`${v.name}の店内に入る`}
                disabled={entering !== null}
              >
                <StoreSkyImage store={id} className="store-door-image" alt="" fallback={v.image} />
                <span className="store-door-shade" />
                <span className="door-copy">
                  <small>{v.area} / CAR DETAILING</small>
                  <strong>{v.name}</strong>
                  <em>{v.catchcopy}</em>
                </span>
                <span className="door-enter">
                  <span className="door-enter-btn">入店する <b aria-hidden="true">→</b></span>
                </span>
                {isEntering && <span className="door-entering">OPEN…</span>}
              </button>
            );
          })}
        </div>

        <div
          className={`journey-intro${intro ? '' : ' is-done'}`}
          role="presentation"
          aria-hidden={intro ? undefined : 'true'}
          onClick={() => setIntro(false)}
        >
          <IntroStory active={intro} onFinish={() => setIntro(false)} />
        </div>
      </section>
    );
  }

  const current = doorVisuals[store];

  return (
    <section className="station-journey" aria-label={`${current.name}の店内`}>
      <div className="sj-inside">
        <div className="sj-topbar">
          <button type="button" className="sj-back" onClick={backToSelect}>
            ← 店舗選択にもどる
          </button>
          <span className="sj-store-name">{current.name} / IN-STORE</span>
          <Link className="sj-back sj-back-store" href={`/stores/${store}`}>
            店舗ページ
          </Link>
        </div>

        <div className="sj-stage" ref={stageRef}>
          <div className="sj-view" ref={viewRef} style={{ transform }} data-zoomed={active ? 'true' : 'false'}>
            <div className="sj-track">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {store === 'hokota' ? (
                // 鉾田の店内は屋外の敷地ビューなので、時刻＋天気で出し分ける。
                <StoreSkyImage
                  store={store}
                  kind="interior"
                  className="sj-scene"
                  alt={interiorScenes[store].alt}
                  fallback={interiorScenes[store].image}
                />
              ) : (
                // 日立の店内は屋内シーン（空が見えない）ため静止のまま。
                // eslint-disable-next-line @next/next/no-img-element
                <img className="sj-scene" src={interiorScenes[store].image} alt={interiorScenes[store].alt} />
              )}

              {hotspotLayout[store].map((h) => {
                const content = hotspotContent[h.id];
                return (
                  <button
                    type="button"
                    key={h.id}
                    className={`sj-hotspot sj-hotspot-${h.id}`}
                    style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
                    onClick={() => setActive(h.id)}
                    aria-label={`${content.label}を見る（${h.spot}）`}
                  >
                    <span className="sj-hotspot-dot" aria-hidden="true">
                      +
                    </span>
                    <span className="sj-hotspot-label">{content.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {!active && (
            <p className="sj-guide">
              気になる場所をタップすると、そこへ近づいて相談内容が開きます。
            </p>
          )}

          {active && (
            <HotspotPanel
              id={active}
              storeName={current.name}
              posts={postsByStore[store] ?? []}
              cases={casesByStore[store] ?? []}
              faqs={faqsByStore[store] ?? []}
              menus={menus}
              priceMatrix={priceMatrix}
              onClose={() => setActive(null)}
            />
          )}
        </div>
      </div>
    </section>
  );
}

// Netflix のタイトルカード風オープニング。黒背景に「THE REVENANT」の赤文字が
// ライトの光で照らされて浮かび上がり、店選びへ。タップでスキップ、reduce-motion 対応。
function IntroStory({ active, onFinish }: { active: boolean; onFinish: () => void }) {
  const [reduced, setReduced] = useState(false);
  const finishRef = useRef(onFinish);
  useEffect(() => {
    finishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // 歓迎アニメが一巡したら店選びへ。
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => finishRef.current(), reduced ? INTRO_HOLD_REDUCED : INTRO_HOLD);
    return () => clearTimeout(t);
  }, [active, reduced]);

  return (
    <div className="nf-stage">
      <h1 className="nf-logo" data-text="THE REVENANT" aria-label="THE REVENANT">
        THE REVENANT
      </h1>
      <p className="nf-tagline" aria-hidden="true">CAR COATING &amp; DETAILING</p>
      <p className="sr-only">THE REVENANT｜愛車のかかりつけ店へようこそ。相談したい店舗をえらべます。</p>
    </div>
  );
}

function HotspotPanel({
  id,
  storeName,
  posts,
  cases,
  faqs,
  menus,
  priceMatrix,
  onClose,
}: {
  id: HotspotId;
  storeName: string;
  posts: BlogPost[];
  cases: CaseStudy[];
  faqs: Faq[];
  menus: MenuItem[];
  priceMatrix: PriceMatrix;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const meta = hotspotContent[id];

  useEffect(() => {
    const t = setTimeout(() => closeRef.current?.focus(), 480);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="sj-panel" role="dialog" aria-modal="false" aria-labelledby="sj-panel-title">
      <button type="button" ref={closeRef} className="sj-panel-close" onClick={onClose} aria-label="店内にもどる">
        ×
      </button>
      <nav className="sj-crumbs" aria-label="パンくずリスト">
        <Link href="/">TOP</Link>
        <span aria-hidden="true">›</span>
        <button type="button" onClick={onClose}>{storeName}</button>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{meta.label}</span>
      </nav>
      <p className="sj-panel-kicker">{meta.kicker}</p>
      <h2 id="sj-panel-title">{meta.label}</h2>

      {id === 'menu' && <MenuContent menus={menus} />}
      {id === 'price' && <PriceSimulator priceMatrix={priceMatrix} />}
      {id === 'qa' && <QaContent faqs={faqs} />}
      {id === 'craft' && <CraftContent />}
      {id === 'blog' && <BlogContent posts={posts} />}
      {id === 'works' && <CasesContent cases={cases} />}

      <button type="button" className="sj-room-back" onClick={onClose}>
        ← 店内を見わたす
      </button>
    </section>
  );
}

function BlogContent({ posts }: { posts: BlogPost[] }) {
  return (
    <>
      <p className="sj-lead">この店舗の最新のブログです。施工の様子やお知らせをお届けします。</p>
      {posts.length > 0 ? (
        <ul className="sj-post-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`}>
                <strong>{p.title}</strong>
                {p.excerpt && <span>{p.excerpt}</span>}
                <em>{formatDate(p.published_at)}</em>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="sj-result-empty">ただいま準備中です。まもなく最初の記事を公開します。</p>
      )}
      <div className="sj-cta-row">
        <Link className="btn btn-primary" href="/blog">
          ブログ一覧を見る
        </Link>
      </div>
    </>
  );
}

function CasesContent({ cases }: { cases: CaseStudy[] }) {
  return (
    <>
      <p className="sj-lead">この店舗での施工事例です。車種・お悩みごとの仕上がりをご覧いただけます。</p>
      {cases.length > 0 ? (
        <ul className="sj-post-list">
          {cases.map((c) => (
            <li key={c.slug}>
              <Link href={`/works/${c.slug}`}>
                <strong>{c.title}</strong>
                <span>{c.maker}・{c.car}／{c.menu}</span>
                <em>{c.area}</em>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="sj-result-empty">ただいま準備中です。施工事例は順次掲載していきます。</p>
      )}
      <div className="sj-cta-row">
        <Link className="btn btn-primary" href="/works">
          施工事例をもっと見る
        </Link>
      </div>
    </>
  );
}

function formatDate(iso: string): string {
  // published_at (ISO) を YYYY.MM.DD 表記に。パースできなければそのまま。
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[1]}.${m[2]}.${m[3]}` : iso;
}

function MenuContent({ menus }: { menus: MenuItem[] }) {
  return (
    <>
      <p className="sj-lead">状態と使い方に合わせて、必要な施工だけをご提案します。気になるメニューから相談できます。</p>
      <ul className="sj-menu-list">
        {menus.map((m) => (
          <li key={m.slug}>
            <Link href={m.slug}>
              <strong>{m.name}</strong>
              <span>{m.summary}</span>
              <em>{m.price}</em>
            </Link>
          </li>
        ))}
      </ul>
      <div className="sj-cta-row">
        <Link className="btn btn-primary" href="/prices">
          料金の考え方を見る
        </Link>
      </div>
    </>
  );
}

type Size = 'SS' | 'S' | 'M' | 'L' | 'XL';
type Service = 'coating' | 'polish' | 'wash';

const sizeOptions: { id: Size; label: string; note: string }[] = [
  { id: 'SS', label: '軽自動車', note: 'SS' },
  { id: 'S', label: 'コンパクトカー', note: 'S' },
  { id: 'M', label: '普通車・セダン', note: 'M' },
  { id: 'L', label: 'ミニバン・大型SUV', note: 'L / アルファード級' },
  { id: 'XL', label: '大型車・一部輸入車', note: 'XL' },
];

const serviceOptions: { id: Service; label: string; desc: string; menu: string }[] = [
  { id: 'coating', label: 'ボディーコーティング', desc: '塗装を守る保護施工（ピュア〜プレミアム）', menu: '/menus/coating' },
  { id: 'polish', label: '車磨き・ポリッシュ', desc: '洗車傷・くすみを整える（ライト〜プレミアム）', menu: '/menus/polishing' },
  { id: 'wash', label: '洗車', desc: '手洗い〜徹底洗車のお手入れ', menu: '/menus/maintenance' },
];

const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`;

function PriceSimulator({ priceMatrix }: { priceMatrix: PriceMatrix }) {
  const [size, setSize] = useState<Size | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const range = size && service ? priceMatrix[service]?.[size] ?? null : null;
  const svcMeta = serviceOptions.find((s) => s.id === service);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (size && service) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [size, service]);

  return (
    <>
      <p className="sj-lead">車格とご希望の施工を選ぶと、目安の価格帯が出ます。正式なお見積りは無料の写真相談で。</p>

      <p className="sj-field-label">1. 車格を選ぶ</p>
      <div className="sj-choice-grid">
        {sizeOptions.map((o) => (
          <button
            type="button"
            key={o.id}
            className={`sj-choice${size === o.id ? ' is-on' : ''}`}
            onClick={() => setSize(o.id)}
            aria-pressed={size === o.id}
          >
            <strong>{o.label}</strong>
            <span>{o.note}</span>
          </button>
        ))}
      </div>

      <p className="sj-field-label">2. 施工内容を選ぶ</p>
      <div className="sj-choice-grid sj-choice-grid-1">
        {serviceOptions.map((o) => (
          <button
            type="button"
            key={o.id}
            className={`sj-choice${service === o.id ? ' is-on' : ''}`}
            onClick={() => setService(o.id)}
            aria-pressed={service === o.id}
          >
            <strong>{o.label}</strong>
            <span>{o.desc}</span>
          </button>
        ))}
      </div>

      <div className="sj-result" aria-live="polite" ref={resultRef}>
        {range ? (
          <>
            <small>目安価格帯（税込・参考）</small>
            <p className="sj-price">
              {yen(range[0])} <span>〜</span> {yen(range[1])}
            </p>
            <p className="sj-note">
              {svcMeta?.label}／{sizeOptions.find((s) => s.id === size)?.label}の目安です。
              研磨とコーティングを組み合わせる場合は合算になります。塗装状態・ご希望内容により変わります。
              全メニューの料金は料金表をご覧ください。
            </p>
            <div className="sj-cta-row">
              <Link className="btn btn-primary" href="/contact">
                この内容で写真相談（無料）
              </Link>
              <Link className="btn" href="/prices">
                料金表を見る
              </Link>
            </div>
          </>
        ) : (
          <p className="sj-result-empty">車格と施工内容を選ぶと、目安が表示されます。</p>
        )}
      </div>
    </>
  );
}

function QaContent({ faqs }: { faqs: Faq[] }) {
  return (
    <>
      <p className="sj-lead">来店前の「これ聞いていいのかな？」も大丈夫。よくいただくご質問です。</p>
      <div className="sj-qa">
        {faqs.map((f) => (
          <details key={f.question}>
            <summary>{f.question}</summary>
            <p>{f.answer}</p>
          </details>
        ))}
      </div>
      <div className="sj-cta-row">
        <Link className="btn btn-primary" href="/faq">
          よくある質問をもっと見る
        </Link>
      </div>
    </>
  );
}

function CraftContent() {
  return (
    <>
      <p className="sj-lead">{site.concept}</p>
      <ul className="sj-craft">
        <li>
          <strong>必要な施工だけ</strong>
          <span>過剰なメニューではなく、車の状態・保管環境・予算に合う守り方を一緒に考えます。</span>
        </li>
        <li>
          <strong>写真から相談できる入口</strong>
          <span>専門用語を前提にせず、気になる部分の写真から状態を確認してご案内します。</span>
        </li>
        <li>
          <strong>施工後まで見据えて</strong>
          <span>仕上げて終わりではなく、きれいを保つ洗車やメンテナンスまで相談できます。</span>
        </li>
      </ul>
      <div className="sj-cta-row">
        <Link className="btn btn-primary" href="/about">
          お店の考え方を見る
        </Link>
      </div>
    </>
  );
}
