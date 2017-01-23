(function(angular) {
  'use strict';

  /**
   * Within `src/ng-app/directives/form` could exist additional folders representing
   * additional modules that would then be listed as dependencies of this one.
   *
   * Regardless, so long as dependencies are managed correctly, the build process
   * will automatically take take of the rest.
   *
   * The dependencies block here is also where component dependencies should be
   * specified, as shown below.
   */
  var module = window.mainApp + '.directives';
  angular.module(module)
    .directive('formMail', form);

  /**
   * formMail
   */
  function form() {
    var directive = {
        restrict: 'EA',
        transclude: true,
        templateUrl: 'directives/form/form.directive.html',
        scope: {
          callback: '&',
          status: '=',
          message: '=',
          loading: '=isLoading',
          submit: '@submitText',
          name: '='
        }
    };

    return directive;
  }
})(angular);























