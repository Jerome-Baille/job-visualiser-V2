import Cookies from 'js-cookie';

export function setToken(key: string, value: string): void {
    if (typeof key !== 'string' || typeof value !== 'string') {
        throw new Error('Both key and value must be strings');
    }
    try {
        Cookies.set(key, value, { secure: true });
    } catch (error) {
        console.error(`Failed to set cookie: ${error}`);
    }
}

export function getToken(key: string): string | null {
    if (typeof key !== 'string') {
        throw new Error('Key must be a string');
    }
    try {
        const value = Cookies.get(key);
        return value !== undefined ? value : null;
    } catch (error) {
        console.error(`Failed to get cookie: ${error}`);
        return null;
    }
}

export function removeTokensAndUserId() {
    const cookieNames = ['accessToken', 'refreshToken', 'userId', 'accessTokenExpireDate', 'refreshTokenExpireDate', 'userIdExpireDate'];
    cookieNames.forEach(cookieName => Cookies.remove(cookieName, { path: '/' }));
}