class SecureTokenStore {
  private accessTokens: { [key: string]: string | null } = {};

  setTokens(access: string, refresh: string, key: string = 'default') {
    this.accessTokens[key] = access;
    sessionStorage.setItem(`topsmile_refresh_token_${key}`, refresh);
  }

  getAccessToken(key: string = 'default'): string | null {
    return this.accessTokens[key] || null;
  }

  getRefreshToken(key: string = 'default'): string | null {
    return sessionStorage.getItem(`topsmile_refresh_token_${key}`);
  }

  clear(key: string = 'default') {
    this.accessTokens[key] = null;
    sessionStorage.removeItem(`topsmile_refresh_token_${key}`);
  }

  clearAll() {
    this.accessTokens = {};
    // This is a bit of a hack, but it's the only way to clear all session storage keys
    // without knowing all the keys in advance.
    Object.keys(sessionStorage)
      .filter(key => key.startsWith('topsmile_refresh_token_'))
      .forEach(key => sessionStorage.removeItem(key));
  }
}

export const tokenStore = new SecureTokenStore();