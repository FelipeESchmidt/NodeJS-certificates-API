import { StatusCodes } from 'http-status-codes';
import {
  buildError,
  buildOrder,
  buildOrdersStringifyed,
  buildReq,
  buildUser,
} from 'test/builders';
import { logger } from '@/utils';
import { Order } from '@/database/models/certificate.model';
import { listOrders, saveOrder } from './certificate.service';

jest.mock('@/database/models/order.model');
jest.mock('@/utils');
JSON.parse = jest.fn();

describe('Service > Orders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of orders', async () => {
    const user = buildReq();
    const where = {
      userid: user.id,
    };
    const orders = buildOrdersStringifyed();

    jest.spyOn(Order, 'findAll').mockResolvedValueOnce(orders);

    const returnedOrders = await listOrders(user.id);

    expect(returnedOrders).toEqual(orders);
    expect(Order.findAll).toHaveBeenCalledTimes(1);
    expect(Order.findAll).toHaveBeenCalledWith({ where });
    expect(JSON.parse).toHaveBeenCalledTimes(3);
  });

  it('should reject with an error when Order.findAll() fails', () => {
    const user = buildReq();
    const error = buildError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Failed to retrive orders for user: ${user.id}`,
    );
    jest.spyOn(Order, 'findAll').mockRejectedValueOnce(error);

    global.process = { ...process, exit: () => {} };
    expect(listOrders(user.id)).rejects.toEqual(error);
    global.process = { ...process, exit: process.exit };
  });

  it('should reject with an error when saveOrder() is called without any data', () => {
    const error = buildError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Failed to save order`,
    );

    expect(saveOrder()).rejects.toEqual(error);
  });

  it('should save and return order', () => {
    const user = buildUser();
    const data = {
      userid: user.id,
      products: buildOrder(),
    };
    const order = {
      ...data,
      id: 1,
    };

    jest.spyOn(Order, 'create').mockResolvedValueOnce(order);

    expect(saveOrder(data)).resolves.toEqual(order);
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(`New order saved`, { data });
  });
});
