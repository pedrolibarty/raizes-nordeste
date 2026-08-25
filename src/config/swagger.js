import swaggerJsdoc from "swagger-jsdoc";

const securedOperation = (tag, summary, isPublic = false) => ({
  tags: [tag],
  summary,
  security: isPublic ? [] : [{ bearerAuth: [] }],
  responses: {
    200: { description: "Operação realizada com sucesso." },
    201: { description: "Registro criado com sucesso." },
    204: { description: "Registro removido com sucesso." },
    400: { description: "Dados inválidos." },
    401: { description: "Autenticação necessária ou inválida." },
    403: { description: "Acesso não permitido." },
    404: { description: "Registro não encontrado." },
    409: { description: "Conflito com o estado atual do recurso." },
    422: { description: "Dados não atendem às regras de validação." },
    500: { description: "Erro interno do servidor." },
    503: { description: "Serviço temporariamente indisponível." },
  },
});

const routeDefinitions = [
  ["/users/login", "post", "Usuários", "Login de funcionário", true],
  ["/users", "post", "Usuários", "Criar funcionário"],
  ["/users", "get", "Usuários", "Listar funcionários"],
  ["/users/{id}", "get", "Usuários", "Consultar funcionário"],
  ["/users/{id}", "patch", "Usuários", "Atualizar funcionário"],
  ["/users/{id}", "delete", "Usuários", "Desativar funcionário"],
  ["/clients/login", "post", "Clientes", "Login de cliente", true],
  ["/clients", "post", "Clientes", "Criar cliente", true],
  ["/clients", "get", "Clientes", "Listar clientes"],
  ["/clients/{id}", "get", "Clientes", "Consultar cliente"],
  ["/clients/{id}", "patch", "Clientes", "Atualizar cliente"],
  ["/clients/{id}", "delete", "Clientes", "Excluir cliente"],
  ["/branches", "post", "Filiais", "Criar filial"],
  ["/branches", "get", "Filiais", "Listar filiais", true],
  ["/branches/{id}", "get", "Filiais", "Consultar filial", true],
  ["/branches/{id}", "patch", "Filiais", "Atualizar filial"],
  ["/branches/{id}", "delete", "Filiais", "Excluir filial"],
  ["/products", "post", "Produtos", "Criar produto"],
  ["/products", "get", "Produtos", "Listar produtos", true],
  ["/products/{id}", "get", "Produtos", "Consultar produto", true],
  ["/products/branch/{branchId}", "get", "Produtos", "Listar cardápio da filial", true],
  ["/products/{id}", "patch", "Produtos", "Atualizar produto"],
  ["/products/{id}", "delete", "Produtos", "Excluir produto"],
  ["/inventory", "get", "Estoque", "Listar estoque"],
  ["/inventory/{id}", "get", "Estoque", "Consultar estoque"],
  ["/inventory/product/{productId}", "get", "Estoque", "Consultar estoque do produto"],
  ["/inventory/branch/{branchId}", "get", "Estoque", "Listar estoque da filial"],
  ["/movements", "post", "Movimentações", "Criar movimentação"],
  ["/movements", "get", "Movimentações", "Listar movimentações"],
  ["/movements/{id}", "get", "Movimentações", "Consultar movimentação"],
  ["/promotions", "post", "Promoções", "Criar promoção"],
  ["/promotions", "get", "Promoções", "Listar promoções", true],
  ["/promotions/{id}", "get", "Promoções", "Consultar promoção", true],
  ["/promotions/{id}", "patch", "Promoções", "Atualizar promoção"],
  ["/promotions/{id}", "delete", "Promoções", "Desativar promoção"],
  ["/orders", "post", "Pedidos", "Criar pedido"],
  ["/orders", "get", "Pedidos", "Listar pedidos"],
  ["/orders/{id}", "get", "Pedidos", "Consultar pedido"],
  ["/orders/{id}/status", "patch", "Pedidos", "Alterar status do pedido"],
  ["/orders/{id}/cancel", "patch", "Pedidos", "Cancelar pedido"],
  ["/orders/{orderId}/items", "post", "Itens de pedidos", "Adicionar item"],
  ["/orders/{orderId}/items/{itemId}", "patch", "Itens de pedidos", "Atualizar item"],
  ["/orders/{orderId}/items/{itemId}", "delete", "Itens de pedidos", "Remover item"],
  ["/loyalty-accounts", "post", "Fidelidade", "Criar conta de fidelidade"],
  ["/loyalty-accounts", "get", "Fidelidade", "Listar contas de fidelidade"],
  ["/loyalty-accounts/{id}", "get", "Fidelidade", "Consultar conta de fidelidade"],
  ["/loyalty-accounts/{id}", "patch", "Fidelidade", "Atualizar conta de fidelidade"],
  ["/loyalty-accounts/{id}", "delete", "Fidelidade", "Excluir conta de fidelidade"],
  ["/loyalty-transactions", "post", "Fidelidade", "Criar transação de fidelidade"],
  ["/loyalty-transactions", "get", "Fidelidade", "Listar transações de fidelidade"],
  ["/loyalty-transactions/{id}", "get", "Fidelidade", "Consultar transação de fidelidade"],
  ["/payments/mock/{result}", "post", "Pagamentos", "Processar pagamento mock"],
  ["/payments", "get", "Pagamentos", "Listar pagamentos"],
  ["/payments/{id}", "get", "Pagamentos", "Consultar pagamento"],
  ["/audit-logs", "get", "Auditoria", "Listar registros de auditoria"],
  ["/audit-logs/{id}", "get", "Auditoria", "Consultar registro de auditoria"],
];

const paths = routeDefinitions.reduce((swaggerPaths, definition) => {
  const [path, method, tag, summary, isPublic] = definition;
  swaggerPaths[path] ??= {};
  swaggerPaths[path][method] = securedOperation(tag, summary, isPublic);
  return swaggerPaths;
}, {});

export const swaggerSpecification = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API Raízes do Nordeste",
      version: "1.0.0",
      description: "Documentação dos endpoints da API.",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    paths,
  },
  apis: [],
});
