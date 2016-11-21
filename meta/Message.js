var Sequelize = require('sequelize');

var attributes = {
    value: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
};

var options = {
    freezeTableName: true,
    timestamps: true
};

module.exports.attributes = attributes;
module.exports.options = options;

