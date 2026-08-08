'use client';

import { useEffect, useState } from 'react';

export type StoreId = 'hitachi' | 'hokota';
type Period = 'dawn' | 'day' | 'dusk' | 'night';
type Weather = 'clear' | 'clouds' | 'fog' | 'rain' | 'snow';

// 店舗の座標（storeSeo に実データが入るまでは市の中心を天気取得のフォールバックに使う）。
const STORE_COORDS: Record<StoreId, { lat: number; lon: number }> = {
  hitachi: { lat: 36.599, lon: 140.651 }, // 茨城県日立市
  hokota: { lat: 36.158, lon: 140.516 }, // 茨城県鉾田市
};

// 訪問者のローカル時刻から時間帯を判定する。
function periodFromHour(hour: number): Period {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 16) return 'day';
  if (hour >= 16 && hour < 19) return 'dusk';
  return 'night';
}

// WMO weather code を演出用のカテゴリへ丸める。
function weatherFromCode(code: number): Weather {
  if (code === 0 || code === 1) return 'clear';
  if (code === 45 || code === 48) return 'fog';
  if (code === 2 || code === 3) return 'clouds';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) return 'rain';
  return 'clouds';
}

export type Atmosphere = { period: Period; weather: Weather };

const CACHE_TTL = 30 * 60 * 1000; // 30分は天気を再取得しない

// 実時間（時間帯）と実天気（Open-Meteo・無料/キー不要）を返すフック。
// 時間帯は API に依存せず必ず出るので、天気取得が失敗しても演出は成立する。
export function useSkyAtmosphere(store: StoreId): Atmosphere {
  const [period, setPeriod] = useState<Period>('day');
  const [weather, setWeather] = useState<Weather>('clear');

  useEffect(() => {
    setPeriod(periodFromHour(new Date().getHours()));

    let cancelled = false;
    const coords = STORE_COORDS[store];
    const cacheKey = `atmo-weather:${store}`;

    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as { at: number; weather: Weather };
        if (Date.now() - parsed.at < CACHE_TTL) {
          setWeather(parsed.weather);
          return;
        }
      }
    } catch {
      /* sessionStorage 不可なら無視して取得へ */
    }

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}` +
      `&longitude=${coords.lon}&current=weather_code,is_day&timezone=auto`;

    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('weather fetch failed'))))
      .then((data) => {
        if (cancelled) return;
        const code = data?.current?.weather_code;
        if (typeof code !== 'number') return;
        const next = weatherFromCode(code);
        setWeather(next);
        // API 側で夜と分かる場合は時間帯にも反映（冬の早い日没など）。
        if (data?.current?.is_day === 0) {
          setPeriod((prev) => (prev === 'day' ? 'dusk' : prev));
        }
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), weather: next }));
        } catch {
          /* 保存できなくても致命的ではない */
        }
      })
      .catch(() => {
        /* 天気が取れなくても時間帯だけで演出する */
      });

    return () => {
      cancelled = true;
    };
  }, [store]);

  return { period, weather };
}

// 【方式B・外観用】前景（空を透過した画像）の“裏”に描く本物の空。
// 時間帯でグラデ＋太陽/月、天気で雲量・トーンが変わる。CSS 側で描画。
export function DynamicSky({ store }: { store: StoreId }) {
  const { period, weather } = useSkyAtmosphere(store);
  return (
    <span className="sky" data-period={period} data-weather={weather} aria-hidden="true">
      <span className="sky-grad" />
      <span className="sky-stars" />
      <span className="sky-orb" />
      <span className="sky-clouds" />
    </span>
  );
}

// 前面に降らせる雨・雪（建物より手前）。晴れ/くもり/霧では何も描かない。
export function WeatherFront({ store }: { store: StoreId }) {
  const { weather } = useSkyAtmosphere(store);
  return <span className="wx" data-weather={weather} aria-hidden="true" />;
}

// 【店内用】画像を差し替えずに、上から時間帯＋天気の空気感を重ねる簡易レイヤー。
export function SkyAtmosphere({ store, variant }: { store: StoreId; variant: 'door' | 'scene' }) {
  const { period, weather } = useSkyAtmosphere(store);
  return (
    <span className={`atmo atmo-${variant}`} data-period={period} data-weather={weather} aria-hidden="true">
      <span className="atmo-sky" />
      <span className="atmo-tone" />
      <span className="atmo-weather" />
      <span className="atmo-glow" />
    </span>
  );
}
