var Sequelize = require('sequelize');
var sequelize = new Sequelize('test_db', 'postgres', 'ligaz2403', {
    host: 'localhost',
    dialect:'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

module.exports = sequelize;
