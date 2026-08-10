import type { Metadata } from 'next';
import { Zen_Kaku_Gothic_New, Zen_Maru_Gothic } from 'next/font/google';
import './globals.css';
import './station.css';
import { FixedCTA, Footer, Header, JsonLd } from '@/components/ui';
import { menus, site, stores } from '@/data/site';
import { Analytics } from '@vercel/analytics/next';

// トップビュー以降の本文・見出し＝すっきりモダンな角ゴシック。
const kaku = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-kaku',
  display: 'swap',
});
// イントロのタイトルカード「THE REVENANT」専用の丸ゴシック（現状維持）。
const zen = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-zen',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: {
    default: 'THE REVENANT｜日立市・鉾田市のカーコーティング専門店',
    template: '%s｜THE REVENANT',
  },
  description:
    '茨城県日立市・鉾田市のカーコーティング、車磨き、手洗い洗車の相談窓口。初めてでも写真から相談できます。',
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    'カーコーティング',
    '車磨き',
    'ガラスコーティング',
    '手洗い洗車',
    '日立市 カーコーティング',
    '鉾田市 カーコーティング',
    '茨城県 カーコーティング',
    'コーティング専門店',
  ],
  category: 'automotive',
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: site.name,
    url: site.baseUrl,
    title: 'THE REVENANT｜日立市・鉾田市のカーコーティング専門店',
    description: site.concept,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THE REVENANT｜日立市・鉾田市のカーコーティング専門店',
    description: site.concept,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: site.gscVerification ? { google: site.gscVerification } : undefined,
  alternates: { canonical: '/' },
};

const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${site.baseUrl}/#organization`,
  name: site.name,
  url: site.baseUrl,
  logo: `${site.baseUrl}${site.ogImage}`,
  image: `${site.baseUrl}/opengraph-image`,
  description: site.concept,
  slogan: site.concept,
  sameAs: [site.instagramUrl],
  areaServed: stores.map((s) => ({ '@type': 'City', name: s.area })),
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: 'JP',
      availableLanguage: ['Japanese'],
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: '施工メニュー',
    itemListElement: menus.map((m) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: m.name, description: m.summary },
    })),
  },
  department: stores.map((s) => ({
    '@type': 'AutoRepair',
    name: `${site.name} ${s.name}`,
    url: site.baseUrl + s.slug,
  })),
};

const siteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.baseUrl}/#website`,
  name: site.name,
  url: site.baseUrl,
  inLanguage: 'ja-JP',
  publisher: { '@id': `${site.baseUrl}/#organization` },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${kaku.variable} ${zen.variable}`}>
      <body>
        <JsonLd data={orgLd} />
        <JsonLd data={siteLd} />
        <Header />
        {children}
        <Footer />
        <FixedCTA />
        <Analytics />
      </body>
    </html>
  );
}
