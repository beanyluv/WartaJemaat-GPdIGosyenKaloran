/**
 * Cloudflare Pages Functions - /api/data
 * Real-time Global KV Database API for GPdI Gosyen Kaloran Warta Jemaat
 */

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0"
};

export async function onRequestGet(context) {
  try {
    if (context.env && context.env.WARTA_DB) {
      const dataStr = await context.env.WARTA_DB.get("church_data");
      if (dataStr) {
        return new Response(dataStr, { status: 200, headers: CORS_HEADERS });
      }
    }

    // Fallback to static database.json if KV not populated yet
    if (context.env && context.env.ASSETS) {
      const staticRes = await context.env.ASSETS.fetch(new URL("/database.json", context.request.url));
      if (staticRes.ok) {
        const text = await staticRes.text();
        return new Response(text, { status: 200, headers: CORS_HEADERS });
      }
    }

    return new Response(JSON.stringify({ error: "Data not found" }), { status: 404, headers: CORS_HEADERS });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
  }
}

export async function onRequestPost(context) {
  try {
    const bodyText = await context.request.text();
    const parsed = JSON.parse(bodyText);

    if (context.env && context.env.WARTA_DB) {
      await context.env.WARTA_DB.put("church_data", JSON.stringify(parsed));
      return new Response(JSON.stringify({ status: "success", message: "Saved to Cloudflare KV" }), {
        status: 200,
        headers: CORS_HEADERS
      });
    }

    return new Response(JSON.stringify({ status: "error", message: "KV binding WARTA_DB not available" }), {
      status: 500,
      headers: CORS_HEADERS
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: err.message }), {
      status: 500,
      headers: CORS_HEADERS
    });
  }
}

export const onRequestPut = onRequestPost;

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    }
  });
}
