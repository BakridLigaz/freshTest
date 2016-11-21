var controllers = angular.module('Controllers',['Services']);

controllers.controller('MainCtrl',function ($scope,$http,$location,$routeSegment) {
    var socket = io();

    /* Global variable current user*/
    $scope.routeSegment = $routeSegment;
    $scope.current ={user:null,users:null,pictures:null};
    /*Verify user authentification*/
    $http.get('users/verify')
        .then(
            function (result) {
                if(result.data!="not"){
                    $scope.current.user = result.data;
                    $scope.fetchUsers();
                    socket.emit('auth',{username:$scope.current.user.username});
                    $location.path("/main");
                }else {
                    $location.path("/welcome");
                }
            },
            function () {

            }
        );
    /*init block*/
    $http.get('users/getProfilePictures').then(
        function (result) {
            $scope.current.pictures = result.data;
        }
        );
    $http.get('/countries.json').then(
        function (result) {
            $scope.countryList = result.data;
        },
        function (err) {

        }
        );

    //options for edit
    $scope.antrOptions = {height:[],weight:[]};
    for(var i=100;i<250;i++){
    $scope.antrOptions.height.push(i);
}
    for(var i=40;i<200;i++){
    $scope.antrOptions.weight.push(i);
}

    // behaviors
    $scope.fetchUsers = function () {
        if(!$scope.current.user){
            return;
        }
        $http.get('users/getAllExceptCurrent/'+$scope.current.user.id).then(
            function (result) {
                if(result.data=="userlist empty"){
                    console.log(result.data);
                }else {
                    $scope.current.users = result.data;
                    console.log(result.data);
                }
            },
            function (err) {
                alert('server not found ');
            }
        );
    };

    $scope.isWelcome = function () {
      if($location.path()=='/welcome'){
          return true;
      }
      return false;
    };

    $scope.profileEdit = function () {
      $location.path('/main/edit_profile');
    };

    $scope.showProfile = function (user) {
        $scope.userView = user;
        $location.path('/main/view_profile/'+user.id);
    };

    $scope.backToMain=function () {
      $location.path('/main');
    };

    $scope.login = function (user) {
        if(!user){
            alert("fill in the fields!");
            return;
        }
        if ( !user.username || !user.password) {
            alert("fill in the fields!");
            return;
        }
        $http.post('users/login',user)
            .then(
                function (res) {
                    socket.emit('auth',{username:user.username});
                    $scope.current.user = res.data;
                    $scope.fetchUsers();
                    $location.path('/main');
                },
                function (err) {
                    if(err.data=='Unauthorized'){
                        alert("user not found");
                    }
                }
            );
    };

    $scope.logout = function () {

        $http.get('users/logout').then(
            function () {
                socket.emit('logout',{username:$scope.current.user.username});
                $scope.current.user = null;
                $location.path('/welcome');
            }
        )
    };

    $scope.showForm = function () {
        $scope.isShowed = !$scope.isShowed;
    };


    // socket listeners
    socket.on('login',function(res){
        console.log("user - "+res.username+' connect');
        $scope.fetchUsers();
    });
    socket.on('disconnection',function (res) {
        console.log("user - "+res.username+' disconnect');
        if($scope.current.user){
            $scope.fetchUsers();
        }

    });
});



controllers.controller('RegCtrl',function ($scope,$http,$timeout) {

    $scope.isFirst = true;

    $scope.nextPage = function (first_form) {
        if(first_form.$valid){
            $scope.isFirst =false;
        }else {
            alert('Fill in all fields of the record');
        }
    };

    $scope.follow = function (user) {
        if(!user){
            return;
        }
        user.birthday = new Date(user.birthday.year,user.birthday.month-1,user.birthday.day);
        $http.post('users/register',user).then(
            function () {
                    $scope.login(user);
            },
            function (error) {
                console.log(error.data);
            }
        );

    }
});

controllers.controller('UserCtrl',function ($scope,$location,$http,Upload,$window) {

    if(!$scope.current.user){
        $location.path('/welcome');
        return;
    }

    $scope.fetchUsers();

    $scope.getManagerPanel = function () {
        $location.path('/managment');
    };

    $scope.saveProfile = function (user) {
        $http.put('/users/update',user).then(
          function (res) {
              alert(res.data);
              $location.path('/main');
          },
            function (err) {
                console.log(err.data);
                alert(err.data);
            }
        );
    };

    $scope.getDownloadPage= function () {
        $location.path('main/edit_profile_photo');
    };

    $scope.changeProfilePicture = function (pic) {
        Upload.upload({
            url:'users/change_profile_picture',
            method:'POST',
            fields:{userId:$scope.current.user.id},
            file: pic
        }).then(
            function (res) {
                alert(res.data);
                $window.location.reload();
                $location.path('/main');

            },
            function (err) {
                alert(err.data);
            }
        );

    };

    $scope.downloadProfilePicture = function () {
        $scope.download = true;
        $location.path('main/edit_profile_photo');
    };

    $scope.addPhoto = function () {
        $location.path('/main/add_photo');
    };

});

controllers.controller('AdminCtrl',function ($scope,$location,$http) {
    if($scope.current.user){
        if($scope.current.user.role=='User'){
            $location.path('/main');
        }
    }


   $scope.getAllUsers = function () {
       $http.get('users/getAll').then(
           function (result) {
               $scope.userList = result.data;
           },
           function (err) {
               alert('error');
           });
   };
   $scope.getAllUsers();

    $scope.deleteUser = function (id) {
        $http.delete('users/delete/?currentId='+$scope.current.user.id+"&deletedId="+id).then(
            function (result) {
                alert(result.data);
                $scope.getAllUsers();
            },
            function (error) {
                alert('error');
            }
        );
    };

    $scope.updateRole = function (role, currentId, updatedId) {
        $http.put('users/updateRole',{role:role,currentId:currentId,userId:updatedId}).then(
            function (result) {
                alert(result.data);
                $scope.getAllUsers();
            },
            function (error) {
                alert('error');
            }
        )
    }
});
