const blacklistedTokens = new Set<string>();

export const blacklistToken = (token: string) => {
    blacklistedTokens.add(token);
};

export const isTokenBlacklisted = (token: string): boolean => {
    return blacklistedTokens.has(token);
};