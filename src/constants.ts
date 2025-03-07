export const API_BASE_URL = import.meta.env.VITE_PROD_URL || import.meta.env.VITE_DEV_URL;
export const ACCESS_TOKEN = 'accessToken';
export const API_ENDPOINTS = {
  PEAKS: {
    BASE: '/peaks',
    WITH_BOUNDS: (bounds: string) => `/peaks?${bounds}`,
    SEARCH_PAGINATION: (search: string, page: number) =>
      `/peaks?search=${encodeURIComponent(search)}&page=${page}`,
    COUNT: '/peaks/count',
  },
  SADDLES: {
    WITH_BOUNDS: (bounds: string) => `/saddles?${bounds}`,
  },
  USERS: {
    BASE: '/users',
    PAGINATION: (page: number, limit?: number) => `/users?page=${page}&limit=${limit}`,
    ONE: (nick: string) => `/users/${nick}`,
    PEAK_FOR: (nick: string) => `/users/${nick}/peaks`,
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    REGISTER: '/users/register',
    REFRESH_TOKEN: '/users/refresh-token',
  },
  PHOTOS: {
    UPLOAD: '/photos/upload',
    DELETE: '/photos/delete',
  },
};
export const ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  USERS_STATS: '/stats',
  USER_PROFILE_PARAM: (nick: string) => `/${nick}/profile`,
  USER_PROFILE: ':nick/profile',
  ABOUT: '/about',
};
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Błąd autoryzacji. Spróbuj się zalogować',
  SERVER_ERROR: 'Coś poszło nie tak',
  PEAK_ACHIEVED: 'Ten szczyt już jest zdobyty',
  NICKNAME_EXISTS: 'Nickname już istnieje',
  INVALID_PASSWORD: 'Niepoprawne hasło',
  USER_NOT_FOUND: 'Użytkownik nie istnieje',
  FILE_OVERSIZE: 'Plik jest zbyt duży - max 5MB',
};
export const SUCCESS_MESSAGES = {
  PEAK_ADDED: 'Dodano do zdobytych szczytów!',
  PEAK_DELETED: 'Usunięto ze zdobytych szczytów',
  ACCOUNT_CREATED: (nick: string) => `Utworzono nowe konto dla ${nick}`,
  PHOTO_UPLOADED: 'Zdjęcie zostało dodane',
  PHOTO_DELETED: 'Zdjęcie zostało usunięte',
};
export const ALERT_MESSAGES = {
  PEAK_DELETE: 'Czy na pewno chcesz usunąć ten szczyt ze zdobytych?',
};
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  CONTENT_TOO_LARGE: 413,
  UNSUPPORTED_FILE_FORMAT: 415,
};
