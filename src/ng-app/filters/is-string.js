(function(angular) {
  'use strict';

  /**
   * The filters have their own module within `src/ng-app/filters/`.
   */
  var module = window.mainApp + '.filters';
  angular.module(module)
  
    .filter("isString", isString);
  /**
   * isString
   */

  function isString() {
    return function(input) {
        return angular.isString(input);
    };
  }

})(angular);
