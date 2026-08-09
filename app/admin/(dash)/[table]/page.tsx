import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TABLES, isTableKey, type Field, type TableKey } from '@/data/admin-schema';
import { saveRow, deleteRow } from '../../actions';

export const dynamic = 'force-dynamic';

type Row = Record<string, unknown>;

function FieldControl({ field, value, isNew }: { field: Field; value: unknown; isNew: boolean }) {
  const v = value == null ? '' : String(value);
  const help = field.help ? <span className="help">{field.help}</span> : null;

  if (field.type === 'bool') {
    const checked = isNew ? true : value === true;
    return (
      <div className="admin-field">
        <label className="admin-check">
          <input type="checkbox" name={field.name} defaultChecked={checked} />
          {field.label}
        </label>
      </div>
    );
  }

  return (
    <div className="admin-field">
      <label htmlFor={`${field.name}`}>
        {field.label}
        {help}
      </label>
      {field.type === 'textarea' ? (
        <textarea name={field.name} defaultValue={v} />
      ) : field.type === 'select' ? (
        <select name={field.name} defaultValue={v}>
          {field.nullable && <option value="">（全店共通）</option>}
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input type={field.type === 'number' ? 'number' : 'text'} name={field.name} defaultValue={v} />
      )}
    </div>
  );
}

function RowForm({ table, row }: { table: TableKey; row: Row | null }) {
  const cfg = TABLES[table];
  const fields = cfg.fields as Field[];
  const isNew = row == null;
  const id = row?.id ? String(row.id) : '';
  const title = isNew
    ? '＋ 新規追加'
    : cfg.listCols.map((c) => formatCell(c, row?.[c])).filter(Boolean).join('　/　') || '(無題)';

  return (
    <div className={`admin-row${isNew ? ' is-new' : ''}`}>
      <div className="admin-row-head">
        <strong>{title}</strong>
      </div>
      <form action={saveRow.bind(null, table)}>
        {id && <input type="hidden" name="id" value={id} />}
        <div className="admin-grid2">
          {fields
            .filter((f) => f.type !== 'textarea' && f.type !== 'bool')
            .map((f) => (
              <FieldControl key={f.name} field={f} value={row?.[f.name]} isNew={isNew} />
            ))}
        </div>
        {fields
          .filter((f) => f.type === 'textarea')
          .map((f) => (
            <FieldControl key={f.name} field={f} value={row?.[f.name]} isNew={isNew} />
          ))}
        {fields
          .filter((f) => f.type === 'bool')
          .map((f) => (
            <FieldControl key={f.name} field={f} value={row?.[f.name]} isNew={isNew} />
          ))}
        <div className="admin-actions">
          <button className="admin-btn admin-btn-primary" type="submit">
            {isNew ? '追加する' : '保存する'}
          </button>
        </div>
      </form>
      {!isNew && (
        <form action={deleteRow.bind(null, table)} style={{ marginTop: '.5rem' }}>
          <input type="hidden" name="id" value={id} />
          <button className="admin-btn admin-btn-danger" type="submit">削除する</button>
        </form>
      )}
    </div>
  );
}

function formatCell(col: string, value: unknown): string {
  if (col === 'published') return value === true ? '公開' : '非公開';
  if (col === 'store_id') return value === 'hitachi' ? '日立店' : value === 'hokota' ? '鉾田店' : '全店';
  return value == null ? '' : String(value);
}

export default async function TableAdmin({
  params,
  searchParams,
}: {
  params: Promise<{ table: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { table } = await params;
  if (!isTableKey(table)) notFound();
  const cfg = TABLES[table];
  const { ok, error } = await searchParams;

  const supabase = await createClient();
  let query = supabase.from(table).select(cfg.select);
  if (cfg.order) query = query.order(cfg.order.column, { ascending: cfg.order.ascending });
  const { data, error: fetchError } = await query;
  const rows = (data as Row[] | null) ?? [];

  return (
    <div className="admin-wrap">
      <Link className="admin-back" href="/admin">← コンテンツ管理へ</Link>
      <h1>{cfg.label}</h1>
      <p className="admin-muted">{cfg.description}</p>

      {ok && <div className="admin-flash admin-flash-ok">保存しました。</div>}
      {error && <div className="admin-flash admin-flash-err">保存できませんでした：{error}</div>}
      {fetchError && <div className="admin-flash admin-flash-err">読み込みエラー：{fetchError.message}</div>}

      <RowForm table={table} row={null} />

      <h2 style={{ fontSize: '1.05rem', margin: '1.5rem 0 .25rem' }}>
        登録済み（{rows.length}件）
      </h2>
      {rows.map((row) => (
        <RowForm key={String(row.id)} table={table} row={row} />
      ))}
    </div>
  );
}
