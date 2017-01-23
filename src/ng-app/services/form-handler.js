(function(angular) {
  'use strict';

  /**
   * The services have their own module within `src/ng-app/services/`.
   */
  var module = window.mainApp + '.services';
  angular.module(module)
  
    .factory('formHandler', formHandler);
  /**
   * formHandler
   * @param $http
   */
  //Adding injections for formHandler
  formHandler.$inject = ['$http'];

  function formHandler($http) {
    return {
      send: send
    };

    function send(data){
      return $http({
        method: 'POST',
        url: '/api/form/send',
        data: data
      }); 
    }
  }

})(angular);
