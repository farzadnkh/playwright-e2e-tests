import type {
  AddPassengerRequest,
  ApplyDiscountRequest,
  ApplyDiscountResponse,
  DiscardDiscountResponse,
  V1GetOrderResponse,
  V1GetOrdersResponse,
  V2CreateOrdersRequest,
  V2CreateOrdersResponse
} from '@/modules/shopping_order/types/types';
import { http } from '@/utils/http/http';
import { ApiPaths } from '@/utils/types/shopping_order_schema';
import type { APIResponse } from '@playwright/test';

const URL_PREFIX = 'shoppingorder';

export class OrderApi {
  async v1GetOrders(): Promise<V1GetOrdersResponse> {
    const req = await http();
    const res: APIResponse = await req.get(`${URL_PREFIX}${ApiPaths.Order_GetOrders}`);

    if (!res.ok()) {
      throw new Error(`Failed to fetch orders: ${res.status()} ${await res.text()}`);
    }

    return (await res.json()) as V1GetOrdersResponse;
  }

  async v1GetOrder(orderId: string): Promise<V1GetOrderResponse> {
    const req = await http();
    const res: APIResponse = await req.get(`${URL_PREFIX}/v1/orders/${orderId}`);

    if (!res.ok()) {
      throw new Error(`Failed to fetch order: ${res.status()} ${await res.text()}`);
    }

    return (await res.json()) as V1GetOrderResponse;
  }

  async v2CreateOrder(params: V2CreateOrdersRequest): Promise<V2CreateOrdersResponse> {
    const req = await http();
    const res: APIResponse = await req.post(`${URL_PREFIX}${ApiPaths.Order_CreateOrder2}`, {
      data: params
    });

    if (!res.ok()) {
      throw new Error(`Failed to create order: ${res.status()} ${await res.text()}`);
    }

    return (await res.json()) as V2CreateOrdersResponse;
  }

  async addPassenger(params: AddPassengerRequest): Promise<boolean> {
    const req = await http();
    const res: APIResponse = await req.post(`${URL_PREFIX}/v1/orders/${params.orderID}/addpassengers`, {
      data: params
    });

    return res.ok();
  }

  async applyDiscount(params: ApplyDiscountRequest): Promise<ApplyDiscountResponse> {
    const req = await http();
    const res: APIResponse = await req.post(`${URL_PREFIX}/v1/orders/${params.orderID}/discount`, {
      data: {
        discountCode: params.discountCode
      }
    });

    return (await res.json()) as ApplyDiscountResponse;
  }

  async discardApplyDiscount(orderID: string): Promise<DiscardDiscountResponse> {
    const req = await http();
    const res: APIResponse = await req.delete(`${URL_PREFIX}/v1/orders/${orderID}/discount`);

    return (await res.json()) as DiscardDiscountResponse;
  }
}
