import { decodeDataUrl, ensureCmsSchema, isAuthorized, jsonResponse, safeAssetName } from "./_utils.js";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function onRequestPost({ request, env }) {
  if (!isAuthorized(request, env)) {
    return jsonResponse({ ok: false, error: "Please log in again." }, { status: 401 });
  }

  if (!env.CMS_DB) {
    return jsonResponse({ ok: false, error: "CMS database is not bound." }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { base64, bytes, contentType } = decodeDataUrl(body?.dataUrl);

    if (!contentType.startsWith("image/")) {
      return jsonResponse({ ok: false, error: "Only image uploads are allowed." }, { status: 400 });
    }

    if (bytes.byteLength > MAX_IMAGE_BYTES) {
      return jsonResponse({ ok: false, error: "Image is larger than 5MB." }, { status: 413 });
    }

    const filename = safeAssetName(body?.filename);
    const key = `uploads/${Date.now()}-${crypto.randomUUID()}-${filename.replace(/\.[a-z0-9]+$/i, ".webp")}`;
    const updatedAt = new Date().toISOString();

    await ensureCmsSchema(env.CMS_DB);
    await env.CMS_DB
      .prepare(
        `INSERT INTO cms_assets (key, content_type, value, updated_at)
         VALUES (?, ?, ?, ?)`,
      )
      .bind(key, contentType, base64, updatedAt)
      .run();

    return jsonResponse({ ok: true, url: `/api/cms/assets/${key}` });
  } catch (error) {
    return jsonResponse(
      { ok: false, error: error instanceof Error ? error.message : "Image upload failed." },
      { status: 400 },
    );
  }
}
