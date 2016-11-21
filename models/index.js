var UserMeta = require('../meta/User'),
    DialogMeta = require('../meta/Dialog'),
    MessageMeta = require('../meta/Message'),
    PictureMeta = require('../meta/Picture'),
    sequelize = require('../sequelize'),
    passwordHash = require('password-hash');


var User = sequelize.define('users', UserMeta.attributes, UserMeta.options);
var Dialog = sequelize.define('dialogs',DialogMeta.attributes,DialogMeta.options);
var Message = sequelize.define('messages',MessageMeta.attributes,MessageMeta.options);
var Picture = sequelize.define('pictures',PictureMeta.attributes,PictureMeta.options);
var ProfilePicture = sequelize.define('profile',PictureMeta.attributes,PictureMeta.options);

Message.belongsTo(Dialog,{as:'dialog'});
Message.belongsTo(User,{as:'sender'});
Message.belongsTo(User,{as:'recipient'});
Dialog.belongsTo(User,{as:'first'});
Dialog.belongsTo(User,{as:'second'});
Picture.belongsTo(User,{as:'user'});
User.hasOne(ProfilePicture);

sequelize.sync();



module.exports.User = User;
module.exports.ProfilePicture = ProfilePicture;
