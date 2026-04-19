import process from 'node:process';
import { AuthApi } from '@/modules/auth/api/auth';
import type { TokenResponse } from '@/modules/auth/types/types';
import { ProfileApi } from '@/modules/user_manager/api/profile';

async function globalSetup() {
  const authApi = new AuthApi();
  const profileApi = new ProfileApi();
  let token: TokenResponse;

  try {
    token = authApi.loadToken();
    const user = await profileApi.v1Profile();
  } catch (e) {
    await authApi.register({});
    token = await authApi.token({});
  }

  process.env.TOKEN = token.access_token;
}

export default globalSetup;
