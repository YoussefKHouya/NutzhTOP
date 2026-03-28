import { cookies } from "next/headers";

export const DRAFT_ACCESS_COOKIE = "ctf_draft_access";

export async function hasDraftAccess() {
  const store = await cookies();
  return store.get(DRAFT_ACCESS_COOKIE)?.value === "1";
}
