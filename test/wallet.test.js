const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');
const mongoose = require('mongoose');
const Wallet = require('mongoose').model('Wallet');

describe('Wallet APIs', function () {
    let validWallet;
    before(async function () {
        const res = await Wallet.deleteMany({});
    });

    describe('POST - /api/wallet/setup', function () {
        const url = '/api/wallet/setup';
        it('200 for Successful wallet setup', async function () {
            const user = {
                "name": "testUser",
                "balance": 20
            };
            const res = await request(app).post(url).send(user);

            const body = res.body;
            validWallet = body.data;
            expect(res.statusCode).to.equal(200);
            expect(body.status).to.equal(1);
            expect(body.data.name).to.equal(user.name);
            expect(body.data.balance).to.equal(user.balance);
        });
        it('400 for missing name', async function () {
            const user = {
                "balance": 20
            };
            const res = await request(app).post(url).send(user);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.prettyMsg).to.equal('Validation failed');
            expect(body.status).to.equal(0);
            expect(body.data.name).to.exist;
        });
        it('400 for invalid name length', async function () {
            const user = {
                "name": "testUsertestusertestuserte",
                "balance": 20
            };
            const res = await request(app).post(url).send(user);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.prettyMsg).to.equal('Validation failed');
            expect(body.status).to.equal(0);
            expect(body.data.name).to.exist;
        });
        it('400 for missing balance', async function () {
            const user = {
                "name": "testUser"
            };
            const res = await request(app).post(url).send(user);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.prettyMsg).to.equal('ValidationError: balance is required');
            expect(body.status).to.equal(0);
        });
        it('400 for negative balance', async function () {
            const user = {
                "name": "testuser1",
                "balance": -30
            };
            const res = await request(app).post(url).send(user);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.prettyMsg).to.equal('Validation failed');
            expect(body.status).to.equal(0);
            expect(body.data.balance).to.exist;
        });
        it('400 for balance more than balance limit', async function () {
            const user = {
                "name": "testuser1",
                "balance": 1e7
            };
            const res = await request(app).post(url).send(user);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.prettyMsg).to.equal('Validation failed');
            expect(body.status).to.equal(0);
            expect(body.data.balance).to.exist;
        });
        it('400 for balance decimal points are more than 4', async function () {
            const user = {
                "name": "testUser",
                "balance": 20.11111
            };
            const res = await request(app).post(url).send(user);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.prettyMsg).to.equal('ValidationError: balance must have no more than 4 decimal places');
            expect(body.status).to.equal(0);
        });
    })

    describe('GET /api/wallet/:walledId API', function () {
        it('200 for valid Wallet', async function () {
            const res = await request(app).get(`/api/wallet/${validWallet.id}`);

            const body = res.body;
            expect(res.statusCode).to.equal(200);
            expect(body.status).to.equal(1);
            expect(body.data.id).to.equal(validWallet.id);
        });
        it('400 for Invalid WalletId', async function () {
            const res = await request(app).get(`/api/wallet/hello`);

            const body = res.body;
            expect(res.statusCode).to.equal(400);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal("Invalid Wallet Id");
        });

        it('404 for Wallet not found', async function () {
            const res = await request(app).get(`/api/wallet/611a5dff0d9b950b449d6df7`);

            const body = res.body;
            expect(res.statusCode).to.equal(404);
            expect(body.status).to.equal(0);
            expect(body.prettyMsg).to.equal("Wallet not found");
        });
    })
});