(function(angular) {
  'use strict';
  /**
   * Footer controller
   */
  var module = window.mainApp + '.common';

  angular.module(module)
    .controller('FooterController', FooterController);

  /**
   * FooterController
   * @constructor
   */
  function FooterController() {
      var $ctrl = this;

      // Current year to output in the legal texts
      $ctrl.currentYear = new Date().getFullYear();
  }


})(angular);
