import next from 'eslint-config-next';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...next,
  {
    rules: {
      // クライアント実時刻の反映や画像の段階的フォールバックなど、
      // 意図的に effect 内で setState する箇所がある（SSRのhydration整合のため
      // レンダー中には計算できない）。ビルドは通すため error→warn に緩和。
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default config;
