
const request = require('supertest');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const app = require('../app');
const Wallet = require('mongoose').model('Wallet');
const Transaction = require('mongoose').model('Transaction');

describe('transaction API', function () {
    let validWallet = null;
    before(async () => {
        await Wallet.deleteMany({});
        await Transaction.deleteMany({});
        validWallet = await new Wallet({
            "name": "testUser",
            "balance": 20
        }).save();
    });
    describe('POST - /api/transact/:walletId', function () {

        it('200 for Credit amount', async function () {
            const data = {
                "amount": 20,
                "description": "hello world"
            };
            const res = await request(app).post(`/api/transact/${validWallet.id}`).send(data);

            const body = res.body;
            expect(res.statusCode).to.equal(200);
            expect(body.status).to.equal(1);
            expect(body.data.balance).to.exist;
            expect(body.data.balance).to.equal(40);
            expect(body.data.transactionId).to.exist;
        });
        it('200 for Debit amount', async function () {
            const data = {
                "amount": -20,
                "description": "hello world"
            };
            const res = await request(app).post(`/api/transact/${validWallet.id}`).send(data);

            const body = res.body;
            expect(res.statusCode).to.equal(200);
            expect(body.status).to.equal(1);
            expect(body.data.balance).to.exist;
            expect(body.data.balance).to.equal(20);
            expect(body.data.transactionId).to.exist;
        });
        it('400 for Insufficient balance', async function () {
            const data = {
                "amount": -21,
                "description": "hello world"
            };
            const res = await request(app).post(`/api/transact/${validWallet.id}`).send(data);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal('Insufficient balance');
        });
        it('400 for 0 amount not allowed for transaction', async function () {
            const data = {
                "amount": 0,
                "description": "hello world"
            };
            const res = await request(app).post(`/api/transact/${validWallet.id}`).send(data);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal('ValidationError: 0 is not allowed as amount');
        });
        it('400 for Description is required', async function () {
            const data = {
                "amount": -20,
                "description": ""
            };
            const res = await request(app).post(`/api/transact/${validWallet.id}`).send(data);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal("ValidationError: description is not allowed to be empty");
        });
        it('400 for Amount is required', async function () {
            const data = {
                "description": "Hello world"
            };
            const res = await request(app).post(`/api/transact/${validWallet.id}`).send(data);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal("ValidationError: amount is required");
        });
        it('404 for Wallet not found', async function () {
            const data = {
                "amount": -20,
                "description": "hello world"
            };
            const res = await request(app).post(`/api/transact/611a5dff0d9b950b449d6df7`).send(data);

            const body = res.body;
            expect(res.statusCode).to.equal(404);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal("Wallet not found");
        });
        it('400 for Invalid WalletId', async function () {
            const data = {
                "amount": -20,
                "description": "hello world"
            };
            const res = await request(app).post(`/api/transact/hello`).send(data);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal("Invalid Wallet Id");
        });
    })

    describe('GET - /api/transactions?walletId={walletId}&skip={skip}&limit={limit}', function () {

        it('200 for fetching data', async function () {
            const res = await request(app).get(`/api/transactions?walletId=${validWallet.id}&skip=0&limit=2`);

            const body = res.body;
            expect(res.statusCode).to.equal(200);
            expect(body.status).to.equal(1);
            expect(body.data.length).to.equal(2);
            expect(body.data[0].walletId).to.equal(validWallet.id);
        });


        it('400 for Invalid wallet id', async function () {
            const res = await request(app).get(`/api/transactions?walletId=hello&skip=0&limit=2`);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal('Invalid Wallet Id');
        });
        it('200 for not found wallet id', async function () {
            const res = await request(app).get(`/api/transactions?walletId=611a5dff0d9b950b449d6df7&skip=0&limit=2`);

            const body = res.body;
            expect(res.statusCode).to.equal(200);
            expect(body.status).to.equal(1);
            expect(body.data.length).to.equal(0);
        });
        it('400 for missing wallet id', async function () {
            const res = await request(app).get(`/api/transactions?walletId=&skip=0&limit=2`);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal('ValidationError: walletId is not allowed to be empty');
        });
        it('400 for invalid skip', async function () {
            const res = await request(app).get(`/api/transactions?walletId=${validWallet.id}&skip=test&limit=2`);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal('ValidationError: skip must be a number');
        });
        it('400 for negative skip', async function () {
            const res = await request(app).get(`/api/transactions?walletId=${validWallet.id}&skip=-10&limit=2`);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal('ValidationError: skip must be greater than or equal to 0');
        });
        it('400 for negative limit', async function () {
            const res = await request(app).get(`/api/transactions?walletId=${validWallet.id}&skip=10&limit=-2`);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal('ValidationError: limit must be greater than or equal to 1');
        });
        it('400 for invalid limit', async function () {
            const res = await request(app).get(`/api/transactions?walletId=${validWallet.id}&skip=10&limit=test`);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal('ValidationError: limit must be a number');
        });
        it('400 for large limit', async function () {
            const res = await request(app).get(`/api/transactions?walletId=${validWallet.id}&skip=10&limit=100`);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal('ValidationError: limit must be less than or equal to 50');
        });
    });

    describe('GET - /api/transactions/all/:walletId', function () {

        it('200 for fetching data', async function () {
            const res = await request(app).get(`/api/transactions/all/${validWallet.id}`);

            const body = res.body;
            expect(res.statusCode).to.equal(200);
        });

        it('400 for fetching data', async function () {
            const res = await request(app).get(`/api/transactions/all/hello`);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal('Invalid Wallet Id');
        });
    });
});