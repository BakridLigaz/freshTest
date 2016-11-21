var Sequelize = require('sequelize');

var attributes = {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role:{
        type:Sequelize.ENUM('User','Moderator','Administrator')
    },
    status: {
        type:Sequelize.BOOLEAN,
        allowNull: false
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false
    },
    looking_for:{
        type: Sequelize.STRING,
        allowNull: false
    },
    age:{
        type: Sequelize.STRING,
        allowNull: false
    },
    country:{
        type: Sequelize.JSON,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    birthday:{
        type: Sequelize.DATE,
        allowNull: false
    },
    education:{
        type: Sequelize.STRING,
        allowNull: false
    },
    children:{
        type: Sequelize.STRING,
        allowNull: false
    },
    city:{
        type: Sequelize.STRING,
        allowNull: false
    },
    dialogs:{
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    profile_picture:{
        type: Sequelize.BLOB
    },
    pictures:{
        type:Sequelize.ARRAY(Sequelize.STRING)
    },
    title_profile:{
        type:Sequelize.STRING
    },
    description:{
        type:Sequelize.STRING
    },
    civil_status:{
        type:Sequelize.STRING
    },
    religion:{
        type:Sequelize.STRING
    },
    smoker:{
        type:Sequelize.STRING
    },
    work:{
        type:Sequelize.STRING
    },
    height:{
        type:Sequelize.INTEGER
    },
    weight:{
        type:Sequelize.INTEGER
    },
    build:{
        type:Sequelize.INTEGER
    },
    hair:{
        type:Sequelize.STRING
    },
    eyes:{
        type:Sequelize.STRING
    },
    tattoos:{
        type:Sequelize.STRING
    },
    piercing:{
        type:Sequelize.STRING
    },
    animals:{
        type:Sequelize.BOOLEAN
    },
    go_to_cultural_events:{
        type:Sequelize.BOOLEAN
    },
    go_to_concerts:{
        type:Sequelize.BOOLEAN
    },
    healthy_food:{
        type:Sequelize.BOOLEAN
    },
    do_sport:{
        type:Sequelize.BOOLEAN
    },
    travel:{
        type:Sequelize.BOOLEAN
    },
    go_dancing:{
        type:Sequelize.BOOLEAN
    },
    go_to_the_movies:{
        type:Sequelize.BOOLEAN
    },
    music:{
        type:Sequelize.BOOLEAN
    },
    go_out_to_dinner:{
        type:Sequelize.BOOLEAN
    }


};

var options = {
    freezeTableName: true,
    timestamps: false
};

module.exports.attributes = attributes;
module.exports.options = options;
