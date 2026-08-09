import { JsonLd } from '@/components/ui';
import { StoreJourney } from '@/components/StoreJourney';
import { site } from '@/data/site';
import { getPosts, getCasesForStore } from '@/data/content';

export default async function Home() {
  const [hitachiPosts, hokotaPosts, hitachiCases, hokotaCases] = await Promise.all([
    getPosts('hitachi'),
    getPosts('hokota'),
    getCasesForStore('hitachi'),
    getCasesForStore('hokota'),
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
      />
    </main>
  );
}
