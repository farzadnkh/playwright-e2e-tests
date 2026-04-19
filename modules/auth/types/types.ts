export type RegisterRequest = {
  phone?: string;
};

export type RegisterResponse = {
  exp: 120;
  len: number;
};

export type TokenRequest = {
  phone?: string;
  code?: string;
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  sign_token: string;
  register_timestamp: string;
  access_expire_time: number;
  user_trace_id: string;
};
