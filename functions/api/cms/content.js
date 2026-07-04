import { ensureCmsSchema, getContentKey, isAuthorized, jsonResponse } from "./_utils.js";

export async function onRequestGet({ env }) {
  if (!env.CMS_DB) {
    return jsonResponse({ ok: false, error: "CMS database is not bound." }, { status: 500 });
  }

  await ensureCmsSchema(env.CMS_DB);

  const row = await env.CMS_DB
    .prepare("SELECT value, updated_at FROM cms_content WHERE key = ?")
    .bind(getContentKey())
    .first();

  if (!row) {
    return jsonResponse({ ok: true, content: null, updatedAt: null });
  }

  return jsonResponse({
    ok: true,
    content: JSON.parse(row.value),
    updatedAt: row.updated_at,
  });
}

export async function onRequestPost({ request, env }) {
  if (!isAuthorized(request, env)) {
    return jsonResponse({ ok: false, error: "Please log in again." }, { status: 401 });
  }

  if (!env.CMS_DB) {
    return jsonResponse({ ok: false, error: "CMS database is not bound." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const content = body?.content;

  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return jsonResponse({ ok: false, error: "Content payload is invalid." }, { status: 400 });
  }

  const serialized = JSON.stringify(content);
  const updatedAt = new Date().toISOString();

  await ensureCmsSchema(env.CMS_DB);
  await env.CMS_DB
    .prepare(
      `INSERT INTO cms_content (key, value, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    )
    .bind(getContentKey(), serialized, updatedAt)
    .run();

  return jsonResponse({ ok: true, updatedAt });
}
