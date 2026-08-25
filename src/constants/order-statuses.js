export const ORDER_STATUSES = Object.freeze({
  AWAITING_PAYMENT: "A",
  PAID: "P",
  IN_PREPARATION: "C",
  READY: "R",
  DELIVERED: "E",
  CANCELLED: "X",
});

export const ORDER_STATUS_VALUES = Object.freeze(
  Object.values(ORDER_STATUSES)
);
