import { ImageResponse } from 'next/og';

// Site-wide social sharing image. Rendered as a real raster (PNG) so it displays
// on platforms that ignore SVG OG images (Facebook, X, LINE, Slack). Kept to
// Latin glyphs on purpose — no external CJK font fetch is needed, so the build
// stays self-contained. Individual routes (blog posts, cases) may override this.
export const runtime = 'nodejs';
export const alt = 'THE REVENANT｜日立市・鉾田市のカーコーティング専門店';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0878e8',
          color: '#fff7e8',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 26, height: 88, background: '#ffe900' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 30, letterSpacing: 12, color: '#ffe900', fontWeight: 800 }}>
              CAR COATING STUDIO
            </div>
            <div style={{ fontSize: 118, fontWeight: 900, lineHeight: 1, color: '#fff7e8' }}>
              THE REVENANT
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: 48, fontSize: 40, fontWeight: 700 }}>
          Hitachi &nbsp;·&nbsp; Hokota &nbsp;·&nbsp; Ibaraki, Japan
        </div>
        <div style={{ display: 'flex', marginTop: 20, fontSize: 30, color: '#fff7e8', opacity: 0.9 }}>
          Coating &nbsp;/&nbsp; Polishing &nbsp;/&nbsp; Hand Wash — photo consultation welcome
        </div>
      </div>
    ),
    { ...size },
  );
}
