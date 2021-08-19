<h1 align="center">Welcome to wallet-backend 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/radhe-shyam/wallet-backend#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/radhe-shyam/wallet-backend/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/radhe-shyam/wallet-backend/blob/master/LICENSE" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/github/license/radhe-shyam/wallet-backend" />
  </a>
</p>

### 🏠 [Homepage - API](https://wallet--backend.herokuapp.com/api/health)
### 🏠 [Homepage - APP](https://radhe-shyam.github.io/wallet-frontend/)

## Setup Process

1. Install
   ```sh
   npm ci
   ```
2. Create `config` files
   Path: `./config/default.json5`
   ```json5
   {
     PORT: 5000,
     DB_URL: "<Mongodb URI>",
   }
   ```
   Path: `./config/test.json5` - test purpose
   ```json5
   {
     PORT: 3000,
     DB_URL: "<Mongodb URI>",
   }
   ```
3. Run test
   ```sh
   npm run test
   ```
4. Start server
   ```sh
   npm start
   ```

---

## API Documentation
##### NOTE - The server will be down after every half an hour of inactivity. A new activity will take at least 10 seconds to warm up the server. Please keep the server warm before testing.

1. **To setup new wallet**

   - `POST - /api/wallet/setup`

   - `Request params` :
     1. `name`: String, User name with length of 4 to 25 characters (mandate)
     2. `balance`: Number, Initial balance, minimum 0 and maximum 1000000 (mandate)

   _Example_
   **Request:**

   ```http
   POST /api/wallet/setup HTTP/1.1
   Host: https://wallet--backend.herokuapp.com
   Content-Type: application/json

    {
    "name":"hello world",
    "balance": 20
    }
   ```

   **Response:**

   ```json
   {
     "status": 1,
     "data": {
       "name": "hello world",
       "balance": 20,
       "date": "2021-08-17T15:44:50.896Z",
       "transactionId": "611bd972df02015600d2a6dc",
       "__v": 0,
       "id": "611bd972df02015600d2a6db"
     }
   }
   ```

2. **To credit/debit a transaction on wallet**

   - `POST - /api/transact/:walletId`

   - `Request params` :
     1. `amount`: Number(with max 4 decimals), Amount to be debited(negative)/credited(positive) (mandate)
     2. `description`: String, Description for transaction, with 1 to 50 characters (mandate)

   _Example_
   **Request:**

   ```http
   POST /api/transact/611a5dff0d9b950b449d6df7 HTTP/1.1
   Host: https://wallet--backend.herokuapp.com
   Content-Type: application/json

   {
       "amount": -46,
       "description": "radheshyamjangidradheshyamjangid"
   }
   ```

   **Response:**

   ```json
   {
     "status": 1,
     "data": {
       "balance": 12,
       "transactionId": "611bdd3adf02015600d2a6f4"
     }
   }
   ```

3. **To get wallet details**

   - `GET - /api/wallet/:walletId`

   - `Params` :
     1. `walletId`: String, Wallet Id (mandate)

   _Example_
   **Request:**

   ```http
   GET /api/wallet/611a5dff0d9b950b449d6df7 HTTP/1.1
   Host: https://wallet--backend.herokuapp.com
   ```

   **Response:**

   ```json
   {
     "status": 1,
     "data": {
       "name": "userf",
       "balance": 32,
       "date": "2021-08-16T12:45:51.048Z",
       "transactionId": "611a5dff0d9b950b449d6df8",
       "__v": 0,
       "id": "611a5dff0d9b950b449d6df7"
     }
   }
   ```

4. **To fetch all the transaction - pagination**

   - `GET - /api/transactions`

   - `Query params` :
     1. `walletId`: String, Wallet Id (mandate)
     2. `skip`: Number, Number of records to skip (mandate)
     3. `limit`: Number, batch size (mandate)

   _Example_
   **Request:**

   ```http
   GET /api/transactions?walletId=611a5dff0d9b950b449d6df7&skip=1&limit=2 HTTP/1.1
   Host: https://wallet--backend.herokuapp.com
   ```

   **Response:**

   ```json
   {
     "status": 1,
     "data": [
       {
         "_id": "611bdd3adf02015600d2a6f3",
         "walletId": "611a5dff0d9b950b449d6df7",
         "amount": -4000000,
         "balance": 12,
         "description": "radheshyamjangidradheshyamjangid",
         "type": "DEBIT",
         "date": "2021-08-17T16:00:58.696Z",
         "transactionId": "611bdd3adf02015600d2a6f4",
         "__v": 0
       },
       {
         "_id": "611bdca0df02015600d2a6ef",
         "walletId": "611a5dff0d9b950b449d6df7",
         "amount": 1000000,
         "balance": 4000012,
         "description": "radheshyamjangidradheshyamjangid",
         "type": "CREDIT",
         "date": "2021-08-17T15:58:24.671Z",
         "transactionId": "611bdca0df02015600d2a6f0",
         "__v": 0
       }
     ]
   }
   ```

5. **To fetch all the transaction - without pagination**

   - `GET - /api/transactions/all/:walletId`

   - `Params` :
     1. `walletId`: String, Wallet Id (mandate)

   _Example_
   **Request:**

   ```http
   GET /api/transactions/all/611a5dff0d9b950b449d6df7 HTTP/1.1
   Host: https://wallet--backend.herokuapp.com
   ```

   **Response:**

   ```json
   [
    {
        "_id": "611c650b58214d6bed9481c6",
        "walletId": "611a5dff0d9b950b449d6df7",
        "amount": 20,
        "balance": 32,
        "description": "radheshyamjangidradheshyamjangid",
        "type": "CREDIT",
        "date": "2021-08-18T01:40:27.234Z",
        "transactionId": "611c650b58214d6bed9481c7",
        "__v": 0
    }{
        "_id": "611bdd3adf02015600d2a6f3",
        "walletId": "611a5dff0d9b950b449d6df7",
        "amount": -4000000,
        "balance": 12,
        "description": "radheshyamjangidradheshyamjangid",
        "type": "DEBIT",
        "date": "2021-08-17T16:00:58.696Z",
        "transactionId": "611bdd3adf02015600d2a6f4",
        "__v": 0
    }
   ]
   ```

---

## Author

👤 **jangir.radheyshyam@gmail.com <radhe-shyam>**

- Website: https://www.linkedin.com/in/radheshyamjangid/
- Github: [@radhe-shyam](https://github.com/radhe-shyam)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [jangir.radheyshyam@gmail.com <radhe-shyam>](https://github.com/radhe-shyam).<br />
This project is [ISC](https://github.com/radhe-shyam/wallet-backend/blob/master/LICENSE) licensed.

---
