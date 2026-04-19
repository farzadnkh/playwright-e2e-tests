import * as fs from 'node:fs';
import path from 'node:path';
import type { RegisterRequest, RegisterResponse, TokenRequest, TokenResponse } from '@/modules/auth/types/types';
import { config } from '@/utils/config/config';
import { http } from '@/utils/http/http';
import type { APIResponse } from '@playwright/test';

const URL_PREFIX = 'authserver';

export class AuthApi {
  private tokenDir = path.resolve(__dirname, '../../../playwright/.auth');
  private tokenFile = path.join(this.tokenDir, 'auth.json');

  async register(params?: RegisterRequest): Promise<RegisterResponse> {
    const req = await http();
    const res: APIResponse = await req.post(`${URL_PREFIX}/register`, {
      headers: {
        mobile_no: params?.phone ?? config.http.user_phone_number ?? ''
      }
    });

    if (!res.ok()) {
      throw new Error(`Failed to register: ${res.status()} ${await res.text()}`);
    }

    return (await res.json()) as RegisterResponse;
  }

  async token(params?: TokenRequest): Promise<TokenResponse> {
    fs.mkdirSync(this.tokenDir, { recursive: true });

    const req = await http();
    const res: APIResponse = await req.post(`${URL_PREFIX}/token`, {
      headers: {
        mobile_no: params?.phone ?? config.http.user_phone_number ?? ''
      },
      data: {
        code: params?.code ?? '1234'
      }
    });

    if (!res.ok()) {
      throw new Error(`Failed to get token: ${res.status()} ${await res.text()}`);
    }

    const tokenResponse = (await res.json()) as TokenResponse;

    fs.writeFileSync(this.tokenFile, JSON.stringify(tokenResponse, null, 2));

    return tokenResponse;
  }

  async refreshToken({ phone, code }: TokenRequest) {}

  loadToken(): TokenResponse {
    if (!fs.existsSync(this.tokenFile)) {
      throw new Error('Token file not found. Run the authentication setup first.');
    }

    return JSON.parse(fs.readFileSync(this.tokenFile, 'utf8'));
  }
}
