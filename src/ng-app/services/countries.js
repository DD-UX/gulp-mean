(function(angular) {
  'use strict';

  /**
   * The services have their own module within `src/ng-app/services/`.
   */
  var module = window.mainApp + '.services';
  angular.module(module)
  
    .factory('countries', countries);
  /**
   * countries
   * @param $http
   */

  //Adding injections for countries
  countries.$inject = ['$http'];

  function countries($http) {
    return {
      get: get
    };

    function get(){
      return $http({
        method: 'GET',
        url: 'https://restcountries.eu/rest/v1/all'
      }); 
    }
  }

})(angular);
