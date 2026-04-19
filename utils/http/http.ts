import process from 'node:process';
import { config } from '@/utils/config/config';
import { request } from '@playwright/test';

type HttpParams = {
  timeout?: number;
};

export const http = async (params?: HttpParams) => {
  return request.newContext({
    baseURL: config.http.base_url,
    timeout: params?.timeout ?? 30000,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.TOKEN}`,
      mobile_no: config.http.user_phone_number ?? '',
      'grpc-metadata-device-info': config.http.device_meta_data ?? '',
      'api-key': config.http.api_key ?? '',
      client: 'web',
      'grpc-metadata-version': '20000'
    }
  });
};
