import { OrderApi } from '@/modules/shopping_order/api/order';
import { expect, test } from '@playwright/test';

let orderApi: OrderApi;

test.beforeAll(async () => {
  orderApi = new OrderApi();
});

test.describe('test shopping order get orders', () => {
  test('should return list of orders', async ({ request }) => {
    const ordersRes = await orderApi.v1GetOrders();
    expect(ordersRes?.orders?.length).toBeGreaterThan(0);

    const orderItem = ordersRes?.orders?.[0];
    expect(orderItem?.orderId).toBeDefined();
    expect(orderItem?.orderNumber).toBeDefined();
    expect(orderItem?.status).toBeDefined();
  });
});
