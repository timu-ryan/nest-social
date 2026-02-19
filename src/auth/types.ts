export type JwtPayload = {
  id: number;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
};
