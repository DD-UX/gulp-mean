(function(angular) {
  'use strict';
  //Define Main Module name
  window.mainApp = 'toptal_app';


  // Add a new vertical module registration
  angular.registerModule = function(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies);

    // Add the module to the AngularJS configuration file
    var exists = _.includes(angular.module(window.mainApp).requires, moduleName);
    if (!exists) {
      angular.module(window.mainApp).requires.push(moduleName);
    }
    return angular.module(moduleName);
  };

  angular.module(window.mainApp, [
      'ui.router',
      'ngCookies',
      'ngSanitize',
      'ngAnimate',
      'ui.bootstrap',
      'duScroll'
    ])
    .value('duScrollOffset', 60)
    .config(Config)
    .controller('AppController', AppController);

  // Add Injection for Config method
  Config.$inject = ['$httpProvider', '$locationProvider', '$urlRouterProvider'];

  /**
   * Configuration function for the App
   *
   * @param httpProvider
   * @param locationProvider
   * @param urlRouterProvider
   * @constructor
   */
  function Config(httpProvider, locationProvider, urlRouterProvider) {
    //uncomment if you want to use html5 mode.
    locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }).hashPrefix('!');

    httpProvider.defaults.useXDomain = true;
    delete httpProvider.defaults.headers.common['X-Requested-With'];

    urlRouterProvider.otherwise('/');
  }

  // Add injections for AppController
  AppController.$inject = ['$scope', '$state'];

  /**
   * AppController main controller of the app
   * @param $scope
   * @param $state
   * @constructor
   */
  function AppController($scope, $state) {
    // State page change
    $scope.$on('$stateChangeSuccess', function(event, toState) {
      $scope.pageTitle = toState.data.pageTitle;
      $scope.$state = $state;
      $scope.state = $state.$current.self.name;
    });
    
    // OS and Browser detection library
    function initEnvDetection() {
      $scope.envDetection = $.pgwBrowser();
      console.info('User Agent: ', $scope.envDetection.userAgent);          
      console.info('Browser Name: ', $scope.envDetection.browser.name);
      console.info('Browser Full Version: ', $scope.envDetection.browser.fullVersion);          
      console.info('OS Name: ', $scope.envDetection.os.name);
      console.info('OS Full Version: ', $scope.envDetection.os.fullVersion);
    }
    
    initEnvDetection();

    $(window).on('PgwBrowser::StopResizing', function() {
      initEnvDetection();
      $scope.$applyAsync();
    });
  }

  //Then define the init function for starting up the application
  $(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') {
      window.location.hash = '';
    }

    //Then init the app
    angular.bootstrap(document, [window.mainApp]);
  });

})(angular);
