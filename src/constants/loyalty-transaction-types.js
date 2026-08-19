export const LOYALTY_TRANSACTION_TYPES = Object.freeze({
  EARN: "E",
  REDEEM: "R",
  ADJUSTMENT: "A",
  EXPIRATION: "X",
  REVERSAL: "V",
});

export const LOYALTY_TRANSACTION_TYPE_VALUES = Object.freeze(
  Object.values(LOYALTY_TRANSACTION_TYPES),
);