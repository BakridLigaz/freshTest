var express = require('express');
var router = express.Router();
var User = require('../models').User;
var ProfilePicture = require('../models').ProfilePicture;
var passwordHash = require('password-hash');
var passport = require('passport');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var cookieParser = require('cookie-parser');

/* verifies name uniqueness */
router.get('/isUnique/:username', function(req, res) {
  User.findOne({where:{username:req.params.username}})
      .then(function (user) {
          if(user==null){
              console.log(user);
              res.end('null');
          }
      },
      function (err) {
        res.end("not");
      });
});

/* register new user */
router.post('/register', function (req, res) {
    var newUser = req.body;
    newUser.password = passwordHash.generate(newUser.password);
    newUser.status = false;
    newUser.role = 'User';
    User.create(newUser).then(
        function (user) {
            res.json(req.body);
        });
});

/* login */
router.post('/login',passport.authenticate('local'), function(req, res) {
    User.findOne({where:{username:req.body.username}})
        .then(
            function (user) {
                user.update({status:true}).then(
                    function(updateUser){
                        res.json(updateUser.dataValues);
                    }
                );
            }
        );

});

/* logout */
router.get('/logout',function (req, res) {
    if(req.isAuthenticated()){
        User.findOne({where:{id:req.session.passport.user.id}}).then(
          function (user) {
              user.update({status:false}).then(
                  function (result) {
                      req.logout();
                      res.end();
                  }
              )
          }
        );

    }else res.end();
});

/* update */
router.put('/update',function (req, res) {
   User.findById(req.body.id).then(
       function (user) {
           if(user){
               user.update(req.body).then(
                   function (upUser) {
                       res.end("user update");
                   },
                   function (err) {
                       console.log(err);
                       res.end('user not update');
                   }
               )
           }
       },
       function (err) {
           console.log(err);
       }
   )
});

/* verify authentification */
router.get('/verify', function (req,res) {
    if(req.isAuthenticated()){
        User.findOne({where:{username:req.session.passport.user.username}})
            .then(
                function (user) {
                    res.json(user.dataValues);
                }
            );

    }else {
        res.end("not");
    }
});
/* get all users except current */
router.get('/getAllExceptCurrent/:id',function (req,res) {
    User.findAll({where:{$not:{id:req.params.id}},raw:true}).then(

        function (result) {
                res.json(result);
        },
        function (error) {
                console.log(error);
        }
    );
});

router.get('/getAll',function (req, res) {
   User.findAll({raw:true}).then(
       function (result) {
           res.json(result);
       },
       function (error) {
           console.log(error);
       }
   );
});

router.delete('/delete/',function (req, res) {
   User.findOne({where:{id:req.param('currentId')}}).then(
       function (user) {
           if(user.get('role')=='Administrator'){
               User.destroy({where:{id:req.param('deletedId')}}).then(
                   function (result) {
                       res.end('user delete');
                   },
                   function (err) {

                   }
               )
           }else {
               res.end('current user not access rights');
           }
       }
   );
});

router.put('/updateRole',function (req, res) {
   User.findOne({where:{id:req.body.currentId}}).then(
       function (user) {
           if(user.get('role')=='Administrator'||user.get('role')=='Moderator'){
               if(user.get('role')=='Moderator'&&req.body.currentId==req.body.userId){
                  user.update({role:req.body.role}).then(
                      function (result) {
                          res.json(result.dataValues);
                      },
                      function (err) {

                      }
                  )
               }else {
                   User.findOne({where:{id:req.body.userId}}).then(
                       function (user) {
                           user.update({role:req.body.role}).then(
                               function (result) {
                                   res.end('user role updated')
                               },
                               function (err) {

                               }
                           );
                       }
                   );
               }
           }
       }
   );
});

router.get('/getProfilePictures',function (req, res) {
   ProfilePicture.findAll({raw:true}).then(
       function (result) {
           console.log(result);
       }
   )
});


router.post('/change_profile_picture',multipartMiddleware,function (req,res) {
        var tmpPath = req.files.file.path;
    ProfilePicture.find({where:{userId:req.body.userId}}).then(
        function (profile) {
            if(profile){
                fs.readFile(tmpPath,function (err, data) {
                    profile.update({content:data}).then(
                        function (result) {
                            res.end("picture changed");
                        },
                        function (err) {
                            res.end('picture not changed');
                        }
                    );
                });
            }else {
            ProfilePicture.create({userId:req.body.userId}).then(
                function (newProfile) {
                    if(!newProfile){
                        res.end("picture not changed");
                    }
                    fs.readFile(tmpPath,function (err, data) {
                        newProfile.update({content:data}).then(
                            function (result) {
                                res.end("picture changed");
                            },
                            function (err) {
                                res.end('picture not changed');
                            }
                        );
                    });
                }
            );
            }
        },
        function (err) {

        }
    );
});
router.get('/get_profile_picture/:id',function (req, res) {
    ProfilePicture.findOne({where:{userId:req.params.id}}).then(
        function (profile) {
            if(!profile){
                res.end('not');
                return;
            }
            var picture = profile.get('content');
            if(!picture){
                res.end('not');
                return;
            }
            res.writeHead(200, {'Content-Type': 'image/jpg','Content-length':picture.length });
            res.end(picture,'binary');

        },
        function (err) {
            console.log(err);
        }
    );

});



module.exports = function(io) {
    //start listen with socket.io
    router.io = io;

    var logout =

    router.io.on('connection', function (socket) {
        console.log('a user connected');
        var currentUserName = null;

        socket.on('auth',function(data){
            currentUserName = data.username;
            User.findOne({where:{username:data.username}}).then(
                function (user) {
                    user.update({status:true}).then(
                        function(){
                            socket.broadcast.emit('login',{username:currentUserName});
                        }
                    )
                }
            );
        });

        socket.on('logout',function (data) {
            socket.broadcast.emit('disconnection',{username:currentUserName});
        });

        socket.on('disconnect', function () {
            if(!currentUserName){
                return;
            }
            console.log(currentUserName);
            User.findOne({where:{username:currentUserName}}).then(
              function (user) {
                  user.update({status:false}).then(
                      function () {
                          socket.broadcast.emit('disconnection',{username:currentUserName});
                          console.log('user disconnected');
                      }
                  )
              }
            );

        });
    });
    return router;
};