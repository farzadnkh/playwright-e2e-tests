import type { v1ProfileResponse } from '@/modules/user_manager/types/types';
import { http } from '@/utils/http/http';
import { ApiPaths } from '@/utils/types/user_manager_schema';
import type { APIResponse } from '@playwright/test';

const URL_PREFIX = 'profile';

export class ProfileApi {
  async v1Profile(): Promise<v1ProfileResponse> {
    const req = await http();
    const res: APIResponse = await req.get(`${URL_PREFIX}${ApiPaths.Profile_Profile}`);

    if (!res.ok()) {
      throw new Error(`Failed to fetch profile: ${res.status()} ${await res.text()}`);
    }

    return (await res.json()) as v1ProfileResponse;
  }
}
