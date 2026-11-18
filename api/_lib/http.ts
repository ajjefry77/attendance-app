// تایپ‌های حداقلی درخواست/پاسخ که هم با Vercel Functions و هم با میان‌افزار dev سازگار است.

export interface ApiRequest {
  method?: string;
  body?: unknown;
  query: Record<string, string | string[] | undefined>;
  headers: Record<string, string | string[] | undefined>;
}

export interface ApiResponse {
  statusCode: number;
  setHeader(name: string, value: string): unknown;
  end(chunk?: string): unknown;
}

export function send(res: ApiResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(payload));
}

export function fail(res: ApiResponse, status: number, error: string): void {
  send(res, status, { error });
}

export function readObject(body: unknown): Record<string, unknown> {
  return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
}

export function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function queryParam(req: ApiRequest, key: string): string {
  const value = req.query?.[key];
  if (typeof value === 'string') return value;
  return Array.isArray(value) ? value[0] ?? '' : '';
}

export function bearerToken(req: ApiRequest): string | null {
  const raw = req.headers?.authorization;
  const header = Array.isArray(raw) ? raw[0] : raw;
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match ? match[1].trim() : null;
}
