export type Config = {
  http: HttpConfig;
  swagger: SwaggerConfig;
  databases: DatabaseConfig[];
  modules: {
    domestic: DomesticFlightConfig;
  };
};

export type HttpConfig = {
  base_url: string;
  api_key: string;
  device_meta_data: string;
  user_phone_number: string;
};

export type SwaggerModule = {
  path: string;
  url: string;
};

export type SwaggerConfig = {
  url: string;
  modules: SwaggerModule[];
};

export type DatabaseConfig = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type DomesticFlightConfig = {
  passenger_id: string;
  mock_airline: string;
  discount_code: string;
  flightTotalPrice: string;
};
