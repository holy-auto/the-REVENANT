'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// 前のページに戻るボタン。履歴があれば戻り、無ければ（直接来訪など）トップへ。
// スタイルはインラインで持たせる：グローバルCSSはルートごとに別チャンクへ
// 分割され読み込まれないページが出るため、確実に全ページで同じ見た目にする。
export function BackButton() {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      aria-label="前のページに戻る"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (typeof window !== 'undefined' && window.history.length > 1) router.back();
        else router.push('/');
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '.35rem',
        flex: '0 0 auto',
        border: '2px solid var(--rev-ink)',
        borderRadius: '999px',
        background: hover ? 'var(--rev-white)' : 'var(--rev-yellow)',
        color: 'var(--rev-ink)',
        padding: '.3rem .85rem',
        fontWeight: 900,
        fontSize: '.82rem',
        lineHeight: 1,
        cursor: 'pointer',
        boxShadow: '2px 2px 0 var(--rev-ink)',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: '1.05em' }}>←</span> 戻る
    </button>
  );
}
