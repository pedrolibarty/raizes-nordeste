export const PAYMENT_STATUSES = Object.freeze({
  PENDING: "P",
  APPROVED: "A",
  DECLINED: "N",
  ERROR: "E",
  CANCELLED: "C",
  REFUNDED: "R",
});

export const PAYMENT_STATUS_VALUES = Object.freeze(
  Object.values(PAYMENT_STATUSES)
);