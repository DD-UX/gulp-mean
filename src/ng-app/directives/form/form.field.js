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
    .directive('formMailField', field);

  /**
   * formMailField
   */
  function field() {
    var directive = {
        restrict: 'EA',
        require: ['^form'],
        replace: true,
        templateUrl: 'directives/form/form.field.directive.html',
        link: link,
        scope: {
          model: '=',
          name: '@',
          placeholder: '@',
          type: '@',
          size: '@',
          icon: '@',
          regex: '@',
          required: '=isRequired',
          textarea: '=isTextarea'
        }
    };

    return directive;

    function link(scope, elem){

      // Passing model updated to the scope since Angular is not registering it "automagically"
      elem.delegate("[data-ng-model]", "change", function(){
        scope.model = this.value;
        scope.$apply();
      });

      // On destroy detach events
      scope.$on('$destroy', function(){
        elem.undelegate("[data-ng-model]", "change");
      });

        
    }
  }
})(angular);























