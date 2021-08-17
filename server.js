const config = require('config');
const db = require('./connectors/db');
const app = require('./app');

const PORT = process.env.PORT || config.get('PORT');

(async () => {
    await db.connect();
    app.listen(PORT, () => {
        console.log(`Server is running on prot: ${PORT} and started at ${new Date()} `);
    });
})();