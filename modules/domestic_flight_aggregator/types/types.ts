import type { definitions, operations } from '@/utils/types/domestic_flight_aggregator_schema';

export type PrepareResponse = definitions['aggregatorPrepareFlightListResponse'];

export type PrepareRequest = definitions['aggregatorPrepareFlightListRequest'];

export type FlightListRequest = operations['Flight_FlightList']['parameters']['query'];

export type FlightListResponse = definitions['aggregatorFlightListResponse'];

export type FlightResponse = definitions['domesticflightaggregatorFlightInfo'];
