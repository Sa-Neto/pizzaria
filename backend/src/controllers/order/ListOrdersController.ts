import { Request, Response } from "express";
import { ListOrderService } from "../../services/order/ListOrdersService";

export class ListOrdersController{
  async handle(req: Request, res:Response){
    const listOrdersService = new ListOrderService();

    const orders = await listOrdersService.execute();

    return res.json(orders)
  }
}