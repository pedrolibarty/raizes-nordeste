import request from "supertest";
import { app } from "../app.js";
import { AppDataSource } from "../data-source.js";
import {
  cleanTestDatabase,
  closeTestDatabase,
  initializeTestDatabase,
} from "./helpers/test-database.js";
import { createTestFixtures } from "./helpers/test-fixtures.js";

describe("Pedidos, pagamentos, estoque e fidelidade", () => {
  let fixtures;

  const authorization = (token) => ({ Authorization: `Bearer ${token}` });
  const createOrder = async (options = {}) => request(app)
    .post("/orders")
    .set(authorization(options.token ?? fixtures.tokens.clientOne))
    .send({
      branchId: fixtures.branchOne.id,
      orderChannel: "APP",
      items: [{
        productId: options.productId ?? fixtures.product.id,
        quantity: options.quantity ?? 2,
      }],
    });
  const processPayment = (orderId, result, token = fixtures.tokens.clientOne) => request(app)
    .post(`/payments/mock/${result}`)
    .set(authorization(token))
    .send({ orderId, paymentMethod: "PIX" });

  beforeAll(async () => {
    process.env.JWT_SECRET ||= "segredo-exclusivo-dos-testes";
    await initializeTestDatabase();
  });
  beforeEach(async () => {
    await cleanTestDatabase();
    fixtures = await createTestFixtures();
  });
  afterAll(closeTestDatabase);

  test("cliente cria pedido para si com valores calculados pelo back-end", async () => {
    const response = await createOrder();
    expect(response.status).toBe(201);
    expect(Number(response.body.data.valAmountOg)).toBe(40);
    expect(Number(response.body.data.valDiscount)).toBe(4);
    expect(Number(response.body.data.valAmount)).toBe(36);
    expect(response.body.data.points).toBe(20);
  });

  test("pedido com estoque insuficiente retorna 409", async () => {
    const response = await createOrder({ productId: fixtures.emptyProduct.id, quantity: 1 });
    expect(response.status).toBe(409);
  });

  test("cliente não consulta pedido de outro cliente", async () => {
    const createdOrder = await createOrder();
    const response = await request(app)
      .get(`/orders/${createdOrder.body.data.id}`)
      .set(authorization(fixtures.tokens.clientTwo));
    expect(response.status).toBe(403);
  });

  test("pagamento aprovado altera pedido para P e reduz estoque uma única vez", async () => {
    const createdOrder = await createOrder();
    const response = await processPayment(createdOrder.body.data.id, "approved");
    const inventory = await AppDataSource.getRepository("Inventory").findOneBy({ id: fixtures.inventory.id });
    expect(response.status).toBe(201);
    expect(response.body.data.order.status).toBe("P");
    expect(inventory.quantity).toBe(18);
  });

  test("pagamento recusado mantém A e permite nova tentativa", async () => {
    const createdOrder = await createOrder();
    const declined = await processPayment(createdOrder.body.data.id, "declined");
    const approved = await processPayment(createdOrder.body.data.id, "approved");
    expect(declined.status).toBe(201);
    expect(declined.body.data.order.status).toBe("A");
    expect(approved.status).toBe(201);
    expect(approved.body.data.order.status).toBe("P");
  });

  test("erro do pagamento retorna 503, mantém A e persiste a tentativa", async () => {
    const createdOrder = await createOrder();
    const response = await processPayment(createdOrder.body.data.id, "error");
    const payment = await AppDataSource.getRepository("Payment").findOne({ where: { order: { id: createdOrder.body.data.id } } });
    const order = await AppDataSource.getRepository("Order").findOneBy({ id: createdOrder.body.data.id });
    expect(response.status).toBe(503);
    expect(payment.status).toBe("E");
    expect(payment.failureReason).toEqual(expect.any(String));
    expect(order.status).toBe("A");
  });

  test("segunda aprovação é rejeitada sem nova baixa", async () => {
    const createdOrder = await createOrder();
    await processPayment(createdOrder.body.data.id, "approved");
    const response = await processPayment(createdOrder.body.data.id, "approved");
    const inventory = await AppDataSource.getRepository("Inventory").findOneBy({ id: fixtures.inventory.id });
    expect(response.status).toBe(409);
    expect(inventory.quantity).toBe(18);
  });

  test("funcionário de outra filial não altera o pedido", async () => {
    const createdOrder = await createOrder();
    await processPayment(createdOrder.body.data.id, "approved");
    const response = await request(app)
      .patch(`/orders/${createdOrder.body.data.id}/status`)
      .set(authorization(fixtures.tokens.managerTwo))
      .send({ status: "C" });
    expect(response.status).toBe(403);
  });

  test("entrega credita pontos somente uma vez quando há consentimento", async () => {
    const createdOrder = await createOrder({ quantity: 1 });
    await processPayment(createdOrder.body.data.id, "approved");
    await request(app).patch(`/orders/${createdOrder.body.data.id}/status`).set(authorization(fixtures.tokens.managerOne)).send({ status: "C" });
    await request(app).patch(`/orders/${createdOrder.body.data.id}/status`).set(authorization(fixtures.tokens.managerOne)).send({ status: "R" });
    const delivered = await request(app).patch(`/orders/${createdOrder.body.data.id}/status`).set(authorization(fixtures.tokens.attendantOne)).send({ status: "E" });
    const duplicate = await request(app).patch(`/orders/${createdOrder.body.data.id}/status`).set(authorization(fixtures.tokens.attendantOne)).send({ status: "E" });
    const account = await AppDataSource.getRepository("LoyaltyAccount").findOneBy({ id: fixtures.loyaltyAccount.id });
    const transactionCount = await AppDataSource.getRepository("LoyaltyTransaction").count({ where: { order: { id: createdOrder.body.data.id } } });
    expect(delivered.status).toBe(200);
    expect(duplicate.status).toBe(409);
    expect(account.pointsBalance).toBe(10);
    expect(transactionCount).toBe(1);
  });
});
