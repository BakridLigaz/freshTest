var Sequelize = require('sequelize');

var attributes = {
    content: {
        type: Sequelize.STRING,
        allowNull: false
    }
};

var options = {
    freezeTableName: true,
    timestamps: false
};

module.exports.attributes = attributes;
module.exports.options = options;
