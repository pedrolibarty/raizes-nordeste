import processMockPaymentsService from "../services/payments/processMockPayments.service.js";

export const processMockPaymentsController = async (req, res) => {
  const processedPayment = await processMockPaymentsService(
    req.params.result,
    req.body,
    req.auth,
  );

  return res.status(201).json({ data: processedPayment });
};
