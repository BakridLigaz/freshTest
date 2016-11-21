var directives = angular.module('Directives',[]);



directives.directive('ngCarousel',function () {

    var carouselConteiner = $('#carousel_div');
    var carousel = carouselConteiner.children(':first');
    var initLength = carousel.children().length;

    var move = function () {
      carousel.children(':last').animate({
          "margin-rigth": "-=" + (carousel.children().outerWidth() + 30) + "px"
      }, 600, 'linear', function (evt) {
          console.log("work");
          // carousel.children().slice(0, 1).remove();
          // carousel.children(':first').css('margin-left', 0);
          move();
      });
    };

    var start = function () {
        if((carousel.children().length*carousel.children().outerWidth())<carouselConteiner.outerWidth()){
            carousel.css('width',"100%");
        }else {
            carousel.mousemove();
            carousel.children(':last').after(carousel.children().slice(0, 1).clone(true));
            carousel.children(':first').animate({
                "margin-left": "-=" + (carousel.children().outerWidth() + 30) + "px"
            }, 1000, 'linear', function (evt) {
                carousel.children().slice(0, 1).remove();
                carousel.children(':first').css('margin-left', 0);
                start();
            });
        }

    };

    var stop = function (event) {
        carousel.children(':first').stop();
        if(carousel.children().length>initLength){
            carousel.children().slice(0,1).remove();
        }
    };

    return{
        restrict: 'A',
        link : function(scope,element,attrs){
            $(document).ready(function () {
                start();
            });
            element.bind('mousedown',stop);
            element.bind('mouseup',start);
            // element.bind('mousemove',move);
        }
    }
});

directives.directive('ngUnique',function ($http) {

   return {
       restrict: 'A',
       require: 'ngModel',
       link: function (scope, element, attrs,ngModel) {
           element.bind('blur',function () {
               scope.blurname=true;
               if(!attrs.ngModel||!element.val()){
                   return;
               }
               $http.get('/users/isUnique/'+element.val())
                   .then(
                       function (result) {
                           if(result.data!='null'&&result.data!='not'){
                               ngModel.$setValidity('unique',false);
                           }else ngModel.$setValidity('unique',true);
                       },
                       function (err) {
                           console.log(err);
                       }
                   );
           });
           element.bind('focus',function () {
               scope.blurname=false;
           })
       }
   }

});

directives.directive('ngDate',function () {
   return{
       restrict: 'A',
       link: function (scope, element, attrs) {
           $(document).ready(function() {
               $.dobPicker({
                   daySelector: '#dobday', /* Required */
                   monthSelector: '#dobmonth', /* Required */
                   yearSelector: '#dobyear', /* Required */
                   dayDefault: '', /* Optional */
                   monthDefault: '', /* Optional */
                   yearDefault: '', /* Optional */
                   minimumAge: 18, /* Optional */
                   maximumAge: 80 /* Optional */
               });
           });
       }
   }
});

directives.directive('ngCustomFileChooser',function () {
   return{
       restrict: 'A',
       link: function (scope, element, attrs) {
           element.on('click',function () {
               angular.element('#hidenInput').trigger('click');
           });
       }
   }
});

directives.directive('ngSrcFunction',function ($http) {
    return{
        restrict: 'A',
        link: function (scope, element, attrs) {
            $http.get('users/get_profile_picture/'+attrs.ngSrcFunction).then(
                function (res) {
                    if(res.data!='not'){
                        element.attr('src','users/get_profile_picture/'+attrs.ngSrcFunction);
                    }else {
                        if(attrs.state == 'Men'){
                           element.attr('src','../images/defaultMan.jpg');
                        }else element.attr('src','../images/defaultWoman.jpg');
                    }
                },
                function (err) {
                    console.log(err);
                }
            );
        }
    }
});

directives.directive('ngDisabledDelete',function () {
   return{
       restrict: 'A',
       link: function (scope, element, attrs) {
           if(attrs.admin==attrs.user||attrs.admin.role=='Moderator'){
               element.attr('class','not-active');
           }
       }
   }
});

directives.directive('ngDisabledChanged',function () {
    return{
        restrict: 'A',
        link: function (scope, element, attrs) {
            if(attrs.role=='Moderator'&&attrs.adminid!=attrs.userid){
                element.attr('class','not-active');
            }
        }
    }
});
