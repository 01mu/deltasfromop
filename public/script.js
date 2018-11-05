$(document).ready(function(){
    $('[data-toggle="popover"]').popover();
});

var app = angular.module('app', []);

app.controller('main', ['$scope', '$http', '$rootScope',
    function($scope, $http, $rootScope) {

    alert($scope.a);
}]);
