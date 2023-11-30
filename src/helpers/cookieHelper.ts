import Cookies from 'js-cookie';

export function setTokensAndUserId(accessToken: string, refreshToken: string, userId: string, accessTokenExpireDate: string, refreshTokenExpireDate: string, userIdExpireDate: string) {
    try {
        Cookies.set('accessToken', accessToken, { expires: new Date(accessTokenExpireDate), path: '/', sameSite: 'strict', secure: false, httpOnly: false });
        Cookies.set('refreshToken', refreshToken, { expires: new Date(refreshTokenExpireDate), path: '/', sameSite: 'strict', secure: false, httpOnly: false });
        Cookies.set('userId', userId, { expires: new Date(userIdExpireDate), path: '/', sameSite: 'strict', secure: false, httpOnly: false });
        Cookies.set('accessTokenExpireDate', accessTokenExpireDate, { expires: new Date(accessTokenExpireDate), path: '/', sameSite: 'strict', secure: false, httpOnly: false });
        Cookies.set('refreshTokenExpireDate', refreshTokenExpireDate, { expires: new Date(refreshTokenExpireDate), path: '/', sameSite: 'strict', secure: false, httpOnly: false });
        Cookies.set('userIdExpireDate', userIdExpireDate, { expires: new Date(userIdExpireDate), path: '/', sameSite: 'strict', secure: false, httpOnly: false });
    } catch (error) {
        console.error('Error setting cookies:', error);
    }
}

export function getAccessTokenFromStorage() {
    const { accessToken } = Cookies.get();
    return accessToken || null;
}

export function getTokenAndUserId() {

    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    const userId = Cookies.get('userId');
    const accessTokenExpireDate = Cookies.get('accessTokenExpireDate');
    const refreshTokenExpireDate = Cookies.get('refreshTokenExpireDate');

    return {
        accessToken,
        accessTokenExpireDate,
        refreshToken,
        refreshTokenExpireDate,
        userId
    };
}

export function removeTokensAndUserId() {
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
    Cookies.remove('userId', { path: '/' });
    Cookies.remove('accessTokenExpireDate', { path: '/' });
    Cookies.remove('refreshTokenExpireDate', { path: '/' });
    Cookies.remove('userIdExpireDate', { path: '/' });
}


export function setToken(key: string, value: string): void {
    if (typeof key !== 'string' || typeof value !== 'string') {
        throw new Error('Both key and value must be strings');
    }
    try {
        Cookies.set(key, value);
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