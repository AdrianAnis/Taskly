export type ActionResult<Data> = { ok: true; data: Data } | { ok: false; error: string };

export function succeed<Data>(data: Data): ActionResult<Data> {
  return { ok: true, data };
}

export function fail<Data>(error: string): ActionResult<Data> {
  return { ok: false, error };
}
