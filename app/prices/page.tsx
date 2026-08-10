import { Breadcrumbs, CTA } from '@/components/ui';
import {
  bodyCoating,
  maintenance,
  alacarteGrids,
  kiwamiCourse,
  serviceBadges,
  priceNotes,
  sizeLegend,
  type PriceGrid,
  type Cell,
} from '@/data/pricing';

export const metadata = {
  title: '料金表',
  description:
    'THE REVENANT のボディーコーティング・磨き・洗車・内装・ガラス・ホイールの料金表（税込）。車格サイズ別に掲載しています。',
  alternates: { canonical: '/prices' },
};

const yen = (c: Cell) => (typeof c === 'number' ? `¥${c.toLocaleString('ja-JP')}` : c);

function PriceTable({ grid }: { grid: PriceGrid }) {
  return (
    <div className="pb-section" id={grid.id}>
      <div className="pb-head">{grid.title}</div>
      <div className="pb-scroll">
        <table className="pb-table">
          <thead>
            <tr>
              <th className="pb-rowhead" scope="col">
                メニュー
              </th>
              {grid.columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
              {grid.trailingHeader && <th scope="col">{grid.trailingHeader}</th>}
            </tr>
          </thead>
          <tbody>
            {grid.rows.map((r) => (
              <tr key={r.label}>
                <th className="pb-rowhead" scope="row" style={r.accent ? { borderLeft: `5px solid ${r.accent}` } : undefined}>
                  {r.label}
                  {r.sub && <span className="pb-sub">{r.sub}</span>}
                </th>
                {r.values.map((v, i) => (
                  <td key={i}>{yen(v)}</td>
                ))}
                {grid.trailingHeader && <td className="pb-trailing">{r.trailing ?? '—'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {grid.note && <p className="pb-note">{grid.note}</p>}
    </div>
  );
}

export default function Page() {
  return (
    <main>
      <Breadcrumbs items={[{ name: '料金表', path: '/prices' }]} />
      <section className="section">
        <div className="container pricebook">
          <p className="eyebrow">PRICE LIST</p>
          <h1 className="text-4xl font-black md:text-5xl">料金表</h1>
          <p className="lead mt-3">プロの技術で、愛車を最高の輝きに。すべて税込価格でご案内します。</p>

          <div className="pb-legend" aria-label="車格サイズの目安">
            {sizeLegend.map((s) => (
              <span key={s.code} className="pb-legend-item">
                <b>{s.code}</b>
                {s.label}
              </span>
            ))}
          </div>

          <PriceTable grid={bodyCoating} />
          <PriceTable grid={maintenance} />

          <h2 className="pb-group-title">単品メニュー</h2>
          <div className="pb-grid2">
            {alacarteGrids.map((g) => (
              <PriceTable key={g.id} grid={g} />
            ))}
          </div>

          <div className="pb-kiwami">
            <div className="pb-kiwami-head">
              <span className="pb-kiwami-title">{kiwamiCourse.title}</span>
              <span className="pb-kiwami-sub">{kiwamiCourse.subtitle}</span>
            </div>
            <p className="pb-kiwami-body">{kiwamiCourse.body}</p>
          </div>

          <div className="pb-badges">
            {serviceBadges.map((b) => (
              <span key={b} className="pb-badge">
                {b}
              </span>
            ))}
          </div>

          <div className="pb-notes">
            {priceNotes.map((n) => (
              <p key={n}>{n}</p>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </main>
  );
}
