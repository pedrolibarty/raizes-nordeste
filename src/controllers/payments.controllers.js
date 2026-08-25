import listPaymentsService from "../services/payments/listPayments.service.js";
import processMockPaymentsService from "../services/payments/processMockPayments.service.js";
import retrievePaymentsService from "../services/payments/retrievePayments.service.js";

export const listPaymentsController = async (req, res) => {
  const payments = await listPaymentsService(req.auth, req.query);

  return res.status(200).json(payments);
};

export const retrievePaymentsController = async (req, res) => {
  const paymentId = req.params.id;
  const foundPayment = await retrievePaymentsService(paymentId, req.auth);

  return res.status(200).json({ data: foundPayment });
};

export const processMockPaymentsController = async (req, res) => {
  const processedPayment = await processMockPaymentsService(
    req.params.result,
    req.body,
    req.auth,
  );

  if (processedPayment.hasTechnicalError) {
    return res.status(503).json({
      message: "O serviço de pagamento apresentou um erro técnico. Tente novamente.",
      data: processedPayment,
    });
  }

  return res.status(201).json({ data: processedPayment });
};
