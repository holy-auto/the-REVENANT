'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { cases, stores } from '@/data/site';

type StoreId = (typeof stores)[number]['id'];
type VehicleSize = '軽・コンパクト' | 'セダン・ワゴン' | 'SUV・ミニバン' | '大型・輸入車';
type Concern = '新車を守りたい' | '艶を取り戻したい' | '水シミが気になる' | '日々の汚れを楽にしたい';
type Service = 'コーティング' | '磨き＋下地処理' | 'メンテナンス洗車';

const vehicleSizes: VehicleSize[] = ['軽・コンパクト', 'セダン・ワゴン', 'SUV・ミニバン', '大型・輸入車'];
const concerns: Concern[] = ['新車を守りたい', '艶を取り戻したい', '水シミが気になる', '日々の汚れを楽にしたい'];
const services: Service[] = ['コーティング', '磨き＋下地処理', 'メンテナンス洗車'];

const storeImages: Record<StoreId, string> = {
  hitachi: 'linear-gradient(135deg, rgba(22,22,20,.9), rgba(106,38,42,.58)), radial-gradient(circle at 78% 28%, rgba(200,155,120,.36), transparent 28%), linear-gradient(120deg, #241f1c, #111)',
  hokota: 'linear-gradient(135deg, rgba(17,17,17,.9), rgba(34,49,43,.62)), radial-gradient(circle at 22% 30%, rgba(200,155,120,.34), transparent 26%), linear-gradient(120deg, #141817, #111)',
};

const estimates: Record<Service, Record<VehicleSize, string>> = {
  コーティング: {
    '軽・コンパクト': '55,000円〜88,000円',
    'セダン・ワゴン': '66,000円〜110,000円',
    'SUV・ミニバン': '88,000円〜143,000円',
    '大型・輸入車': '110,000円〜165,000円',
  },
  '磨き＋下地処理': {
    '軽・コンパクト': '33,000円〜66,000円',
    'セダン・ワゴン': '44,000円〜88,000円',
    'SUV・ミニバン': '55,000円〜110,000円',
    '大型・輸入車': '66,000円〜132,000円',
  },
  メンテナンス洗車: {
    '軽・コンパクト': '8,800円〜16,500円',
    'セダン・ワゴン': '11,000円〜22,000円',
    'SUV・ミニバン': '13,200円〜27,500円',
    '大型・輸入車': '16,500円〜33,000円',
  },
};

export function HomeExperience() {
  const [storeId, setStoreId] = useState<StoreId | null>(null);
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>('SUV・ミニバン');
  const [concern, setConcern] = useState<Concern>('艶を取り戻したい');
  const [service, setService] = useState<Service>('コーティング');

  const selectedStore = stores.find((store) => store.id === storeId);
  const estimate = estimates[service][vehicleSize];
  const relatedCases = useMemo(() => cases.filter((item) => !selectedStore || item.store === selectedStore.name).slice(0, 3), [selectedStore]);
  const lineHref = `/contact?store=${storeId ?? ''}&size=${encodeURIComponent(vehicleSize)}&concern=${encodeURIComponent(concern)}&service=${encodeURIComponent(service)}`;

  return (
    <section className="relative overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-80" style={{ background: selectedStore ? storeImages[selectedStore.id] : 'linear-gradient(135deg, rgba(17,17,17,.95), rgba(106,38,42,.52)), radial-gradient(circle at 50% 20%, rgba(200,155,120,.32), transparent 30%), #111' }} />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
      <div className="container relative grid min-h-[720px] items-center gap-10 py-24 lg:grid-cols-[.92fr_1.08fr]">
        <div>
          <p className="eyebrow">Guided garage experience</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-6xl">愛車を預けるガレージを選ぶ</h1>
          <p className="lead mt-5 max-w-xl text-lg">最初から全部を見せず、近い店舗・希望メニュー・概算・近い施工事例の順番で迷わず相談まで進めます。</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {stores.map((store) => (
              <button
                key={store.id}
                type="button"
                onClick={() => setStoreId(store.id)}
                className={`rounded-3xl border p-5 text-left transition ${storeId === store.id ? 'border-bronze bg-bronze/20' : 'border-white/15 bg-white/8 hover:border-bronze/70'}`}
              >
                <span className="eyebrow">{store.area} area</span>
                <strong className="mt-3 block text-2xl">{store.name}</strong>
                <span className="lead mt-2 block text-sm">{store.description}</span>
                <span className="mt-4 block text-sm text-bronze">この店舗で進む</span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn btn-primary" href={lineHref}>この内容で相談する</Link>
            <Link className="btn btn-sub" href="/contact">迷ったら写真で相談</Link>
          </div>
        </div>

        <div className="card border-bronze/25 bg-ink/80 p-5 shadow-2xl shadow-black/30 backdrop-blur md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Step 2 / Simulation</p>
              <h2 className="mt-2 text-2xl font-bold">メニューを選んで概算を見る</h2>
            </div>
            <span className="rounded-full border border-white/15 px-3 py-1 text-sm text-ivory/70">{selectedStore?.name ?? '店舗未選択'}</span>
          </div>

          <div className="mt-7 grid gap-5">
            <ChoiceGroup label="車のサイズ" options={vehicleSizes} value={vehicleSize} onChange={setVehicleSize} />
            <ChoiceGroup label="気になること" options={concerns} value={concern} onChange={setConcern} />
            <ChoiceGroup label="希望に近いメニュー" options={services} value={service} onChange={setService} />
          </div>

          <div className="mt-7 rounded-3xl bg-ivory p-6 text-ink">
            <p className="text-sm font-bold text-wine">おすすめの相談内容</p>
            <h3 className="mt-2 text-2xl font-black">{service}</h3>
            <dl className="mt-5 grid gap-3 sm:grid-cols-3">
              <div><dt className="text-xs text-ink/55">概算</dt><dd className="font-bold">{estimate}</dd></div>
              <div><dt className="text-xs text-ink/55">車のサイズ</dt><dd className="font-bold">{vehicleSize}</dd></div>
              <div><dt className="text-xs text-ink/55">悩み</dt><dd className="font-bold">{concern}</dd></div>
            </dl>
            <p className="mt-4 text-sm text-ink/65">正式金額は車両状態の確認後にご案内します。選択内容を引き継いで相談できます。</p>
          </div>

          <div className="mt-7">
            <p className="eyebrow">Related works</p>
            <h3 className="mt-2 text-xl font-bold">このメニューに近い施工事例</h3>
            <div className="mt-4 grid gap-3">
              {relatedCases.map((item) => (
                <Link key={item.slug} href={`/works/${item.slug}`} className="rounded-2xl border border-white/10 bg-white/6 p-4 transition hover:border-bronze">
                  <b>{item.title}</b>
                  <p className="lead mt-1 text-sm">{item.concern}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChoiceGroup<T extends string>({ label, options, value, onChange }: { label: string; options: T[]; value: T; onChange: (value: T) => void }) {
  return (
    <div>
      <p className="text-sm font-bold text-ivory/80">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button key={option} type="button" onClick={() => onChange(option)} className={`rounded-full border px-4 py-2 text-sm transition ${value === option ? 'border-bronze bg-bronze text-white' : 'border-white/15 bg-white/5 text-ivory/80 hover:border-bronze/70'}`}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
