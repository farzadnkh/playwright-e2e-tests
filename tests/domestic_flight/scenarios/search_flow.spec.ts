import { SearchApi } from '@/modules/domestic_flight_aggregator/api/flight';
import type { FlightListResponse, FlightResponse } from '@/modules/domestic_flight_aggregator/types/types';
import { OrderApi } from '@/modules/shopping_order/api/order';
import { config } from '@/utils/config/config';
import type { definitions } from '@/utils/types/domestic_flight_aggregator_schema';
import { expect, test } from '@playwright/test';

let searchApi: SearchApi;
let orderApi: OrderApi;
let requestID: string | undefined;
let flight: FlightResponse | undefined;
let orderID: string | undefined;
const flightTotalPrice = config.modules.domestic.flightTotalPrice;

test.beforeAll(async () => {
  searchApi = new SearchApi();
  orderApi = new OrderApi();
});

test.describe('one way search flow', () => {
  test.describe.configure({ mode: 'serial' });

  test('search one way flight and', async () => {
    const res = await searchApi.prepare({
      query: [
        {
          originIATA: 'THR',
          destinationIATA: 'MHD',
          passenger: {
            adultCount: 1,
            childCount: 0,
            infantCount: 0
          },
          departureDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0]
        }
      ]
    });

    expect(res?.requestID).toBeDefined();
    requestID = res?.requestID;
    expect(res).toHaveProperty('requestID');
  });

  test('get flight list', async () => {
    let res: FlightListResponse | undefined;
    const startTime = Date.now();
    const timeout = 30000; // 30 seconds
    let flights: definitions['domesticflightaggregatorFlightInfo'][] = [];

    //start searching flights for a request id until we get some results for max 30 seconds
    do {
      res = await searchApi.flights({
        requestID: requestID,
        limit: 10,
        page: 1
      });

      if (
        res?.flightQueryResult &&
        res.flightQueryResult.length > 0 &&
        // @ts-ignore
        res.flightQueryResult[0]?.flightList?.length > 1
      ) {
        // @ts-ignore
        flights = res.flightQueryResult?.[0].flightList.filter(
          (flight) =>
            flight?.airline?.name === config.modules.domestic.mock_airline && flight?.fare?.adult === flightTotalPrice
        );

        if (flights.length > 0) break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
    } while (Date.now() - startTime < timeout);

    expect(res.flightQueryResult).toBeDefined();
    expect(res.flightQueryResult?.length).toBeGreaterThan(0);

    expect(flights?.length).toBeGreaterThan(0);
    // @ts-ignore
    flight = flights[0];
    expect(flight?.airline?.name).toBe(config.modules.domestic.mock_airline);
    expect(flight?.fare?.adult).toBe(flightTotalPrice);
    expect(flight?.remainingSeats).toBeGreaterThan(0);
    expect(flight?.flightClass).toBe('ECONOMY');
    expect(flight?.departure?.airport?.city?.name?.english).toBe('Tehran');
    expect(flight?.departure?.airport?.iata).toBe('THR');
    expect(flight?.arrival?.airport?.city?.name?.english).toBe('Mashhad');
    expect(flight?.arrival?.airport?.iata).toBe('MHD');
    expect(flight?.airplaneModel).toBeDefined();
    expect(typeof flight?.airplaneModel).toBe('string');
    expect(flight?.flightNumber).toBeDefined();
    expect(typeof flight?.flightNumber).toBe('string');
    expect(flight?.refundPolicy?.length).toBeGreaterThan(0);
  });

  test('create order v2', async () => {
    if (!flight?.flightID) throw new Error('flight id required');

    const res = await orderApi.v2CreateOrder({
      flightIds: [flight?.flightID],
      flightSource: ['FLIGHT_SOURCE_FLIGHT_LIST']
    });

    expect(res.orderId).toBeDefined();
    orderID = res.orderId;
  });

  test('add passenger to order', async () => {
    if (!flight?.flightID || !orderID) throw new Error('flightID and order id required');

    const res = await orderApi.addPassenger({
      orderID: orderID,
      passengerIds: [config.modules.domestic.passenger_id]
    });

    expect(res).toBeTruthy();
  });

  test('get order detail', async () => {
    if (!flight?.flightID) throw new Error('flightID id required');

    const res = await orderApi.v1GetOrder(orderID ?? '');

    expect(res.orderId).toBe(orderID);
    expect(res.orderNumber).toBeDefined();
    expect(res.status).toBe('ORDERSTATUS_PASSENGER_ADDED');
    expect(res.userPhone).toBe(config.http.user_phone_number);

    const passenger = res.passengers?.filter((p) => p?.passenger?.passengerID === config.modules.domestic.passenger_id);
    expect(passenger).toHaveLength(1);

    expect(res.payment).toMatchObject({
      price: flightTotalPrice,
      tax: '0',
      totalPrice: flightTotalPrice,
      discount: '0'
    });
  });

  test('apply discount to order', async () => {
    if (!orderID) throw new Error('order id required');

    const res = await orderApi.applyDiscount({
      orderID: orderID,
      discountCode: config.modules.domestic.discount_code
    });

    expect(res.applied).toBe(true);
    expect(res.reason).toBe('کدتخفیف با موفقیت اعمال شد');
    expect(res.discountCode).toBe(config.modules.domestic.discount_code);
    expect(res.payAmount).toBe('72000');

    const orderRes = await orderApi.v1GetOrder(orderID ?? '');
    expect(orderRes.payment).toMatchObject({
      price: flightTotalPrice,
      tax: '0',
      totalPrice: flightTotalPrice - (flightTotalPrice * 99) / 100,
      discount: flightTotalPrice - Number(res.payAmount)
    });
  });
});
