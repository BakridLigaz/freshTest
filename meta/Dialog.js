var Sequelize = require('sequelize');

var attributes = {
    status:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
};

var options = {
    freezeTableName: true,
    timestamps: false
};

module.exports.attributes = attributes;
module.exports.options = options;
