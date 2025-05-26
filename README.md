# Documentação

## Funcionalidades
✔ Cadastro e edição de produtos e suas variações
✔ Carrinho de compras
✔ Cupons de desconto
✔ API REST para consumo externo
✔ Webhook para atualização de pedidos
✔ Cálculo de CEP com api Via Cep

## Ambiente
| Tecnologia | Versão |
|------------|--------|
| Windows | 11 |
| PHP | 8.4.5 |
| Composer | 2.8.6 |
| Laravel | ^12.0 |
| React + Typescript | ^19.0.0 |
| MySQL | 8.0 |
| Bootstrap | 5.3.6 |

## Instalação
1. Instale o PHP na versão 8.2^
2. Instale o composer e o MySQL (v8.0)
3. Clone o repositório do projeto
```sh
git clone https://github.com/matheussilva2/montink-teste
```
4. Abra o terminal na pasta do projeto e atualize os pacotes
```sh
composer install && npm install
```
4. Faça uma cópia do arquivo .env.example e renomeie para .env
5. No arquivo .env, configure o banco de dados (DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD)
6. Configure o Laravel e crie o banco de dados populado
```sh
php artisan key:generate && php artisan migrate --seed
```
7. Inicie o servidor
```sh
php artisan serve
```

## Modelagem do Banco de Dados

![Conceitual_1](https://github.com/user-attachments/assets/9e138db1-c44e-40ba-89a5-a8c5cf259769)

## Rotas
| Rota |  Função  |
| ---- | -------- |
| GET / | Página da Aplicação, onde maioria das operações são feitas |
| POST /api/orders/webhook | Rota para alterar status de pedido. Necessário enviar id e status (pending, paid, cancelled, refunded). Se o novo estado for cancelled, o pedido e seus itens do carrinho serão excluídos. |
| GET /api/orders | Retorna JSON com todos os produtos |
| GET /api/orders/{id} | Retorna JSON com informação do produto fornecido |
| POST /api/orders | Cria novo pedido |
| GET /api/coupons | Retorna JSON com os cupons cadastrados |
| GET /api/coupons/{id} | Retorna JSON com dados do cupom fornecido |
| POST /api/coupons | Cria novo cupom |
| PUT /api/coupons/{id} | Atualiza o cupom fornecido |
| DELETE /api/coupons/{id} | Exclui o cupom fornecido |
| GET /api/products | Retorna JSON com informações dos produtos paginada |
| GET /api/products/{id} | Retorna JSON com informações do produto fornecido |
| POST /api/products | Cria novo produto |
| PUT /api/products/{id} | Atualiza produto existente |
| DELETE /api/products/{id} | Exclui produto fornecido |

## Contato
👤 **Matheus Silva**
🔗 [GitHub](https://github.com/matheussilva2)  
🔗 [LinkeIn](https://www.linkedin.com/in/matheus-silva1)
📧 matheusnascimentoeoq@gmail.com

