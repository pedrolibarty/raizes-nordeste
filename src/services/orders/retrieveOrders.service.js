import { AppDataSource } from "../../data-source.js";
import retrieveOrderWithItemsService from "./helpers/retrieveOrderWithItems.service.js";
import verifyOrderAccessService from "./helpers/verifyOrderAccess.service.js";

const retrieveOrdersService = async (orderId, authentication) => {
  const { foundOrder, orderItems } = await retrieveOrderWithItemsService(
    AppDataSource.manager,
    orderId,
  );
  verifyOrderAccessService(foundOrder, authentication);
  return { ...foundOrder, items: orderItems };
};

export default retrieveOrdersService;
