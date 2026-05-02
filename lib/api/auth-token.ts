type TokenGetter = (forceRefresh?: boolean) => Promise<string | null>;

let tokenGetter: TokenGetter | null = null;

export function registerTokenGetter(getter: TokenGetter | null) {
  tokenGetter = getter;
}

export async function getAuthToken(forceRefresh = false): Promise<string | null> {
  if (!tokenGetter) return null;
  return tokenGetter(forceRefresh);
}
