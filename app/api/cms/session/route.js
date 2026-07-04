const CMS_PASSWORD = "fzl1996";

export async function POST(request) {
  try {
    const body = await request.json();
    const password = String(body?.password || "");

    if (password === CMS_PASSWORD) {
      return Response.json({ ok: true });
    }

    return Response.json({ ok: false, error: "Wrong password. Try again." }, { status: 401 });
  } catch {
    return Response.json({ ok: false, error: "Wrong password. Try again." }, { status: 400 });
  }
}
