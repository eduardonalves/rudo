angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



  .state('tabsController.acompanharFilas', {
    url: '/page2',
    views: {
      'tab1': {
        templateUrl: 'templates/acompanharFilas.html',
        controller: 'acompanharFilasCtrl'
      }
    }
  })

  .state('tabsController.gerarSenhas', {
    url: '/page3',
    views: {
      'tab2': {
        templateUrl: 'templates/gerarSenhas.html',
        controller: 'gerarSenhasCtrl'
      }
    }
  })

  .state('tabsController.filas', {
    url: '/page10',
    views: {
      'tab4': {
        templateUrl: 'templates/filas.html',
        controller: 'filasCtrl'
      }
    }
  })

  .state('tabsController.configuraEs', {
    url: '/page4',
    views: {
      'tab3': {
        templateUrl: 'templates/configuraEs.html',
        controller: 'configuraEsCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })



  .state('signup', {
    url: '/page6',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('signuptwo', {
    url: '/page10',
    templateUrl: 'templates/signuptwo.html',
    controller: 'signuptwoCtrl'
  })
  .state('cadastrarfilas', {
    url: '/cadastrarfilas/:id',
    templateUrl: 'templates/cadastrarfilas.html',
    controller: 'cadastrarfilasCtrl'
  })
  .state('versenhas', {
    url: '/versenhas',
    templateUrl: 'templates/versenhas.html',
    controller: 'versenhasCtrl'
  })
  .state('page', {
    url: '/page7',
    templateUrl: 'templates/page.html',
    controller: 'pageCtrl'
  })

  .state('page2', {
    url: '/page8',
    templateUrl: 'templates/page2.html',
    controller: 'page2Ctrl'
  })

  .state('page3', {
    url: '/page9',
    templateUrl: 'templates/page3.html',
    controller: 'page3Ctrl'
  })

  .state('configurarsenhas', {
    url: '/configurarsenhas',
    templateUrl: 'templates/configurarsenhas.html',
    controller: 'configurarSenhasCtrl'
  })
  .state('guiches', {
    url: '/guiches',
    templateUrl: 'templates/guiches.html',
    controller: 'guichesCtrl'
  })
  .state('assine', {
    url: '/assine',
    templateUrl: 'templates/assine.html',
    controller: 'assineCtrl'
  })
  .state('minhaconta', {
    url: '/minhaconta',
    templateUrl: 'templates/minhaconta.html',
    controller: 'minhacontaCtrl'
  })
  .state('termos', {
    url: '/termos',
    templateUrl: 'templates/termos.html',
    controller: 'termosCtrl'
  })
  .state('gerarsenhascategorias', {
    url: '/gerarsenhascategorias/:id',
    templateUrl: 'templates/gerarsenhascategorias.html',
    controller: 'gerarsenhascategoriasCtrl'
  })
  .state('painelloja', {
    url: '/painelloja/:id',
    templateUrl: 'templates/painelloja.html',
    controller: 'painelLojaCtrl'
  })
  .state('gerarsenhasclientes', {
    url: '/gerarsenhasclientes/:id',
    templateUrl: 'templates/gerarSenhasClientes.html',
    controller: 'gerarSenhasClienteCtrl'
  })

  .state('login', {
    url: '/page5',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })
  .state('login2', {
    url: '/login2',
    templateUrl: 'templates/login2.html',
    controller: 'login2Ctrl'
  })
//$urlRouterProvider.otherwise('/page1/page3')
$urlRouterProvider.otherwise('/page5')


});
