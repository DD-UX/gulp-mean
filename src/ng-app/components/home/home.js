(function(angular) {
  'use strict';

  /**
   * Each section of the site has its own module. It probably also has
   * submodules, though this boilerplate is too simple to demonstrate it. Within
   * `src/ng-app/components/home`, however, could exist several additional folders representing
   * additional modules that would then be listed as dependencies of this one.
   * For example, a `note` section could have the submodules `note.create`,
   * `note.delete`, `note.edit`, etc.
   *
   * Regardless, so long as dependencies are managed correctly, the build process
   * will automatically take take of the rest.
   *
   * The dependencies block here is also where component dependencies should be
   * specified, as shown below.
   */
  var module = window.mainApp + '.home';
  angular.module(module)

  /**
   * Each section or module of the site can also have its own routes. AngularJS
   * will handle ensuring they are all available at run-time, but splitting it
   * this way makes each module more "self-contained".
   */
  .config(Config)
    .controller('HomeController', HomeController);

  Config.$inject = ['$stateProvider'];

  function Config($stateProvider) {
    $stateProvider.state('home', {
      url: '/',
      views: {
        'header': {
          controller: 'HeaderController',
          templateUrl: 'common/header/header__view.html',
          controllerAs: '$ctrl'
        },
        'main': {
          controller: 'HomeController',
          templateUrl: 'components/home/home__view.html',
          controllerAs: '$ctrl'
        },
        'footer': {
          controller: 'FooterController',
          templateUrl: 'common/footer/footer__view.html',
          controllerAs: '$ctrl'
        }
      },
      data: {
        pageTitle: 'Gulp MEAN is running!'
      }
    });
  }

  //Adding injections for HomeController
  HomeController.$inject = ['formHandler', '$document', 'countries'];

  /**
   * HomeController
   * @param formHandler
   * @constructor
   */
  function HomeController(formHandler, $document, countries) {
    // Controller object
    var $ctrl = this;

    // Define loading property
    $ctrl.loading = false;

    // Define leaderForm object
    $ctrl.leaderForm = {};

    // Send Form Method
    $ctrl.sendForm = sendForm;

    // Retrieve countries
    countries
        .get()
        .then(getCountries);

    // Send Form Method
    function sendForm(){
      // Form loading
      $ctrl.loading = true;

      formHandler
        .send($ctrl.leaderForm)
        .then(
          successHandler,
          errorHandler
        );

      function successHandler(res){
        $ctrl.status = res.data.status;
        $ctrl.message = res.data.message;

        $ctrl.loading = false;
        $document.scrollToElementAnimated(angular.element("#form-flags"), 200, 1000);
      }

      function errorHandler(error){
        $ctrl.loading = false;
        $document.scrollToElementAnimated(angular.element("#form-flags"), 200, 1000);
        if(error.status === 400){
          $ctrl.status = error.data.status;
          $ctrl.message = error.data.errors;

          // Matching server side errors with form fields
          _.map($ctrl.message, function(key){
            $ctrl.formMail[key.param].$setDirty();
          });

        } else {

          try {
            throw new Error(error);
          } catch (e) {
            console.error(error);
          }
        } 
      }
    }


    function getCountries(res){
      $ctrl.countries = res.data;
      console.log(res);
    }



  }

})(angular);























