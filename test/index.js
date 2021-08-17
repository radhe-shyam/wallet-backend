process.env.NODE_ENV = 'test';
const db = require('../connectors/db');

before(async function () {
    // this.timeout(15000);
    console.log('Connecting to DB');
    await db.connect();
});
after(async function () {
    await db.close();
    console.log('DB connection closed');
});