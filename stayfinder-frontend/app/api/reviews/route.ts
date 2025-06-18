import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000/api/reviews";

export async function POST(req: NextRequest) {
  const body = await req.text();
  // Forward all headers except host, connection, content-length, and set-cookie
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (!["host", "connection", "content-length"].includes(key.toLowerCase())) {
      headers[key] = value;
    }
  });
  // Forward Authorization header if present (important for auth)
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    headers["authorization"] = authHeader;
  }
  // Forward cookies for authentication
  if (req.cookies) {
    const cookieStr = Object.entries(req.cookies).map(([k, v]) => `${k}=${v}`).join('; ');
    if (cookieStr) headers["cookie"] = cookieStr;
  }
  // Debug: log headers being sent to backend
  console.log("Proxying /api/reviews POST with headers:", headers);
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers,
    body,
  });
  const data = await res.text();
  return new NextResponse(data, { status: res.status, headers: { "Content-Type": res.headers.get("content-type") || "application/json" } });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.search ? url.search : "";
  const res = await fetch(BACKEND_URL + query, {
    method: "GET",
    headers: {
      "Authorization": req.headers.get("authorization") || "",
    },
    credentials: "include",
  });
  const data = await res.text();
  return new NextResponse(data, { status: res.status, headers: { "Content-Type": res.headers.get("content-type") || "application/json" } });
}
