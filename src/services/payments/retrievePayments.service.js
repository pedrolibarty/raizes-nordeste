import { AppDataSource } from "../../data-source.js";
import { AppError } from "../../errors/appError.js";
import verifyOrderAccessService from "../orders/helpers/verifyOrderAccess.service.js";

const retrievePaymentsService = async (paymentId, authentication) => {
  const paymentRepository = AppDataSource.getRepository("Payment");
  const foundPayment = await paymentRepository.findOne({
    where: { id: paymentId },
    relations: {
      order: { branch: true, client: true, user: true },
    },
  });

  if (!foundPayment) {
    throw new AppError("Pagamento não encontrado.", 404);
  }

  verifyOrderAccessService(foundPayment.order, authentication);
  return foundPayment;
};

export default retrievePaymentsService;
