import type { definitions } from '@/utils/types/shopping_order_schema';

export type V1GetOrdersResponse = definitions['apishoppingorderGetOrdersResponse'];

export type V1GetOrderResponse = definitions['apishoppingorderGetOrderResponse'];

export type V2CreateOrdersRequest = definitions['apishoppingorderCreateOrder2Request'];

export type V2CreateOrdersResponse = definitions['apishoppingorderCreateOrderResponse'];

export type AddPassengerRequest = {
  orderID: string;
  passengerIds: string[];
};

export type ApplyDiscountRequest = {
  orderID: string;
  discountCode: string;
};

export type ApplyDiscountResponse = definitions['shoppingorderApplyDiscountResponse'];

export type DiscardDiscountResponse = definitions['shoppingorderRemoveDiscountResponse'];
