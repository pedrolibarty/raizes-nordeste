import { PAYMENT_MOCK_RESULT_VALUES } from "../constants/payment-mock-results.js";
import { AppError } from "../errors/appError.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateMockPaymentsMiddleware = (req, res, next) => {
  const { orderId, paymentMethod = "MOCK" } = req.body ?? {};
  const invalidFields = Object.keys(req.body ?? {}).filter(
    (field) => !["orderId", "paymentMethod"].includes(field),
  );
  const errors = [];

  if (!PAYMENT_MOCK_RESULT_VALUES.includes(req.params.result)) {
    errors.push(
      `Resultado deve ser: ${PAYMENT_MOCK_RESULT_VALUES.join(", ")}.`,
    );
  }
  if (!UUID_PATTERN.test(orderId)) {
    errors.push("Pedido deve possuir um UUID válido.");
  }
  if (invalidFields.length) {
    errors.push(`Campos não permitidos: ${invalidFields.join(", ")}.`);
  }
  if (
    typeof paymentMethod !== "string" ||
    !paymentMethod.trim() ||
    paymentMethod.trim().length > 20
  ) {
    errors.push("Método de pagamento deve ser um texto de até 20 caracteres.");
  }

  if (errors.length) {
    throw new AppError(
      `Não foi possível validar o pagamento: ${errors.join(" ")}`,
      422,
    );
  }

  req.body.paymentMethod = paymentMethod.trim().toUpperCase();
  return next();
};

export default validateMockPaymentsMiddleware;
