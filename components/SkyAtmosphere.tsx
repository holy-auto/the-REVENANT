'use client';

import { useEffect, useRef, useState } from 'react';

export type StoreId = 'hitachi' | 'hokota';
type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';
type Weather = 'clear' | 'clouds' | 'fog' | 'rain' | 'thunder' | 'snow' | 'typhoon';

// storeSeo に実座標が入るまでは市の中心を天気取得のフォールバックに使う。
const STORE_COORDS: Record<StoreId, { lat: number; lon: number }> = {
  hitachi: { lat: 36.599, lon: 140.651 }, // 茨城県日立市
  hokota: { lat: 36.158, lon: 140.516 }, // 茨城県鉾田市
};

function timeFromHour(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 16) return 'day';
  if (hour >= 16 && hour < 19) return 'dusk';
  return 'night';
}

// WMO weather code（＋強風）を、用意した7天気イラストに対応づける。
function weatherFrom(code: number, windKmh: number): Weather {
  if (windKmh >= 55) return 'typhoon'; // 暴風は台風扱い
  if (code === 0 || code === 1) return 'clear';
  if (code === 2 || code === 3) return 'clouds';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 95) return 'thunder'; // 95,96,99 雷雨
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 56 && code <= 57)) return 'rain';
  return 'clouds';
}

export type StoreSky = { time: TimeOfDay; weather: Weather };

const CACHE_TTL = 30 * 60 * 1000;

// 実時間（時間帯）と実天気（Open-Meteo・無料/キー不要）を返す。
// 時間帯は API 非依存で必ず出るので、天気取得が失敗しても晴れ扱いで成立する。
export function useStoreSky(store: StoreId): StoreSky {
  const [time, setTime] = useState<TimeOfDay>('day');
  const [weather, setWeather] = useState<Weather>('clear');

  useEffect(() => {
    setTime(timeFromHour(new Date().getHours()));

    let cancelled = false;
    const coords = STORE_COORDS[store];
    const cacheKey = `store-weather:${store}`;

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
      /* sessionStorage 不可なら取得へ */
    }

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}` +
      `&longitude=${coords.lon}&current=weather_code,is_day,wind_speed_10m&timezone=auto`;

    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('weather fetch failed'))))
      .then((data) => {
        if (cancelled) return;
        const code = data?.current?.weather_code;
        if (typeof code !== 'number') return;
        const wind = Number(data?.current?.wind_speed_10m) || 0;
        const next = weatherFrom(code, wind);
        setWeather(next);
        if (data?.current?.is_day === 0) {
          setTime((prev) => (prev === 'day' ? 'dusk' : prev));
        }
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), weather: next }));
        } catch {
          /* 保存不可でも致命的ではない */
        }
      })
      .catch(() => {
        /* 天気が取れなくても時間帯だけで成立（晴れ） */
      });

    return () => {
      cancelled = true;
    };
  }, [store]);

  return { time, weather };
}

const SKY_BASE = (store: StoreId) => `/images/stores/${store}/sky`;

// 時刻＋天気に応じた店舗シーン画像。天気版が無ければ同時間帯の clear、
// それも無ければ fallback（従来の静止画）へ段階的にフォールバックする。
export function StoreSkyImage({
  store,
  className,
  alt,
  fallback,
}: {
  store: StoreId;
  className?: string;
  alt: string;
  fallback: string;
}) {
  const { time, weather } = useStoreSky(store);
  const primary = `${SKY_BASE(store)}/${time}-${weather}.webp`;
  const clear = `${SKY_BASE(store)}/${time}-clear.webp`;
  const [src, setSrc] = useState(primary);
  const stage = useRef<'primary' | 'clear' | 'fallback'>('primary');

  // time/weather が変わったら primary から試し直す。
  useEffect(() => {
    stage.current = 'primary';
    setSrc(primary);
  }, [primary]);

  const onError = () => {
    if (stage.current === 'primary' && clear !== primary) {
      stage.current = 'clear';
      setSrc(clear);
    } else if (stage.current !== 'fallback') {
      stage.current = 'fallback';
      setSrc(fallback);
    }
  };

  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={src} alt={alt} onError={onError} />;
}
