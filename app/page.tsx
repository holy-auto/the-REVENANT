import { JsonLd } from '@/components/ui';
import { StoreJourney } from '@/components/StoreJourney';
import { site } from '@/data/site';
import { getPosts, getCasesForStore, getMenus, getFaqs, getPriceMatrix } from '@/data/content';

export default async function Home() {
  const [
    hitachiPosts,
    hokotaPosts,
    hitachiCases,
    hokotaCases,
    hitachiFaqs,
    hokotaFaqs,
    menus,
    priceMatrix,
  ] = await Promise.all([
    getPosts('hitachi'),
    getPosts('hokota'),
    getCasesForStore('hitachi'),
    getCasesForStore('hokota'),
    getFaqs('hitachi'),
    getFaqs('hokota'),
    getMenus(),
    getPriceMatrix(),
  ]);
  return (
    <main className="home-main">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${site.baseUrl}/#webpage`,
        url: site.baseUrl,
        name: 'THE REVENANT｜日立市・鉾田市のカーコーティング専門店',
        description: site.concept,
        inLanguage: 'ja-JP',
        isPartOf: { '@id': `${site.baseUrl}/#website` },
        about: { '@id': `${site.baseUrl}/#organization` },
        primaryImageOfPage: `${site.baseUrl}/opengraph-image`,
      }} />
      <StoreJourney
        postsByStore={{ hitachi: hitachiPosts, hokota: hokotaPosts }}
        casesByStore={{ hitachi: hitachiCases, hokota: hokotaCases }}
        faqsByStore={{ hitachi: hitachiFaqs, hokota: hokotaFaqs }}
        menus={menus}
        priceMatrix={priceMatrix}
      />
    </main>
  );
}
