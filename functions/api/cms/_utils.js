const DEFAULT_CONTENT_KEY = "site";

export function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {}),
    },
  });
}

export function getContentKey() {
  return DEFAULT_CONTENT_KEY;
}

export function getCmsPassword(env) {
  return env.CMS_PASSWORD || "fzl1996";
}

export function getCmsToken(env) {
  return env.CMS_ACCESS_TOKEN || getCmsPassword(env);
}

export function isAuthorized(request, env) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();

  return Boolean(token) && token === getCmsToken(env);
}

export async function ensureCmsSchema(db) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS cms_content (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS cms_assets (
        key TEXT PRIMARY KEY,
        content_type TEXT NOT NULL,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
    )
    .run();
}

export function decodeDataUrl(dataUrl) {
  const match = /^data:([^;,]+);base64,(.+)$/i.exec(String(dataUrl || ""));
  if (!match) {
    throw new Error("Invalid image data");
  }

  const bytes = Uint8Array.from(atob(match[2]), (character) => character.charCodeAt(0));

  return {
    contentType: match[1],
    bytes,
    base64: match[2],
  };
}

export function safeAssetName(filename = "image.webp") {
  const clean = String(filename)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return clean || "image.webp";
}
