import { JsonLd } from '@/components/ui';
import { StoreJourney } from '@/components/StoreJourney';
import { site } from '@/data/site';

export default function Home() {
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
      <StoreJourney />
    </main>
  );
}
