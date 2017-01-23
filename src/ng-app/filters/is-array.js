(function(angular) {
  'use strict';

  /**
   * The filters have their own module within `src/ng-app/filters/`.
   */
  var module = window.mainApp + '.filters';
  angular.module(module)
  
    .filter("isArray", isArray);
  /**
   * isArray
   */

  function isArray() {
    return function(input) {
        return angular.isArray(input);
    };
  }

})(angular);
