import type {
  FlightListRequest,
  FlightListResponse,
  PrepareRequest,
  PrepareResponse
} from '@/modules/domestic_flight_aggregator/types/types';
import { http } from '@/utils/http/http';
import { ApiPaths } from '@/utils/types/domestic_flight_aggregator_schema';
import type { APIResponse } from '@playwright/test';

const URL_PREFIX = 'domestic-flight-aggregator';

export class SearchApi {
  async prepare(params?: PrepareRequest): Promise<PrepareResponse> {
    const req = await http();
    const res: APIResponse = await req.post(`${URL_PREFIX}${ApiPaths.Flight_PrepareFlightList}`, {
      data: params
    });

    if (!res.ok()) {
      throw new Error(`Failed to fetch prepare: ${res.status()} ${await res.text()}`);
    }

    return (await res.json()) as PrepareResponse;
  }

  async flights(params?: FlightListRequest): Promise<FlightListResponse> {
    const req = await http();
    const res: APIResponse = await req.get(`${URL_PREFIX}${ApiPaths.Flight_FlightList}`, {
      params: params
    });

    if (!res.ok()) {
      throw new Error(`Failed to fetch flights: ${res.status()} ${await res.text()}`);
    }

    return (await res.json()) as PrepareResponse;
  }
}
