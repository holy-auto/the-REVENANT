import { JsonLd } from '@/components/ui';
import { getFaqs } from '@/data/content';

export const metadata = {
  title: 'よくある質問',
  description: 'カーコーティング、車磨き、写真相談、料金に関するよくある質問。',
};

export default async function Page() {
  const faqs = await getFaqs();
  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />
      <section className="section">
        <div className="container">
          <h1 className="text-4xl font-black">よくある質問</h1>
          <div className="mt-8 space-y-4">
            {faqs.map((f) => (
              <details className="card p-5" key={f.question} open>
                <summary className="font-bold">{f.question}</summary>
                <p className="lead mt-3">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
