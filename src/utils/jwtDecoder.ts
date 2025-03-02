import { ACCESS_TOKEN } from '@/constants';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  userId: string;
  nick: string;
  iat: number;
  exp: number;
}

export const getNickname = () => {
  const token = localStorage.getItem(ACCESS_TOKEN);

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.nick;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
};
