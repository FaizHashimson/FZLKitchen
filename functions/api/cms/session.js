import { getCmsPassword, getCmsToken, jsonResponse } from "./_utils.js";

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const password = String(body?.password || "");

    if (password === getCmsPassword(env)) {
      return jsonResponse({ ok: true, token: getCmsToken(env) });
    }

    return jsonResponse({ ok: false, error: "Wrong password. Try again." }, { status: 401 });
  } catch {
    return jsonResponse({ ok: false, error: "Wrong password. Try again." }, { status: 400 });
  }
}
