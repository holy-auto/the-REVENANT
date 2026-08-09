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
        '@type': 'AutoRepair',
        name: site.name,
        url: site.baseUrl,
        areaServed: ['日立市', '鉾田市', '茨城県'],
        sameAs: [site.instagramUrl],
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
