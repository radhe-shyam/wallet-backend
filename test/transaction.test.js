
const request = require('supertest');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const app = require('../app');
const Wallet = require('mongoose').model('Wallet');

describe('transaction API', function () {
    let validWallet = null;
    before(async () => {
        await Wallet.deleteMany({});
        validWallet = await new Wallet({
            "name": "testUser",
            "balance": 20
        }).save();
    });
    it('Credit amount', async function () {
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
    it('Debit amount', async function () {
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
    it('Insufficient balance', async function () {
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
    it('0 amount not allowed for transaction', async function () {
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
    it('Description is required', async function () {
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
    it('Amount is required', async function () {
        const data = {
            "description": "Hello world"
        };
        const res = await request(app).post(`/api/transact/${validWallet.id}`).send(data);

        const body = res.body;
        expect(res.statusCode).to.equal(400);
        expect(body.status).to.equal(0);
        expect(body.prettyMsg).to.equal("ValidationError: amount is required");
    });
    it('Wallet not found', async function () {
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
    it('Invalid WalletId', async function () {
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
});