# Perfume E-Commerce Platform - Microservices Architecture

An enterprise-level E-commerce platform built with a modern Microservices Architecture, API Gateway pattern, and Event-Driven Architecture (EDA) principles (Node.js, Express, PostgreSQL, Docker).

---

## 🏗️ Architecture Overview

The system is composed of several independent, single-responsibility microservices. Each service has its own dedicated PostgreSQL database to ensure loose coupling and bounded contexts.

*   **API Gateway** (`:8080`): Central entry point for all client requests. Handles proxying, rate-limiting, and security.
*   **Catalog Service** (`:7006`): Manages perfume products, categories, and inventory.
*   **Cart Service** (`:7001`): Manages user shopping carts.
*   **Checkout Service** (`:7004`): Orchestrates the checkout process, calculates totals, and initiates orders.
*   **Order Service** (`:5003`): Manages order lifecycles and statuses.
*   **Payment Service** (`:7003`): Mock service for handling payment transactions.
*   **Shipping Service** (`:7008`): Manages logistics and delivery tracking.
*   **Email Service** (`:7005`): Handles asynchronous notifications to users.
*   **Recommendation Service** (`:7007`): Provides AI/Rule-based product recommendations.
*   **Ad Service** (`:7002`): Manages promotional banners and advertisements.
*   **Currency Service** (`:7009`): Handles multi-currency pricing conversions.

### 📊 Internal Queue Structure (Event-Driven Architecture)

To ensure high availability and prevent cascading failures, the system uses an **Event-Driven Architecture**, primarily utilizing a message broker (e.g., RabbitMQ/Kafka) for asynchronous communication, explicitly after a checkout occurs.

```mermaid
graph TD
    Client((Client App)) -->|HTTP POST /api/v1/checkout| API_Gateway[API Gateway :8080]
    API_Gateway -->|REST| Checkout[Checkout Service]
    Checkout -->|REST| Order[Order Service]
    
    subgraph Event Broker
        Queue[(Message Broker / RabbitMQ)]
    end
    
    Order -- "Publishes 'OrderCreated' Event" --> Queue
    
    Queue -- "Consumes Event" --> Email[Email Service]
    Queue -- "Consumes Event" --> Shipping[Shipping Service]
    Queue -- "Consumes Event" --> Catalog[Catalog Service]
    
    Email -. "Sends Confirmation" .-> User((User Inbox))
    Shipping -. "Initiates Logistics" .-> Fulfillment((Logistics Provider))
    Catalog -. "Updates Inventory" .-> DB[(Catalog DB)]
```

*   **Producer**: The `Order Service` (or `Checkout Service`) acts as the producer, publishing an event (`OrderCreated`) once payment is successful.
*   **Consumers**: 
    - `Email Service`: Sends an order confirmation email to the user.
    - `Shipping Service`: Creates a shipping manifest and tracking ID.
    - `Catalog Service`: Deducts the purchased quantities from available inventory.

---

## 📂 Project File Structure

```text
c:\Data_Nagendra\perfume_website\
│
├── api-gateway/            # Express-based reverse proxy middleware
│   ├── src/server.js       # Target definitions and rate-limiters
│   └── Dockerfile
├── cart-service/           # Shopping Cart Microservice
├── catalog-service/        # Product Catalog Microservice
├── checkout-service/       # Checkout orchestration
│   └── src/services/checkoutService.js # Checkout logic & EDA publisher implementation
├── order-service/          # Order lifecycle management
├── payment-service/        # Mock payment gateway
├── shipping-service/       # Delivery management
├── email-service/          # Notification microservice
├── recommendation-service/ # Product suggestions
├── ad-service/             # Advertising & Banners
├── currency-service/       # Currency conversion
│
├── frontend/               # Vanilla HTML/JS frontend application
│   ├── index.html          # Main storefront UI
│   ├── admin-portal.html   # Dashboard for inventory and order management
│   └── package.json
│
├── init-db.sql             # Global PostgreSQL Initialization script
└── docker-compose.yml      # Container orchestration file
```

---

## 🚀 How the Project Works (Flow)

1.  **Browsing**: The user hits `index.html`. The frontend calls `/api/v1/catalog` (via API Gateway) to load perfumes.
2.  **Cart**: Adding to cart sends a `POST /api/v1/cart`.
3.  **Checkout**: The user clicks "Proceed to Secure Checkout". A request goes to `/api/v1/checkout/`.
4.  **Order Generation**: The Checkout service validates items, applies shipping logic, and forwards the authorized intent to the `Order Service`.
5.  **Asynchronous Fulfillment**: The Order service saves the order to its DB and (via the Message Queue) asynchronously notifies the Email and Shipping services so the user doesn't wait for these processes to complete during the HTTP request lifecycle.

---

## 🛠️ Full Project APIs & Postman Testing Payloads

Import these payloads into **Postman** to test the system endpoints. **Note**: Always hit the `API Gateway` on port `8080`.

### 1. Catalog Service (`/api/v1/catalog`)
**GET All Products**
*   **Method**: `GET`
*   **URL**: `http://localhost:8080/api/v1/catalog/`

---

### 2. Checkout Service (`/api/v1/checkout`)
**Initiate a Checkout**
*   **Method**: `POST`
*   **URL**: `http://localhost:8080/api/v1/checkout/`
*   **Headers**: `Content-Type: application/json`
*   **Body** (Raw JSON):
```json
{
  "user_id": 101,
  "items": [
    {
      "product_id": 1,
      "price": 8500,
      "quantity": 1
    },
    {
      "product_id": 3,
      "price": 4500,
      "quantity": 2
    }
  ],
  "shipping_address": "123 Fragrance Lane, Paris, France"
}
```

---

### 3. Order Service (`/api/v1/orders`)
**Get All Orders (Admin)**
*   **Method**: `GET`
*   **URL**: `http://localhost:8080/api/v1/orders/`

**Update Order Status**
*   **Method**: `PUT`
*   **URL**: `http://localhost:8080/api/v1/orders/1/status`
*   **Body** (Raw JSON):
```json
{
  "status": "SHIPPED",
  "tracking_number": "TRK-987654321-FR"
}
```

---

### 4. Email Service (`/api/v1/emails`)
*(Usually triggered internally via Queue, but can be tested via API if exposed)*
*   **Method**: `POST`
*   **URL**: `http://localhost:8080/api/v1/emails/`
*   **Body** (Raw JSON):
```json
{
  "to": "customer@example.com",
  "subject": "Order Confirmation #101",
  "body": "Thank you for shopping at our Perfume Store! Your order is being processed."
}
```

---

## 🐳 Deployment & Testing Instructions

### Prerequisites
*   Docker & Docker Compose installed.
*   Node.js installed (for local frontend testing).

### 1. Start the Microservices Backend
Navigate to the root directory and start all containers in detached mode:
```bash
docker-compose up -d --build
```
This will spin up:
*   `perfume_postgres`: The shared DB instance running on port `5432`.
*   All 10 microservices on their respective ports.
*   `api-gateway` on port `8080`.

### 2. Verify Health
Check if the API Gateway has successfully mapped all routes:
```bash
curl http://localhost:8080/health
```
**Expected Output:** `{"status":"UP","message":"API Gateway is functioning normally"}`

### 3. Run the Frontend
Navigate into the frontend directory and start a local HTTP server:
```bash
cd frontend
npm install
npm start
```
*   Visit the storefront: `http://localhost:3000/index.html`
*   Visit the admin dashboard: `http://localhost:3000/admin-portal.html`

### 4. Tearing Down
To stop the application and clean up containers:
```bash
docker-compose down
```
To remove the persistent database volumes as well (Full Reset):
```bash
docker-compose down -v
```
