import Link from 'next/link';
import { TABLES, type TableKey } from '@/data/admin-schema';

export const dynamic = 'force-dynamic';

export default function AdminHome() {
  const keys = Object.keys(TABLES) as TableKey[];
  return (
    <div className="admin-wrap">
      <h1>コンテンツ管理</h1>
      <p className="admin-muted">編集したい項目を選んでください。変更は数十秒でサイトに反映されます。</p>
      <div className="admin-cards">
        {keys.map((k) => (
          <Link key={k} className="admin-card" href={`/admin/${k}`}>
            <strong>{TABLES[k].label}</strong>
            <span>{TABLES[k].description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
