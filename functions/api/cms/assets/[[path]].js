import { ensureCmsSchema } from "../_utils.js";

export async function onRequestGet({ env, params }) {
  if (!env.CMS_DB) {
    return new Response("CMS database is not bound.", { status: 500 });
  }

  const path = Array.isArray(params.path) ? params.path.join("/") : params.path;

  if (!path) {
    return new Response("Not found", { status: 404 });
  }

  await ensureCmsSchema(env.CMS_DB);
  const row = await env.CMS_DB
    .prepare("SELECT content_type, value, updated_at FROM cms_assets WHERE key = ?")
    .bind(path)
    .first();

  if (!row) {
    return new Response("Not found", { status: 404 });
  }

  const bytes = Uint8Array.from(atob(row.value), (character) => character.charCodeAt(0));
  const headers = new Headers({
    "content-type": row.content_type,
    "cache-control": "public, max-age=31536000, immutable",
    "last-modified": new Date(row.updated_at).toUTCString(),
  });

  return new Response(bytes, { headers });
}
