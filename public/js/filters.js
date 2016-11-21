var appModule = angular.module('Application');
appModule.filter('now_age', function(){
    return function(birthday){
        var currentYear = new Date().getYear();
        var birthdayYear = new Date(birthday).getYear();
        return currentYear-birthdayYear;
    }
});
appModule.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
