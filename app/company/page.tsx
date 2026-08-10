import type { ReactNode } from 'react';
import Link from 'next/link';
import { Breadcrumbs, CTA, JsonLd } from '@/components/ui';
import { company, stores, site } from '@/data/site';

export const metadata = {
  title: '会社概要',
  description:
    '株式会社 THE REVENANT の会社概要。事業内容・所在地（日立店／鉾田店）・お問い合わせ先をご案内します。',
  alternates: { canonical: '/company' },
};

export default function Page() {
  // 実データがある行だけを出す（未入力の項目は非表示）。
  const rows: [string, ReactNode][] = [
    ['会社名', company.legalName],
    ...(company.representative ? ([['代表者', company.representative]] as [string, ReactNode][]) : []),
    ...(company.founded ? ([['設立', company.founded]] as [string, ReactNode][]) : []),
    ...(company.capital ? ([['資本金', company.capital]] as [string, ReactNode][]) : []),
    [
      '事業内容',
      <ul key="biz" className="company-list">
        {company.business.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>,
    ],
    ...(company.antiqueLicense
      ? ([['古物商許可番号', company.antiqueLicense]] as [string, ReactNode][])
      : []),
    [
      'お問い合わせ',
      <Link key="contact" className="company-link" href="/contact">
        お問い合わせフォームへ →
      </Link>,
    ],
  ];

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: company.legalName,
          url: site.baseUrl + '/company',
          location: stores.map((s) => ({
            '@type': 'AutoRepair',
            name: `${site.name} ${s.name}`,
            address: s.address,
            telephone: s.phone,
          })),
        }}
      />
      <Breadcrumbs items={[{ name: '会社概要', path: '/company' }]} />
      <section className="section">
        <div className="container pricebook">
          <p className="eyebrow">COMPANY</p>
          <h1 className="text-4xl font-black md:text-5xl">会社概要</h1>
          <p className="lead mt-3">日立店・鉾田店から、地域の愛車に寄り添うカーコーティング・車磨きをご提供します。</p>

          <div className="pb-section">
            <div className="pb-head">会社情報</div>
            <table className="company-table">
              <tbody>
                {rows.map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row">{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pb-section">
            <div className="pb-head">事業所</div>
            <table className="company-table">
              <tbody>
                {stores.map((s) => (
                  <tr key={s.id}>
                    <th scope="row">
                      {s.name}
                    </th>
                    <td>
                      <p>{s.address}</p>
                      <p>
                        TEL <a className="company-link" href={`tel:${s.phone.replace(/-/g, '')}`}>{s.phone}</a>
                      </p>
                      <p>営業時間 {s.hours}／定休日 {s.closed}</p>
                      <Link className="company-link" href={s.slug}>店舗ページへ →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <CTA />
    </main>
  );
}
