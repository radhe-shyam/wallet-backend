const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');
const mongoose = require('mongoose');
const Wallet = require('mongoose').model('Wallet');

describe('Wallet APIs', function () {
    const url = '/api/wallet/setup';
    before(async function () {
        const res = await Wallet.deleteMany({});
    });
    it('Successful wallet setup', async function () {
        const user = {
            "name": "testUser",
            "balance": 20
        };
        const res = await request(app).post(url).send(user);

        const body = res.body;
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
            "name": "testUsertestusertestuserte"
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
        expect(body.prettyMsg).to.equal('Validation failed');
        expect(body.status).to.equal(0);
        expect(body.data.balance).to.exist;
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
});