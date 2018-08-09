angular.module('app.controllers', [])

.controller('assineCtrl', ['$scope','$location','$ionicSideMenuDelegate', '$stateParams','$ionicLoading','$ionicPopup','$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$location,$ionicSideMenuDelegate, $stateParams,$ionicLoading,$ionicPopup,$ionicHistory) {
  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });
$ionicSideMenuDelegate.canDragContent(false);

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    userLoggedOn = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(userLoggedOn) {
      if(!userLoggedOn){
        $location.path('/login')
      }
    });
    viewData.enableBack = true;
    $scope.countLine=0;
    //firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;
      if (user){
        $scope.countLine++;
        $scope.user = firebase.auth().currentUser;
        firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
          $scope.datauser = snapshot.val();
          //console.log(snapshot.val());
        });
      }else{
        //$location.path('/page5')
      }

    //});
  });
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 1000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  user = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(user) {
    $scope.user = firebase.auth().currentUser;
  });
  $scope.showAlert = function(texto) {
    var alertPopup = $ionicPopup.alert({
      title: texto.titulo,
      template: texto.mensagem
    });
    alertPopup.then(function(res) {
    });
  };

  $scope.assinar = function() {
    $scope.showLoading();
    $.getJSON( "http://hudo.000webhostapp.com/entregapp/RestPedidos/pagseguromobile?ref="+$scope.user.uid+"", function( data ){
        $scope.hideLoading();
      if(data[0] !='Existe' && data[0] !='E' )
      {
        //  //console.log(data[0]);
        window.open('https://sandbox.pagseguro.uol.com.br/v2/pre-approvals/request.html?code='+data[0],'_system');
        $scope.hideLoading();
      }else{
        //    //console.log(data[0]);
        $scope.texto  ={};
        $scope.texto.titulo ='Falha';
        $scope.texto.mensagem ='Esta conta já possui uma assinatura Premium.';

        $scope.showAlert($scope.texto);
      }
    });
    /**/
  }


}])

.controller('acompanharFilasCtrl', ['$scope','$timeout', '$ionicSideMenuDelegate','$stateParams','$location','$ionicLoading','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$timeout,$ionicSideMenuDelegate, $stateParams,$location,$ionicLoading,$ionicPopup) {

  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
      $scope.conectDiv=true;
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });
  $ionicSideMenuDelegate.canDragContent(false);
  userLoggedOn = firebase.auth().currentUser;
  $scope.userLoggedOn = userLoggedOn;

  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  $scope.$on('$ionicView.leave', function(){
      //$ionicSideMenuDelegate.canDragContent(true);
      //$('.ion-navicon').show();
      $scope.showContent=false;
    });
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    userLoggedOn = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(userLoggedOn) {
      if(!userLoggedOn){
        $location.path('/login')
      }
    });
    //viewData.enableBack = true;
    $scope.showLoading();
    firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;
      $scope.user = firebase.auth().currentUser;
      firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
        $scope.datauser = snapshot.val();
          //$scope.hideLoading();
          if(snapshot.val() != null){
            if(typeof $scope.datauser.categoria != 'undefined'){
              firebase.database().ref().child('categorias').child($scope.datauser.categoria).once("value", function(snapshot2) {
                  $scope.datauser.categoriaNome = snapshot2.val();
                  //console.log($scope.datauser.categoriaNome);
              },function(error) {
                $timeout(function(){
                  $scope.hideLoading();
                },2000);
              });
            }

          }
          $timeout(function(){
            $scope.showContent=true;
            $scope.hideLoading();
          },2000);
        //console.log(snapshot.val());
      },function(error) {
        $timeout(function(){
          $scope.showContent=true;
          $scope.hideLoading();
        },2000);
      });

    });
  });
  $scope.logout = function (){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      $scope.user = null;
      //$location.path('/login');
      navigator.app.exitApp();
    }, function(error) {
      // An error happened.
    });
  }
  user = firebase.auth().currentUser;
  $scope.user = user;
  firebase.auth().onAuthStateChanged(function(user) {
    $scope.user = firebase.auth().currentUser;
  });
    $scope.uploadProgres =0;
    $scope.showProgress=false;
    $scope.showProgress=false;
  $scope.getImage = function (source) {
      //alert('passou1');
      // Retrieve image file location from specified source
      $('#configForm').submit(function(event) {
        event.preventDefault();
      });
      $scope.showImage=false;
      var options = {
          maximumImagesCount: 1,
          quality: 50
      };
      $scope.showLoading();
      window.imagePicker.getPictures(
        function(results) {

          //alert('passou2');
            for (var i = 0; i < results.length; i++) {

                //getFileEntry(results[i]);

                var imageData = results[i];
                var filename = imageData.split("/").pop();
                var storageRef = firebase.storage().ref();

                var getFileBlob = function(url, cb) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url);
                    xhr.responseType = "blob";
                    xhr.addEventListener('load', function() {
                        cb(xhr.response);
                    });
                    xhr.send();
                };

                var blobToFile = function(blob, name) {
                    blob.lastModifiedDate = new Date();
                    blob.name = name;
                    return blob;
                };

                var getFileObject = function(filePathOrUrl, cb) {
                    getFileBlob(filePathOrUrl, function(blob) {
                        cb(blobToFile(blob, 'test.jpg'));
                    });
                };

                getFileObject(imageData, function(fileObject) {
                    var uploadTask = storageRef.child('images/'+user.uid+'.jpg').put(fileObject);

                    uploadTask.on('state_changed', function(snapshot) {
                        //alert(snapshot);
                    }, function(error) {
                        //alert(error);
                    }, function() {
                        var downloadURL = uploadTask.snapshot.downloadURL;
                        $scope.datauser.foto = downloadURL;
                        firebase.database().ref('users/' + user.uid).set($scope.datauser, function(error) {
                          $scope.texto  ={};
                          $scope.hideLoading();
                          if(error){
                            $scope.texto.titulo ='Ops! Algo deu errado.';
                            $scope.texto.mensagem ='Não conseguimos salvar a configuração.';
                            $scope.showAlert($scope.texto);
                          }else{
                            $scope.texto.titulo ='Tudo Certo!';
                            $scope.texto.mensagem ='Sua configuração foi salva!';
                            $scope.showAlert($scope.texto);
                          }
                        });
                        //alert(downloadURL);
                        // handle image here
                    });
                });
                $timeout(function(){
                  $scope.hideLoading();
                },2000);
            }
        }, function (error) {
            $scope.showImage=false;
            $timeout(function(){
              $scope.hideLoading();
            },2000);
            alert('Error: ' + error);
        },
        options
      );


      $timeout(function(){
        $scope.hideLoading();
      },2000);
   }
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 10000,
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  // Triggered on a button click, or some other target
$scope.showPopup = function() {

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    title: 'Cancelar Conta',
    subTitle: 'Deseja Canelar a conta Premium?',
    scope: $scope,
    buttons: [
      {
        text: '<b>Sim</b>',
        type: 'button-assertive',
        onTap: function(e) {
          $scope.confirmarcancelamento();
        }
      },
      { text: 'Não' }
    ]
  });
}
$scope.showAlert = function(texto) {
  var alertPopup = $ionicPopup.alert({
    title: texto.titulo,
    template: texto.mensagem
  });
  alertPopup.then(function(res) {
  });
};
$scope.confirmarcancelamento = function() {
  $scope.showLoading();
  $.getJSON( "http://hudo.000webhostapp.com/entregapp/RestPedidos/cancelarpagseguro?ref="+$scope.user.uid+"", function( data ){
      $scope.hideLoading();
    if(data[0] !='Not Found' && data[0] !='N' )
    {
        //console.log(data[0]);
    }else{
        //  //console.log(data[0]);
      $scope.texto  ={};
      $scope.texto.titulo ='Falha';
      $scope.texto.mensagem ='Não foi possível cancelar a assinatura, por favor entre em contato com suporte@hudo.com.br';
      $scope.showAlert($scope.texto);

    }
  });
}
$scope.setRaio = function(usercad) {
  $scope.showLoading();
  $scope.datauser.raio = usercad.raio || null;
  $scope.datauser.nome = usercad.nome || null;

  //user = firebase.auth().currentUser;
  //firebase.auth().onAuthStateChanged(function(user) {
    //$scope.user = firebase.auth().currentUser;
  firebase.database().ref('users/' + user.uid).set($scope.datauser, function(error) {
      $scope.texto  ={};
      $scope.hideLoading();
      if(error){
        $scope.texto.titulo ='Ops! Algo deu errado.';
        $scope.texto.mensagem ='Não conseguimos salvar a configuração.';
        $scope.showAlert($scope.texto);
      }else{
        $scope.texto.titulo ='Tudo Certo!';
        $scope.texto.mensagem ='Sua configuração foi salva!';
        $scope.showAlert($scope.texto);
      }
    });
  //});

}
$scope.cancelar = function() {

  $scope.showPopup();

  /**/
}
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };

  //$scope.showLoading();
  //$scope.hideLoading();


}])

.controller('guichesCtrl', ['$scope','$timeout','$ionicSideMenuDelegate', '$stateParams','$location','$ionicLoading','$ionicHistory','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$timeout, $ionicSideMenuDelegate,$stateParams,$location,$ionicLoading,$ionicHistory,$ionicPopup) {
  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });
  $ionicSideMenuDelegate.canDragContent(false);
  userLoggedOn = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  $scope.remover = function(key) {
    $scope.showLoading();
    user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
      firebase.database().ref().child('guiches').child(user.uid).child(key).remove();
      //console.log(key);
      $scope.hideLoading();
    });

  }
  $scope.cadastrar = function(guiche) {
    //console.log(guiche);
    $scope.showLoading();
    if(guiche != '' && typeof guiche != 'undefined')
    {
      user = firebase.auth().currentUser;
      firebase.auth().onAuthStateChanged(function(user) {
        firebase.database().ref().child('guiches').child(user.uid).orderByChild("guiche").startAt(guiche).endAt(guiche).limitToFirst(1).once("value", function(snapshot) {
          if(snapshot.val() != null){
            $scope.hideLoading();
            $scope.texto  ={};
            $scope.texto.titulo ='Aviso';
            $scope.texto.mensagem ='Este guichê já existe.';
            $scope.showAlert($scope.texto);
          }else{
              firebase.database().ref('guiches/' + user.uid ).push({
                guiche: guiche,
              }, function(error) {
                  if(!error)
                  {
                    $scope.texto  ={};
                    $scope.texto.titulo ='Tudo Certo';
                    $scope.texto.mensagem ='A operação foi efetuada.';
                    $scope.hideLoading();
                    $scope.showAlert($scope.texto);
                    $('[name="guiche"]').val('');
                  }
              });

          }
        });
      });
    }else{
      $scope.hideLoading();
      $scope.texto  ={};
      $scope.texto.titulo ='Ops! Algo deu errado.';
      $scope.texto.mensagem ='O guichê não pode estar vazio.';
      $scope.showAlert($scope.texto);
    }


  }
  $scope.showAlert = function(texto) {
    var alertPopup = $ionicPopup.alert({
      title: texto.titulo,
      template: texto.mensagem
    });
    alertPopup.then(function(res) {
    });
  };
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 1000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
    $scope.items =[];
    user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
      firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
        $scope.datauser = snapshot.val();
        //console.log(snapshot.val());
      });
      firebase.database().ref().child('guiches').child(user.uid).on("value", function(snapshot) {
        if(snapshot.val() != null){
          $scope.items = snapshot.val();
        //  //console.log($scope.items);
        }else{
          $scope.totalItens =$scope.items.length;
        }
        $scope.hideLoading();
      });
    })

  });
  $scope.showLoading();
  //$scope.hideLoading();


}])
.controller('gerarSenhasClienteCtrl', ['$scope','$timeout','$ionicSideMenuDelegate', '$ionicPopup', '$stateParams', '$ionicHistory', '$location','$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$timeout, $ionicSideMenuDelegate,$ionicPopup, $stateParams,$ionicHistory, $location, $ionicLoading) {

  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);

      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
    //console.log('off');
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });

  $ionicSideMenuDelegate.canDragContent(false);
  userLoggedOn = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  $scope.retornaNome = function(num) {
    switch (num) {
      case 1:
        return 'Comum';
        break;
        case 2:
          return 'Prioritária';
          break;
          case 3:
            return 'Manual';
            break;
      default:

    }
  }
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...'
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };
  $scope.contadorSenhaCanc= 0;
  $scope.contaSenhasCanceladas = function() {
    setDateTime();
    user = firebase.auth().currentUser;
    $scope.countLine=0;
  //firebase.auth().onAuthStateChanged(function(user) {
      if (user){
      $scope.countLine++;

        var hoje  =getDateSmall(userDateTimeFull);
        $scope.contadorSenhaCanc=0;
        firebase.database().ref().child('senhas_canceladas_usuarios').child(user.uid).orderByChild('data').equalTo(hoje).once("value", function(snapshot3){
          //console.log(snapshot3.val());
          if(snapshot3.val() != null){
            $.each(snapshot3.val(), function(key3,val3) {
              $scope.contadorSenhaCanc ++;

            });
            //console.log($scope.contadorSenhaCanc);
            return $scope.contadorSenhaCanc;
          }
        });
      }
   //});
  }
  $scope.cancelarsenha = function() {
    setDateTime();
    $scope.showLoading();
    $scope.texto ={}
    user = firebase.auth().currentUser;
  $scope.countLine=0;
//  firebase.auth().onAuthStateChanged(function(user) {
    if (user){
      $scope.countLine++;
            var contCandeladas = $scope.contaSenhasCanceladas();

            firebase.database().ref().child('geo_filas_senhas').child($stateParams.id).orderByChild('user_id').equalTo(user.uid).once("value", function(snapshot){

              if(snapshot.val() != null){
                $.each(snapshot.val(), function(key,val) {
                  //console.log(val);

                 firebase.database().ref().child('senhas_usuarios').child(user.uid).orderByChild('numero').equalTo(val.numero).once("value", function(snapshot2){
                     //console.log(snapshot2.val());
                     if(snapshot2.val() != null)
                     {
                       $.each(snapshot2.val(), function(key2,val2) {

                         var hoje  =getDateSmall(userDateTimeFull);
                         firebase.database().ref('senhas_canceladas_usuarios/' + user.uid).push({
                           loja_id:$stateParams.id,data:hoje
                         }, function(error) {

                         });
                         if($scope.contadorSenhaCanc < 3)
                         {
                           firebase.database().ref().child('senhas_usuarios').child(user.uid).child(key2).remove();
                           firebase.database().ref().child('geo_filas_senhas').child($stateParams.id).child(key).remove();
                           $scope.texto.titulo ='Boa!';
                           $scope.texto.mensagem ='Sua senha foi cancelada.';
                           $scope.hideLoading();
                           $scope.showAlert($scope.texto);
                         }else{
                           $scope.texto.titulo ='Ops, algo deu errado!';
                           $scope.texto.mensagem ='Você já não pode mais cancelar senhas por hoje.';
                           $scope.hideLoading();
                           $scope.showAlert($scope.texto);
                         }



                       });
                     }
                     $scope.hideLoading();
                   });
                });
                 $scope.hideLoading();
              }else{
                $scope.texto.titulo ='Opa!';
                $scope.texto.mensagem ='Você não tem senhas nesta fila.';
                $scope.showAlert($scope.texto);
              }
              $scope.hideLoading();
            });

        }else{
           $scope.hideLoading();
        }
    //});
  };
  var user = firebase.auth().currentUser;

  $scope.numFilasInativas=0;

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
    $scope.numFilasInativas=0;
    $scope.lojaFila= [];
    $scope.showLoading();
    firebase.database().ref().child('geo_filas').child($stateParams.id).once("value", function(snapshot) {
      $scope.items = [];
        if(snapshot.val() != null ){
          $scope.items.push(snapshot.val());
          $scope.numFilasInativas = 0;
          $.each(snapshot.val(), function (key, val) {
              //console.log(val);
               if(val.manual == false && val.ativa == false)
               {
                 $scope.numFilasInativas++;
               }
           });
          //console.log($scope.numFilasInativas);
        }else{
          $scope.totalItens =$scope.items.length;
        }
        $scope.hideLoading();

        firebase.database().ref().child('users').child($stateParams.id).once("value", function(snapshot2) {
          if(snapshot2.val() != null ){
            //console.log(snapshot2.val());
            $scope.lojaFila = snapshot2.val();
            $scope.limite = snapshot2.val().limit;
          }
        });
    });

  });


    $scope.showAlert = function(texto) {
      var alertPopup = $ionicPopup.alert({
        title: texto.titulo,
        template: texto.mensagem
      });
      alertPopup.then(function(res) {
      });
    };
    $scope.contador='';
    $scope.contaNumero = function(id){
      setDateTime();
      user = firebase.auth().currentUser;
      $scope.contadorAuxSenha = 0;
      $scope.countLine=0;
      //firebase.auth().onAuthStateChanged(function(user) {
        if (user){
          $scope.countLine++;

            if($scope.contadorAuxSenha==0)
            {
              firebase.database().ref().child('geo_filas').child($stateParams.id).child(id).once("value", function(snapshot) {
                fila =snapshot.val();
                $scope.contador = parseInt(fila.numero_contador) + 1;
              //  //console.log($scope.contador);
                user = firebase.auth().currentUser;
                var mykey = firebase.database().ref('geo_filas_senhas/' + $stateParams.id).push();
                var prefixo = fila.prefixo || '';
                var contador = $scope.contador || 1;
                var posFixoRestaurante = '';
                if(typeof $scope.lojaFila.categoria != 'undefined'){
                  if($scope.lojaFila.categoria== 1){
                    posFixoRestaurante ='';
                    posFixoRestaurante= $('#qtdPessoas').val();
                    if(typeof posFixoRestaurante != 'undefined' && posFixoRestaurante != '? undefined:undefined ?'){
                        posFixoRestaurante = ' P-'+ posFixoRestaurante;
                    }else {
                        posFixoRestaurante = ' P-'+ 1;
                    }

                  }
                }
                var nome  = fila.nome || 'S/N';
                var user_id = $('#user_id').val() || null;

                firebase.database().ref('geo_filas_senhas/' + $stateParams.id).push({
                  pos:contador, numero:prefixo + $scope.contador + posFixoRestaurante, ativo:'true', tipo:nome,data:getDate(userDateTimeFull),user_id:user.uid,
                }, function(error) {
                    $scope.texto={};
                    if(error){
                      $scope.texto.titulo ='Ops! Algo deu errado.';
                      $scope.texto.mensagem ='Operaçao não efetuada.';
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }else
                    {
                      $scope.texto.titulo ='Tudo Certo';
                      $scope.texto.mensagem ='Sua senha '+ prefixo + contador + posFixoRestaurante;
                      firebase.database().ref('geo_filas').child($stateParams.id).child(id).child('/numero_contador').set( $scope.contador);
                      if(user.uid != '')
                      {
                        firebase.database().ref('senhas_usuarios/' + user.uid).push({
                          pos:contador, numero:prefixo + $scope.contador + posFixoRestaurante, ativo:'true', tipo:nome,data:getDate(userDateTimeFull),loja_id:$stateParams.id,
                        }, function(error) {

                        });
                      }
                      // $('#qtdPessoas').val('');
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }
                });
              });
            }

          }
      //});

    }

    $scope.contaSenha = function()
    {
      setDateTime();
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();

      var ref = firebase.database().ref("senhas_gratis/"+$stateParams.id+'/'+ year +'/'+ month);
      ref.once("value").then(function(snapshot) {
        var a = snapshot.numChildren(); // 1 ("name")
        $scope.contadorSenha = snapshot.child(day).numChildren(); // 2 ("first", "last")
      });
    }
    $scope.contadorSenha = $scope.contaSenha();
    $scope.setlogsenha = function()
    {
      setDateTime();
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      user = firebase.auth().currentUser;
      firebase.database().ref('senhas_gratis/' + user.uid +'/' + year +'/'+ month+'/'+ day ).push({qtd:1});
    }
    //$scope.setlogsenha();
    $scope.gerarSenha = function(value, id)
    {
        $scope.showLoading();


        user = firebase.auth().currentUser;
        $scope.countLine=0;
        //firebase.auth().onAuthStateChanged(function(user) {
            if (user){
              $scope.countLine++;

                firebase.database().ref().child('geo_filas_senhas').child($stateParams.id).orderByChild('user_id').equalTo(user.uid).once("value", function(snapshot){
                    $scope.texto= {};
                    if(snapshot.val() == null)
                    {
                      user = firebase.auth().currentUser;
                      $scope.contaSenha();


                      if( $scope.contadorSenha  >= $scope.limite)
                      {
                        $scope.texto.titulo ='Ops! Que embaraçoso.';
                        $scope.texto.mensagem ='Acabaram as senhas disponíveis deste estabelecimento por hoje. Tente pegar uma senha outro dia.';
                        $scope.hideLoading();
                        $scope.showAlert($scope.texto);

                      }else{
                        userNotf = user.displayName;
                        userNotf = userNotf || user.email;
                        userNotf = userNotf || null;
                        if(userNotf != '' && userNotf !=null){
                            sendNotificationTouUserNewNumberEstab($stateParams.id,userNotf);
                        }

                        $scope.setlogsenha();
                        $scope.contaNumero(id);
                      }
                    }else{
                      $scope.texto.titulo ='Ops! Que embaraçoso.';
                      $scope.texto.mensagem ='Você já tem uma senha ativa neste estabelecimento, e não pode pegar outra senha neste momento. Cancele sua senha ou aguarde a sua senha ser chamada.';
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }
                });
            }
        //});

  }



  $scope.pos={};
  $scope.pos.lat=0;
  $scope.pos.lon=0;
  $scope.post={};
  $scope.imageUrl='';

  var onSuccessPos = function(position) {
      $scope.pos.lat = position.coords.latitude;
      $scope.pos.lon= position.coords.longitude;
      //console.log($scope.pos.lon);
  };

    // onError Callback receives a PositionError object
  function onErrorPos(error) {
      $scope.posErro=error;
      calldialog();
  }

  navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});


  //$scope.fila.user_id ='';
  $scope.fila = [];
  if (user) {
    // User is signed in.
    //alert('1');
    //console.log(user);
    $scope.fila.user_id = user.uid;
  } else {
      $location.path('/page5')

  }

  var firebaseRef = firebase.database().ref().child('geo_filas');
  var geoFire = new GeoFire(firebaseRef);
  var ref = geoFire.ref();  // ref === firebaseRef
  //var mykey = ref.child('dados').push();
  //console.log(user.uid);
  var user = firebase.auth().currentUser
  //$scope.showConfirm();
  // An alert dialog


  $scope.cadastrarFila = function(fila) {
    var user = firebase.auth().currentUser
    var nome = fila.nome || null;
    var ativa = fila.ativa || false;
    var prioridade = fila.prioridade || false;
    var prioridade_qtd = fila.qtd_prioridade || 0;
    var manual = fila.manual || false;
    var numero_contador = fila.numero_contador || 0;
    var prefixo = fila.prefixo || '';
    $scope.texto= {};
    //console.log(nome);
    if(nome == null || nome == 'undefined' )
    {
      $scope.texto.titulo ='Ops! Algo deu errado.';
      $scope.texto.mensagem ='O nome não poder estar vazio.';
      $scope.showAlert($scope.texto);
    }else{
      firebase.database().ref('geo_filas/' + user.uid + '/' + $stateParams.id).set({
        nome: nome,
        ativa:ativa,
        prioridade:prioridade,
        prioridade_qtd:prioridade_qtd,
        manual:manual,
        numero_contador:numero_contador,
        prefixo:prefixo,
      }, function(error) {
          if(error){
            $scope.texto.titulo ='Ops! Algo deu errado.';
            $scope.texto.mensagem ='Não conseguimos realizar a operação.';
            $scope.showAlert($scope.texto);
          }else
          {
            $scope.texto.titulo ='Tudo certo!';
            $scope.texto.mensagem ='A operação foi efetuada.';
            $scope.showAlert($scope.texto);
          }
      });
    }
  }
}])
.controller('painelLojaCtrl', ['$scope','$timeout', '$ionicSideMenuDelegate','$stateParams','$location','$ionicLoading','$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$timeout, $ionicSideMenuDelegate,$stateParams,$location,$ionicLoading,$timeout) {

  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });
  $ionicSideMenuDelegate.canDragContent(false);
  userLoggedOn = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.verFila = function(id)
  {
    $location.path('/painelloja/'+id);
  }
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
    $scope.showLoading();
    $scope.countLine=0;
    //firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;

      if (user){
        $scope.countLine++;
        $timeout(function() {
          firebase.database().ref().child('users').child($stateParams.id).once("value", function(snapshot) {

            $scope.datauser = snapshot.val();
            //console.log($scope.datauser);
            if($scope.datauser.role == 2)
            {
              firebase.database().ref().child('geo_filas_senhas_usadas').child($stateParams.id).limitToLast(1).on("child_added", function(snapshot) {
                if(snapshot.val() != null ){
                  $scope.senha=snapshot.val();
                  $scope.hideLoading();
                }
              });
              $scope.senhasAnterioresAux=[]
              var ref = firebase.database().ref().child('geo_filas_senhas_usadas').child($stateParams.id);

              $scope.senhasAnteriores=[];
              ref.orderByKey().limitToLast(10).on("child_added", function(snapshot) {
                if(snapshot.val() != null ){
                  //if($scope.senhasAnteriores.length < 5){
                    $scope.senhasAnteriores.unshift(snapshot.val());

                //  }else{
                    //$scope.senhasAnterioresAux.unshift(snapshot.val());
                  //}
                  //countRef++;

                }
              });
            }
            $scope.minhasenha='';
            firebase.database().ref().child('geo_filas_senhas').child($stateParams.id).orderByChild('user_id').equalTo(user.uid).once("value", function(snapshot){

                if(snapshot.val() != null)
                {
                  $.each(snapshot.val(), function (key, val) {
                     $scope.minhasenha = val;
                 });
                  //$scope.minhasenha=snapshot.val();

                  //console.log($scope.minhasenha);
                }
            });
          });
          $timeout(function () {
            $('#filtro').val(' ');
            $scope.hideLoading();
          }, 3000);
        },2500);


      } else {
          $scope.hideLoading();
          $location.path('/page5')

      }

    //});

  });

   $scope.moredata = false;

   $scope.loadMoreData=function()
   {

      if(typeof $scope.senhasAnterioresAux[0] != "undefined")
      {

        $scope.senhasAnteriores.push($scope.senhasAnterioresAux[0]);
        $scope.senhasAnterioresAux.shift();

        $scope.$broadcast('scroll.infiniteScrollComplete');
      }else{

         $timeout(function() {
           $scope.$broadcast('scroll.infiniteScrollComplete');
           $scope.moredata=true;
         },3000);
      }


   };


  $scope.mostrar = function()
  {
    $('.nav-bar-container').fadeIn(1000);
    $('.tabs').fadeIn(1000);
  }
  $scope.esconder = function()
  {
    $('.nav-bar-container').fadeOut(1000);
    $('.tabs').fadeOut(1000);
  }



//alert();
}])

.controller('gerarsenhascategoriasCtrl', ['$scope','$window','$ionicSideMenuDelegate','$timeout' ,'$stateParams','$location','$ionicLoading','$ionicHistory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$window,$ionicSideMenuDelegate ,$timeout,$stateParams,$location,$ionicLoading,$ionicHistory) {

var connectedRef = firebase.database().ref(".info/connected");
$scope.tentativas = 0;
//$scope.conectDiv=true;
connectedRef.on("value", function(snap) {
  $ionicLoading.hide().then(function(){
     //console.log("The loading indicator is now hidden");
  });
  if (snap.val() === true) {
    $scope.conectDiv=true;

    $timeout(function () {
        $('body').trigger('click');
      //  $scope.conectDiv=true;
    },1500);
    //$window.location.reload();
  } else {

    $scope.conectDiv=false;
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });

  }
});
 $ionicSideMenuDelegate.canDragContent(false);
 $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
   //calldialog();
   $scope.showLoading();
   //alert('passou1');

   navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
    //navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos);
    viewData.enableBack = true;

    //
  });
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };
  $scope.$on('$ionicView.leave', function(){
    $scope.pos={};
    $scope.pos.lat=0;
    $scope.pos.lon=0;
    $scope.noStores=false;
  });
  var geoQuery;
  $scope.pos={};
  $scope.pos.lat=0;
  $scope.pos.lon=0;
  $scope.noStores=false;
  if($stateParams.id == 't')
  {
    var firebaseRef = firebase.database().ref().child('geo_lojas');

  }else{
      var firebaseRef = firebase.database().ref().child('geo_lojas_cat').child($stateParams.id);
  }

  var geoFire = new GeoFire(firebaseRef);
  var ref = geoFire.ref();
  firebase.auth().onAuthStateChanged(function(user) {
    if (user)
    {
      $scope.user = user;
    }
  });
  function onSuccessPos(position) {

      $scope.pos.lat = position.coords.latitude;
      $scope.pos.lon= position.coords.longitude;
      //alert('passou2');
      //-22.5108
      //-43.1844

      //console.log();
      user = firebase.auth().currentUser;
      //console.log(user);
      //console.log($scope.lojaId);
      $scope.countLine=0;
      //firebase.auth().onAuthStateChanged(function(user) {
        if (user){
          $scope.countLine++;
          $scope.user = user;
          $scope.lojas=[];
          firebase.database().ref().child('users').child(user.uid).once("value", function(snapshotuser) {
            $scope.datauser = snapshotuser.val();

            var raio = snapshotuser.val().raio || 50;
            raio = parseInt(raio);
            geoQuery = geoFire.query({
              center: [$scope.pos.lat, $scope.pos.lon],
              radius: raio
            });
            $scope.hasStore = false;


            var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location) {
              //console.log(location);
                $scope.hasStore = true;
                $scope.noStores=false;
                $scope.temloja='tem';
                $scope.showLoading();


                if($stateParams.id == 't')
                {
                  firebase.database().ref().child('users').child(key).once("value", function(snapshot) {
                    $scope.segue='N';
                    //console.log(snapshot.val());
                    $timeout(function() {
                      $('#filtro').val('');
                      $('#filtro').trigger('change');
                      //$('#filtro').focus();
                      $scope.hideLoading();
                    },3500);
                    firebase.database().ref().child('lojas_seguidores').child(key).orderByValue().equalTo($scope.user.uid).once("value", function(snapshot2) {
                      if(snapshot2.val() != null){
                        //console.log(snapshot2.val());
                        $scope.segue='S';
                        //$scope.hasStore =true;
                        //$scope.noStores=false;
                      }else{
                        //$scope.hasStore = false;
                        //$scope.noStores=true;
                      }
                      //console.log(snapshot.val());
                      //console.log('aqui');
                      dadosLojas = {
                        'email':snapshot.val().email,
                        //'endereco':snapshot.val().endereco,
                        'foto':snapshot.val().foto,
                        'nome':snapshot.val().nome,
                        'categoriaNome':returnCategoria(snapshot.val().categoria),
                        'categoria':snapshot.val().categoria,
                        'rudovip':snapshot.val().rudovip,
                        'desconto':snapshot.val().desconto,
                        'porcentagem':snapshot.val().porcentagem,
                        'condicoes':snapshot.val().condicoes,
                        'endereco':snapshot.val().endereco,
                        'bairro':snapshot.val().bairro,
                        'cidade':snapshot.val().cidade,
                        'uf':snapshot.val().uf,
                        'telefone1':snapshot.val().telefone1,
                        'telefone2':snapshot.val().telefone2,
                         'id':key,
                         'segue':$scope.segue,
                         raio:50,
                      }
                      if($scope.lojas.length < 5)
                      {
                        $scope.lojas.unshift(dadosLojas);
                      }else
                      {
                        $scope.lojas.unshift(dadosLojas);
                      }
                      $scope.hideLoading();
                      //console.log(snapshot.key);
                    });
                      $scope.hideLoading();
                     //$scope.lojas.push(dadosLojas);
                     //console.log($scope.lojas);
                  });
                }else
                {
                  firebase.database().ref().child('geo_lojas_cat').child($stateParams.id).child(key).child('dados').once("value", function(snapshot) {
                    $scope.segue='N';

                    $timeout(function() {
                      $('#filtro').val('');
                      $('#filtro').trigger('change');
                      $scope.hideLoading();
                      //$('#filtro').focus();
                    },3000);

                    firebase.database().ref().child('lojas_seguidores').child(key).orderByValue().equalTo($scope.user.uid).once("value", function(snapshot2) {
                      if(snapshot2.val() != null){
                        //console.log(snapshot2.val());
                        $scope.segue='S';
                      }else{
                        $scope.noStores=true;
                      }
                      firebase.database().ref().child('users').child(key).once("value", function(snapshot3) {
                        if(snapshot3.val() != null){
                          //console.log(snapshot3.val());
                          //console.log(returnCategoria($stateParams.id));
                          //console.log($stateParams.id);
                          dadosLojas = {
                            'email':snapshot.val().email,
                            'endereco':snapshot.val().endereco,
                            'foto':snapshot3.val().foto,
                            'nome':snapshot.val().nome,
                            'categoriaNome':returnCategoria($stateParams.id),
                            'telefone':snapshot.val().telefone,
                             'id':key,
                             'segue':$scope.segue,
                             raio:50,
                          }
                          $scope.lojas.unshift(dadosLojas);

                          $scope.hideLoading();
                        }
                      });

                      //console.log(snapshot.key);
                    });
                    $scope.hideLoading();
                     //$scope.lojas.push(dadosLojas);
                     //console.log($scope.lojas);
                  });
                }



             });

          });
          $scope.hideLoading();
          // //console.log(onKeyEnteredRegistration);
        }else{
          $scope.hideLoading();
        }

      //});

  };

    // onError Callback receives a PositionError object
  function onErrorPos(error) {
      $scope.hideLoading();

      calldialog();
      $scope.posErro=error;
      //alert(error);
  }
  //$scope.moredata = false;

  /*$scope.loadMoreData=function()
  {
     if(typeof $scope.lojas[0] != "undefined")
     {
       $scope.lojas.push($scope.lojas[0]);
       $scope.lojas.shift();
       $scope.$broadcast('scroll.infiniteScrollComplete');
     }else{
        $timeout(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.moredata=true;
        },3000);
     }


  };*/
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.verFila=function(id)
  {

  }
  $scope.seguirEstabelecimento=function(id)
  {
    $scope.showLoading();
    $scope.lojaId = id;

    user = firebase.auth().currentUser;
    //console.log($scope.lojaId);
    $scope.countLine=0;
    //firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;
        //console.log();
        firebase.database().ref().child('lojas_seguidores').child($scope.lojaId).orderByValue().equalTo(user.uid).once("value", function(snapshot) {
          if(snapshot.val() != null){
            $.each(snapshot.val(), function (key, val) {
                firebase.database().ref('lojas_seguidores/'+$scope.lojaId+'/'+key).remove();
                firebase.database().ref('usuarios_favoritos').child(user.uid).child($scope.lojaId).remove();
                $('#seguir'+id).removeClass('segueS');
                $('#seguir'+id).removeClass('segueN');
                $('#seguir'+id).addClass('segueN');
            });
            $scope.hideLoading();
          }else{
            $('#seguir'+id).removeClass('segueN');
            $('#seguir'+id).removeClass('segueS');
            $('#seguir'+id).addClass('segueS');
            firebase.database().ref().child('lojas_seguidores').child($scope.lojaId).push(user.uid);
            firebase.database().ref().child('usuarios_favoritos').child(user.uid).child($scope.lojaId).push($scope.lojaId);
          }
          $scope.hideLoading();
          //console.log(snapshot.key);
        });
      }

      //$scope.hideLoading();
    //});

  }

}])


.controller('configurarSenhasCtrl', ['$scope','$timeout','$ionicSideMenuDelegate', '$stateParams','$location','$ionicLoading','$ionicHistory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$timeout,$ionicSideMenuDelegate, $stateParams,$location,$ionicLoading,$ionicHistory) {

  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });

  userLoggedOn = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  $ionicSideMenuDelegate.canDragContent(false);
  var user="";
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };
  $scope.retornaNome = function(num) {
    switch (num) {
      case 1:
        return 'Comum';
        break;
        case 2:
          return 'Prioritária';
          break;
          case 3:
            return 'Manual';
            break;
      default:

    }
  }
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 3000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
    $scope.showLoading();

    user = firebase.auth().currentUser;
    $scope.countLine=0;
    //firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;
        firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
          $scope.datauser = snapshot.val();
          //console.log(snapshot.val());
        });
        // User is signed in.
        //console.log(user);
          $scope.items =[];
          firebase.database().ref().child('geo_filas').child(user.uid).on("value", function(snapshot) {
            if(snapshot.val() != null){
              //console.log(snapshot.val());
              $scope.items.push(snapshot.val());
              //console.log($scope.items);
            }else{
              $scope.totalItens =$scope.items.length;
            }
            $scope.hideLoading();
            //  //console.log($scope.items);

          });

      } else {
        // No user is signed in.
        $location.path('/page5');
      }
    //});

  });
  $scope.hideLoading();

  $scope.irEditarFila = function(texto) {
    $location.path('/cadastrarfilas/'+texto);
  }
  $scope.showTrueFalse = function(texto) {
  //  //console.log(texto);
    if(texto== true){
      return 'Ativa';
    }else{
      return 'Inativa';
    }
  }

}])


.controller('gerarSenhasCtrl', ['$scope', '$ionicSideMenuDelegate','$stateParams','$ionicPopup','$location','$ionicLoading','$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $ionicSideMenuDelegate,$stateParams,$ionicPopup,$location,$ionicLoading,$timeout) {

  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
          $('#filtro').val('');
          $('#filtro').trigger('change');

          $('#filtro2').val('');
          $('#filtro2').trigger('change');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });


  $scope.limite =1;
  $scope.tituloPagina='';
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //$scope.conectDiv=true;
    $scope.showLoading();

    //console.log('entrou3');
    user = firebase.auth().currentUser;
    $scope.datauser = '';
    userLoggedOn = user;
    firebase.auth().onAuthStateChanged(function(userLoggedOn) {
      if(!userLoggedOn){
        $location.path('/login')
      }
    });

    //console.log($scope.datauser);
    $scope.countLine = 0;
  //  firebase.auth().onAuthStateChanged(function(user) {
      if (user)
      {

        $scope.countLine++;
        //$scope.showLoading();
        //console.log('contador de linhas da 1148 é :'+$scope.countLine);
        $timeout(function() {
            //console.log('aqui1');
        firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
          $scope.datauser = snapshot.val();
          //console.log(snapshot.val());
          //$scope.showLoading();
          //console.log('aqui2');
          if(snapshot.val().role ==2){
              $scope.tituloPagina='Gerar Senhas';
              //console.log('aqui3');
                firebase.database().ref().child('geo_filas').child(user.uid).once("value", function(snapshot) {
                  //console.log('aqui4');
                  $scope.items = [];
                    if(snapshot.val() != null ){
                      $scope.items.push(snapshot.val());
                      //console.log($scope.items);
                    }else{
                      $scope.totalItens =$scope.items.length;
                    }
                    $scope.hideLoading();
                    firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
                      if(snapshot.val() != null ){
                        $scope.limite = snapshot.val().limit;
                      }
                    },function(error) {
                      $scope.hideLoading();
                    });
                },function(error) {
                  $scope.hideLoading();
                });

          }else{
            $scope.tituloPagina='Pegar Senha';
            $scope.showLoading();
            //console.log('aqui');
            firebase.database().ref().child('categorias').orderByChild('categorias').once("value", function(snapshot) {
              //console.log('aqui2');
                if(snapshot.val() != null ){
                  //console.log('aqui3');
                  $scope.categorias = snapshot.val();
                  $scope.optCategorias = [];
                  $.each($scope.categorias, function(key, value){
                    if(value != '' && typeof value != 'undefined' && typeof value != undefined &&  value != null){

                        $scope.optCategorias.push({'categoria': value,'id':key});
                    }
                  });

                  //console.log($scope.optCategorias);
                  $timeout(function () {
                    //console.log('aqui4');
                    $('#filtro').val('');
                    $('#filtro').trigger('change');
                    $scope.hideLoading();
                  }, 1000);

                }else{
                  $timeout(function () {

                    $scope.hideLoading();
                  }, 2000);

                }



              //  $('#filtro').focus();

            },function(error){
              //console.log('aqui 5');
                $scope.hideLoading();
            });
          }
        }, function(error){
          //console.log('aqui 6');
            $scope.hideLoading();
        });

      },2500);
      }else{
        //console.log('aqui3');
        $scope.tituloPagina='Pegar Senha';
        $scope.showLoading();
        $timeout(function () {
          $scope.showLoading();
          user = firebase.auth().currentUser;
          if(user)
          {

            $scope.showLoading();
            firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
              $scope.datauser = snapshot.val();

              if(snapshot.val().role ==2)
              {
                $scope.tituloPagina='Gerar Senhas';
                //console.log('aqui3');
                  firebase.database().ref().child('geo_filas').child(user.uid).once("value", function(snapshot) {
                  //  //console.log('aqui4');
                    $scope.items = [];
                      if(snapshot.val() != null ){
                        $scope.items.push(snapshot.val());
                    //    //console.log($scope.items);
                      }else{
                        $scope.totalItens =$scope.items.length;
                      }
                      $scope.hideLoading();
                      firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
                        if(snapshot.val() != null ){
                          $scope.limite = snapshot.val().limit;
                        }
                      },function(error) {
                        $scope.hideLoading();
                      });
                  },function(error) {
                    $scope.hideLoading();
                  });

              }


            });



            //console.log($scope.datauser);
            $scope.showLoading();
            firebase.database().ref().child('categorias').orderByChild('categorias').once("value", function(snapshot) {
              //console.log('aqui2');
              //$scope.showLoading();
                if(snapshot.val() != null ){

                  $scope.categorias = snapshot.val();
                  $scope.optCategorias = [];
                  $.each($scope.categorias, function(key, value){
                    if(value != '' && typeof value != 'undefined' && typeof value != undefined &&  value != null){
                      $scope.optCategorias.push({'categoria': value,'id':key});
                    }
                  });

                  //console.log($scope.optCategorias);
                  $timeout(function () {
                    //console.log($scope.optCategorias);
                    $('#filtro').val('');
                    $('#filtro').trigger('change');
                    $scope.hideLoading();
                  }, 3000);

                }else{
                  $timeout(function () {
                    $scope.hideLoading();
                  }, 2000);

                }
              //  $('#filtro').focus();

            }, function(error){
              //console.log('aqui 5');
                $scope.hideLoading();
            });
            //console.log('aqui1');
          }else{
            $scope.showLoading();
          }


        }, 3000);


        //console.log('aqui');
      //  document.location.href = '#/page5';
      }
    //});
    $timeout(function() {
      //$('#filtro').val('');
      //$('#filtro').trigger('change');
      //$('#filtro').focus();
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });
    },3000);

    //$scope.titulo='Gerar Senhas';
    //$scope.hideLoading();

  });
  $scope.gerarSenhasCategorias = function(texto) {

    $location.path('/gerarsenhascategorias/'+texto);
  }
  $scope.removeUser = function() {
    $scope.showUserNotFind = false;
    $scope.userToNotify =[];
    $('#busca').val('');

  }
  $scope.showMensageuser = function(search) {
    if($scope.userToNotify == null || $scope.userToNotify == '' )
    {
        $scope.showUserNotFind = true;
      $timeout(function() {
        $scope.showUserNotFind = false;
      },9000);

    }else
    {
      $scope.showUserNotFind = false;
    }
  }
  $scope.retornaNome = function(num) {
    switch (num) {
      case 1:
        return 'Comum';
        break;
        case 2:
          return 'Prioritária';
          break;
          case 3:
            return 'Manual';
            break;
      default:

    }
  }
  $scope.userToNotify='';
  $scope.buscarUsuarios = function(search) {
    $scope.showUserNotFind = false;
    if(typeof search != 'undefined' )
    {
      busca =  search.split("@");
      //var rootRef = firebase.database.ref();
      //var usersRef = rootRef.child("users");
//      //console.log(usersRef.parent.isEqual(rootRef));
    firebase.database().ref().child('users').orderByChild('email').equalTo(search).on("value", function(snapshot) {

      $scope.userToNotify=snapshot.val();
    //  //console.log(snapshot.val());
    });
      if(busca.length == 1){

      }


      //console.log(search);
    }


  }
  $scope.pos={};
  $scope.pos.lat=0;
  $scope.pos.lon=0;
  $scope.post={};
  $scope.imageUrl='';
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...'
    }).then(function(){

    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){

    });
  };




  $scope.showAlert = function(texto) {
    var alertPopup = $ionicPopup.alert({
      title: texto.titulo,
      template: texto.mensagem
    });
    alertPopup.then(function(res) {
    });
  };
  $scope.contador='';
  $scope.contaNumero = function(id){
    setDateTime();
    user = firebase.auth().currentUser;
    $scope.contadorAuxSenha = 0;
    $scope.countLine=0;
    //firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;

          if($scope.contadorAuxSenha==0){
            $scope.contadorAuxSenha ++
            firebase.database().ref().child('geo_filas').child(user.uid).child(id).once("value", function(snapshot){
              if(snapshot.val() != null)
              {
                fila =snapshot.val();
                $scope.contador = parseInt(fila.numero_contador) + 1;
              //  //console.log($scope.contador);
                user = firebase.auth().currentUser;
                var mykey = firebase.database().ref('geo_filas_senhas/' + user.uid).push();
                var prefixo = fila.prefixo || '';
                var contador = $scope.contador || 1;
                var nome  = fila.nome || 'S/N';

                var posFixoRestaurante = '';
                if(typeof $scope.datauser.categoria != 'undefined'){
                  if($scope.datauser.categoria== 1){

                    posFixoRestaurante= $('#qtdPessoas').val();
                    if(typeof posFixoRestaurante != 'undefined' && posFixoRestaurante != '? undefined:undefined ?'){
                        posFixoRestaurante = ' P-'+ posFixoRestaurante;
                    }else {
                        posFixoRestaurante = ' P-'+ 1;
                    }

                  }
                }

                firebase.database().ref('geo_filas_senhas/' + user.uid).push({
                  pos:contador, numero:prefixo + $scope.contador + posFixoRestaurante, ativo:'true', tipo:nome,data:getDate(userDateTimeFull),user_id:$scope.user_id ,
                }, function(error) {
                    $scope.hideLoading();
                    $scope.texto={};
                    if(error){
                      $scope.texto.titulo ='Ops! Algo deu errado.';
                      $scope.texto.mensagem ='Não conseguimos efetuar a operação.';
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }else
                    {
                      $scope.texto.titulo ='Tudo certo!';
                      $scope.texto.mensagem ='Sua senha é  '+ prefixo + contador + posFixoRestaurante;
                      firebase.database().ref('geo_filas').child(user.uid).child(id).child('/numero_contador').set( $scope.contador);


                      if($scope.user_id  != '' && $scope.user_id  != null)
                      {

                        firebase.database().ref('senhas_usuarios/' + $scope.user_id).push({
                          pos:contador, numero:prefixo + $scope.contador + posFixoRestaurante, ativo:'true', tipo:nome,data:getDate(userDateTimeFull),loja_id:$scope.user_id ,
                        }, function(error) {

                        });
                      }
                      $scope.hideLoading();
                       $('#qtdPessoas').val('');
                      $scope.showAlert($scope.texto);
                    }
                });
              }else
              {
                  $scope.texto={};
                  $scope.texto.titulo ='Ops! Que embaraçoso';
                  $scope.texto.mensagem ='Algo deu errado, a operação não foi efetuada.';
                  $scope.hideLoading();
                  $scope.showAlert($scope.texto);
              }
            });

          }
        }
    //});

  }

  $scope.contaSenha = function()
  {
    setDateTime();
    $scope.countLine=0;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        $scope.countLine++;

        user = firebase.auth().currentUser;
        var ref = firebase.database().ref("senhas_gratis/"+user.uid+'/'+ year +'/'+ month);
        ref.once("value")
          .then(function(snapshot) {
            var a = snapshot.numChildren(); // 1 ("name")
            $scope.contadorSenha = snapshot.child(day).numChildren(); // 2 ("first", "last")
          //  //console.log($scope.contadorSenha);
            //return b;
          });
      }
    });

  }
  $scope.contadorSenha = $scope.contaSenha();
  $scope.setlogsenha = function()
  {
    setDateTime();
    //$timeout(function () {
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      user = firebase.auth().currentUser;
      firebase.database().ref('senhas_gratis/' + user.uid +'/' + year +'/'+ month+'/'+ day ).push({qtd:1});
    //}, 300);

  }
  //$scope.setlogsenha();
  $scope.gerarSenha = function(value, id)
  {
      $scope.showLoading();
      user = firebase.auth().currentUser;
      var user_id = $('#user_id').val();
      $scope.user_id = $('#user_id').val() || null;
      user_id = user_id || null;
      $('#user_id').val('');
      $('#busca').val('');
      $scope.userToNotify =[];
      $scope.contaSenha();
      $scope.texto= {};

      if( $scope.contadorSenha  >= $scope.limite)
      {
        $scope.texto.titulo ='Aviso';
        $scope.texto.mensagem ='Limite de senhas diárias excedido. Aumente o limite em configurações -> Minha Conta.';
        $scope.hideLoading();
        $scope.showAlert($scope.texto);

      }else{
        $scope.setlogsenha();
        $scope.contaNumero(id);
        estab = user.displayName;
        estab = estab || user.email;
        if(user_id != '' && user_id !=null){
            sendNotificationTouUserNewNumber(user_id,estab);
        }

      }
  }
  $scope.senhamanual='';
  $scope.gerarSenhaManual = function(value, id, senhamanual)
  {
      setDateTime();
      $scope.showLoading();
      //console.log('aqui');

      var user_id = $('#user_id').val();
      $scope.user_id = $('#user_id').val() || null;
      user_id = user_id || null;
      $('#user_id').val('');
      $('#busca').val('');
      $scope.userToNotify =[];
      if(senhamanual != '')
      {
        user = firebase.auth().currentUser;
        $scope.setlogsenha();
        $scope.existNum ='';
        $scope.contaSenha();
        $scope.texto= {};
        //console.log('aqi232');
        if( $scope.contadorSenha  >= $scope.limite)
        {
          $scope.texto.titulo ='Aviso';
          $scope.texto.mensagem ='Limite de senha diárias excedido.';
          $scope.hideLoading();
          $scope.showAlert($scope.texto);

        }else{
          firebase.database().ref().child('geo_filas_senhas').child(user.uid).orderByChild("numero").startAt(senhamanual).endAt(senhamanual).once("value", function(snapshot) {
            if(snapshot.val() != null && snapshot.val() != 'null'  && snapshot.val() != ''){
              $scope.texto={};
              $scope.texto.titulo ='Ops! Algo deu errado.';
              $scope.texto.mensagem ='Este número já está em uso.';
              $scope.hideLoading();
              $scope.showAlert($scope.texto);
            }else{
              var mykey = firebase.database().ref('geo_filas_senhas/' + user.uid).push();
              firebase.database().ref('geo_filas_senhas/' + user.uid +'/' + mykey.key ).set({
                pos:'1', numero:senhamanual, ativo:'true',tipo:value.nome,data:getDate(userDateTimeFull),user_id:user_id,
              }, function(error) {
                  $scope.texto={};
                  if(error){
                    $scope.texto.titulo ='Ops! Algo deu errado.';
                    $scope.texto.mensagem ='Operaçao não efetuada.';
                    $scope.hideLoading();
                    $scope.showAlert($scope.texto);
                  }else
                  {
                    $scope.texto.titulo ='Tudo Certo';
                    $scope.texto.mensagem ='Sua senha é '+ senhamanual;
                    estab = user.displayName;
                    estab = estab || user.email;
                    if(user_id != '' && user_id !=null){
                      sendNotificationTouUserNewNumber(user_id,estab);
                    }
                    $scope.hideLoading();
                    $scope.showAlert($scope.texto);
                  }
              });
            }
          });

        }

      }else{
        $scope.texto={};
        $scope.texto.titulo ='Ops! Algo deu errado.';
        $scope.texto.mensagem ='O valor do campo manual não pode ficar vazio.';
        $scope.hideLoading();
        $scope.showAlert($scope.texto);
      }
  }
}])

.controller('configuraEsCtrl', ['$scope','$ionicSideMenuDelegate', '$stateParams','$location','$ionicLoading','$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$ionicSideMenuDelegate, $stateParams,$location,$ionicLoading,$timeout) {
  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;

  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });
  userLoggedOn = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 15000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.titulo ='';
  $scope.$on('$ionicView.leave', function(){
      //$ionicSideMenuDelegate.canDragContent(true);
      //$('.ion-navicon').show();
    });
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    $scope.showContent= false;

    $timeout(function () {
      $scope.showContent= true;
    }, 2500);
    $scope.showLoading();
    var lojasAux = {};
    $scope.lojas =[];
    $scope.noticket = false;
    $scope.countLine = 0;
    //firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;
      $scope.datauser = user;

      if (user){
        $scope.countLine++;
        //console.log('contador da linha 1525 é :'+$scope.countLine);
        $timeout(function() {

          firebase.database().ref().child('users').child(user.uid).once("value", function(snapshotuser){

            $scope.datauser = snapshotuser.val();
            //console.log($scope.datauser);
            if($scope.datauser.role == 2)
            {
              $scope.titulo ='Minha Fila';
              firebase.database().ref().child('geo_filas_senhas_usadas').child(user.uid).limitToLast(1).on("child_added", function(snapshot) {
                if(snapshot.val() != null ){
                  $scope.senha=snapshot.val();
                  $scope.hideLoading();
                    $scope.noticket = false;
                }else{
                  $scope.noticket = true;
                  $scope.hideLoading();
                }
              },function(error) {
                $scope.hideLoading();
              });
              $scope.senhasAnterioresAux=[]
              var ref = firebase.database().ref().child('geo_filas_senhas_usadas').child(user.uid);

              $scope.senhasAnteriores=[];
              ref.orderByKey().limitToLast(10).on("child_added", function(snapshot) {
                if(snapshot.val() != null ){

                    $scope.senhasAnteriores.unshift(snapshot.val());

                  //countRef++;

                }
              },function(error) {
                $scope.hideLoading();
              });
              $('#filtro').val(' ');
            }else
            {
              $scope.titulo ='Favoritos';
              $scope.hasLojas='S';

              firebase.database().ref().child('usuarios_favoritos').child(user.uid).once("value", function(snapshot) {
                var lojasAux = {};

                if(snapshot.val() != null ){
                  $scope.lojas =[];
                  lojasAux.segue='S';
                  $.each(snapshot.val(), function (key, val) {
                    $scope.hasLojas='S';
                    firebase.database().ref().child('users').child(key).once("value", function(snapshot2) {
                      if(snapshot2.val() != null){
                          lojasAux = snapshot2.val();
                           lojasAux.key = key;
                           lojasAux.segue='S';
                           lojasAux.categoriaNome= returnCategoria(snapshot2.val().categoria);
                           //console.log(snapshot2.val());
                          $scope.lojas.push(lojasAux);
                          $timeout(function(){
                            $('#filtro2').val('');
                              $scope.hideLoading();
                            //console.log('her34');
                          },1000);

                          //console.log($scope.lojas);
                      }else{

                        lojasAux.segue='N';
                        $scope.hasLojas='N';
                      }
                    },function(error) {
                      $scope.hideLoading();
                    });

                  });
                  //console.log(snapshot.val());
                  //$scope.lojas=snapshot.val();
                  $scope.hideLoading();
                }else{
                    $scope.hasLojas='N';
                    $scope.hideLoading();
                }
              }, function(error) {
                  $scope.hideLoading();
              });
            }

          }, function(error) {
            //console.log('error aqui');
            $scope.hideLoading();
          });

          //$scope.hideLoading();
        },2500);
          //$scope.showLoading();

      } else {
          $scope.hideLoading();
          $location.path('/page5')

      }

    //});

  });

  $scope.seguirEstabelecimento=function(id)
  {
    $scope.showLoading();
    $scope.lojaId = id;

    user = firebase.auth().currentUser;
    //console.log($scope.lojaId);
    $scope.countLine=0;
  //  firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;
        //console.log('contador da linha 1615 é :'+$scope.countLine);
        //console.log();
        firebase.database().ref().child('lojas_seguidores').child($scope.lojaId).orderByValue().equalTo(user.uid).once("value", function(snapshot) {
          if(snapshot.val() != null){
            $.each(snapshot.val(), function (key, val) {
                firebase.database().ref('lojas_seguidores/'+$scope.lojaId+'/'+key).remove();
                firebase.database().ref('usuarios_favoritos').child(user.uid).child($scope.lojaId).remove();
                $('#seguir'+id).removeClass('segueS');
                $('#seguir'+id).removeClass('segueN');
                $('#seguir'+id).addClass('segueN');
            });
            $scope.hideLoading();
          }else{
            $('#seguir'+id).removeClass('segueN');
            $('#seguir'+id).removeClass('segueS');
            $('#seguir'+id).addClass('segueS');
            firebase.database().ref().child('lojas_seguidores').child($scope.lojaId).push(user.uid);
            firebase.database().ref().child('usuarios_favoritos').child(user.uid).child($scope.lojaId).push($scope.lojaId);
            $scope.hideLoading();
          }
          //console.log(snapshot.key);
        });

      }

      //$scope.hideLoading();
    //});

  }
   $scope.moredata = false;

   $scope.loadMoreData=function()
   {

      if(typeof $scope.senhasAnterioresAux[0] != "undefined")
      {

        $scope.senhasAnteriores.push($scope.senhasAnterioresAux[0]);
        $scope.senhasAnterioresAux.shift();

        $scope.$broadcast('scroll.infiniteScrollComplete');
      }else{

         $timeout(function() {
           $scope.$broadcast('scroll.infiniteScrollComplete');
           $scope.moredata=true;
         },3000);
      }


   };

  /*$scope.clicarCorpo = function()
  {
    //console.log('aqui');
    if($('.tabs').is(":visible")){
      $scope.esconder();
    }else{
      $scope.mostrar();
    }
  }*/
  $scope.mostrar = function()
  {
    $('.nav-bar-container').fadeIn(1000);
    $('.tabs').fadeIn(1000);
  }
  $scope.esconder = function()
  {
    $('.nav-bar-container').fadeOut(1000);
    $('.tabs').fadeOut(1000);
  }



//alert();
}])

.controller('menuCtrl', ['$scope','$ionicSideMenuDelegate', '$stateParams','$ionicLoading','$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$ionicSideMenuDelegate, $stateParams,$ionicLoading,$timeout) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //viewData.enableBack = true;
    firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;
      $scope.user = firebase.auth().currentUser;

      firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
        $scope.datauser = snapshot.val();
        //console.log(snapshot.val());
      });
    });
  });

  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 3000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.logoff = function() {

    firebase.auth().signOut().then(function() {
      // Sign-out successful.

    }, function(error) {
      // An error happened.
    });
    //$timeout(function() {
      //  document.location.href = '#/page5';
    //},3000);


  }
}])


.controller('loginCtrl', ['$scope','$timeout','$location','$cordovaOauth', '$stateParams','$ionicLoading','$ionicHistory','$timeout','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$timeout,$location,$cordovaOauth, $stateParams,$ionicLoading,$ionicHistory,$timeout,$ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(false);
    $scope.showLoading = function() {
      $ionicLoading.show({
        template: 'Carregando...',
        duration: 6000
      }).then(function(){
         //console.log("The loading indicator is now displayed");
      });
    };
    $scope.hideLoading = function(){
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });
    };
    /*$scope.ionicGoBack = function() {
      $ionicHistory.goBack();
    };*/

    var user = firebase.auth().currentUser;
    $scope.$on('$ionicView.enter', function(){
      $ionicSideMenuDelegate.canDragContent(false);
      $('.ion-navicon').hide();
    });
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {

      viewData.enableBack = false;
      $scope.notToShow = false;
      $scope.showContent = false;
      $timeout(function () {
        $scope.showContent = true;
      }, 6000);
      //$scope.showLoading();
      user = firebase.auth().currentUser;

      //console.log(user);
      $scope.countLine=0;
      firebase.auth().onAuthStateChanged(function(user) {
        //alert('passou1');
        $scope.showLoading();
          if(user){

              $scope.countLine++;

              $scope.user = firebase.auth().currentUser;
              firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
                //console.log('aqui2');
                $scope.datauser = snapshot.val();
                //$location.path('#/page1/page3');;
                document.location.href = '#/page1/page3';
              }, function(error) {
                //document.location.href = '#/page1/page3';
              });


          }

      });
    });

}])
.controller('login2Ctrl', ['$scope','$location','$cordovaOauth', '$stateParams','$ionicLoading','$ionicHistory','$timeout','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$location,$cordovaOauth, $stateParams,$ionicLoading,$ionicHistory,$timeout,$ionicSideMenuDelegate) {
$ionicSideMenuDelegate.canDragContent(false);
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 3000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };

  var user = firebase.auth().currentUser;
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
    $('.ion-navicon').hide();
  });



  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {

    viewData.enableBack = true;
    $scope.notToShow = false;
    //$scope.showLoading();
    user = firebase.auth().currentUser;

    //console.log(user);
    $scope.countLine=0;
    firebase.auth().onAuthStateChanged(function(user) {
      //alert('passou1');

        if(user){

            $scope.countLine++;

            $scope.user = firebase.auth().currentUser;
            firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
            //  //console.log('aqui2');
              $scope.datauser = snapshot.val();
              //$location.path('#/page1/page3');;
              document.location.href = '#/page1/page3';
            }, function(error) {
              //document.location.href = '#/page1/page3';
            });


        }

    });
  });


    $scope.loginTwitter = function(user) {
      $scope.showLoading();
      $('.aviso-login').html('');
      var provider = new firebase.auth.TwitterAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
            // You can use these server side with your app's credentials to access the Twitter API.
            var token = result.credential.accessToken;
            var secret = result.credential.secret;
            // The signed-in user info.
            var user = result.user;

            document.location.href = '#/page1/page3';
            // ...
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            $('.divAvisoLogin').show();
            $('.aviso-login').html('Ops, não encontramos o seu cadastro.');
          });
        $timeout(function() {
          firebase.auth().onAuthStateChanged(function(user) {
            user = firebase.auth().currentUser;
            $scope.user = firebase.auth().currentUser;
            firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
              //console.log(snapshot.val());
            });
            document.location.href = '#/page1/page3';
          });
        },1000);

    }

    $scope.loginGoogle = function(user) {
      $scope.showLoading();
      $('.aviso-login').html('');

      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          //console.log(user);
          document.location.href = '#/page1/page3';
          // ...
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          $('.divAvisoLogin').show();
          $('.aviso-login').html('Ops, não encontramos o seu cadastro.');
          // ...
        });
        $timeout(function() {
          firebase.auth().onAuthStateChanged(function(user) {
            user = firebase.auth().currentUser;
            $scope.user = firebase.auth().currentUser;
          //  //console.log(user);

            document.location.href = '#/page1/page3';
          });
        },1000);
    }
    $scope.esqueciasenha = function(user) {
        $scope.showLoading();
        $('.divAvisoLogin').hide();
        if (typeof user == 'undefined') {
          $('.aviso-login').html('Ops. Digite o email');
          $('.divAvisoLogin').show();
        }else if(user.email == '' || user.email == null){
          $('.aviso-login').html('Ops. Digite o email');
          $('.divAvisoLogin').show();
        }else{
          var auth = firebase.auth();


          auth.sendPasswordResetEmail(user.email).then(function() {
            $('.aviso-login').html('Tudo certo! Um e-mail foi enviado para a redeficição da sua senha.');
            $('.divAvisoLogin').show();
          }, function(error) {
            $('.aviso-login').html('Ops! Ocorreu um erro e não conseguimos continuar com a redefinição da sua senha.');
            $('.divAvisoLogin').show();
          });
        }


    }
    $scope.loginManual = function(user) {
      $scope.showLoading();
      $('.divAvisoLogin').hide();
      if(typeof user == 'undefined'){
        $('.aviso-login').html('Ops. Digite o Email e Senha');
        $('.divAvisoLogin').show();
      }else{
      //  //console.log(user);
        firebase.auth().signInWithEmailAndPassword(user.email, user.password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          //console.log(errorCode.length);
          if(errorCode.length == 19){
              $('.divAvisoLogin').show();
              $('.aviso-login').html('Algo deu errado, verifique seu email e senha.');
          }else if (errorCode.length == 27) {
            $('.divAvisoLogin').show();
            $('.aviso-login').html('Sem conexão com a internet.');
          }

        });
        $timeout(function() {
          firebase.auth().onAuthStateChanged(function(user) {
            user = firebase.auth().currentUser;
            $scope.user = firebase.auth().currentUser;
            firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
              //console.log(snapshot.val());
              document.location.href = '#/page1/page3';
            });

          });
        },1000);
      }
    }
    $scope.loginFacebook = function(user) {
      $('.divAvisoLogin').hide();
      var auth = new firebase.auth.FacebookAuthProvider();
     $cordovaOauth.facebook("111991969424960", ["email"]).then(function(result) {

         var credential = firebase.auth.FacebookAuthProvider.credential(result.access_token);
         firebase.auth().signInWithCredential(credential).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              if (errorCode === 'auth/account-exists-with-different-credential') {
                //alert('Email já está associado com uma outra conta.');
                $('.divAvisoLogin').show();
                $('.aviso-login').html('Email já está associado com uma outra conta.');
                // Handle account linking here, if using.
              } else {
                console.error(error);
              }


         });
         user = firebase.auth().currentUser;
         firebase.auth().onAuthStateChanged(function(user) {
           $scope.showLoading();
           user = firebase.auth().currentUser;
           $scope.user = firebase.auth().currentUser;
           $timeout(function() {

             firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
                if(snapshot.val() != null){
                    document.location.href = '#/page1/page3';
                }else{
                  $('.divAvisoLogin').show();
                  $('.aviso-login').html('Algo deu errado, esta conta ainda não possui cadastro.');

                  var user = firebase.auth().currentUser;
                  user.delete().then(function() {
                    // User deleted.
                  }, function(error) {
                    // An error happened.
                  });
                }
             },function(error){
               $scope.hideLoading();
               $('.divAvisoLogin').show();
               $('.aviso-login').html('Algo deu errado, por favor verifique a sua conexão com a internet.');
             });

           },5000);


         });

     }, function(error) {
         //alert("ERROR: " + error);
     });


    }
}])

.controller('cadastrarfilasCtrl', ['$scope','$ionicSideMenuDelegate', '$ionicPopup', '$stateParams', '$ionicHistory', '$location','$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $ionicSideMenuDelegate,$ionicPopup, $stateParams,$ionicHistory, $location, $ionicLoading) {

  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $scope.conectDiv=true;
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });

  userLoggedOn = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.retornaNome = function(num) {
    switch (num) {
      case 1:
        return 'Comum';
        break;
        case 2:
          return 'Prioritária';
          break;
          case 3:
            return 'Manual';
            break;
      default:

    }
  }
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      //duration: 3000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };

  var user = firebase.auth().currentUser;
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {

    viewData.enableBack = true;
    $scope.notToShow = false;
    //$scope.conectDiv=true;
    $scope.showLoading();
    firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
      $scope.datauser = snapshot.val();
      //console.log(snapshot.val());
      if($scope.datauser.role ==2){
        firebase.database().ref().child('geo_filas').child(user.uid).child($stateParams.id).on("value", function(snapshot) {
          if(snapshot.val() != null ){
            $scope.fila = snapshot.val();
            //console.log($scope.fila);
          }
          $scope.hideLoading();
        },function(error) {
          $scope.hideLoading();
        });
      }else {
        $scope.hideLoading();
      }
    },function (error) {
      $scope.hideLoading();
    });

  });
  //console.log($stateParams.id);



  $scope.pos={};
  $scope.pos.lat=0;
  $scope.pos.lon=0;
  $scope.post={};
  $scope.imageUrl='';

  var onSuccessPos = function(position) {
      $scope.pos.lat = position.coords.latitude;
      $scope.pos.lon= position.coords.longitude;
      //console.log($scope.pos.lon);
  };

    // onError Callback receives a PositionError object
  function onErrorPos(error) {
      $scope.posErro=error;
      calldialog();
  }

  navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});


  //$scope.fila.user_id ='';
  $scope.fila = [];
  if (user) {
    // User is signed in.
    //alert('1');
    //console.log(user);
    $scope.fila.user_id = user.uid;
  } else {
      $location.path('/page5')

  }

  var firebaseRef = firebase.database().ref().child('geo_filas');
  var geoFire = new GeoFire(firebaseRef);
  var ref = geoFire.ref();  // ref === firebaseRef
  //var mykey = ref.child('dados').push();
  //console.log(user.uid);
  var user = firebase.auth().currentUser
  //$scope.showConfirm();
  // An alert dialog
  $scope.showAlert = function(texto) {
    var alertPopup = $ionicPopup.alert({
      title: texto.titulo,
      template: texto.mensagem
    });
    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
      $location.path('/page2');
    });
  };

  $scope.cadastrarFila = function(fila) {
    var user = firebase.auth().currentUser
    var nome = fila.nome || null;
    var ativa = fila.ativa || false;
    var prioridade = fila.prioridade || false;
    var prioridade_qtd = fila.qtd_prioridade || 0;
    var manual = fila.manual || false;
    var numero_contador = fila.numero_contador || 0;
    var prefixo = fila.prefixo || '';
    $scope.texto= {};
    //console.log(nome);
    if(nome == null || nome == 'undefined' )
    {
      $scope.texto.titulo ='Ops! Algo deu errado.';
      $scope.texto.mensagem ='O nome não poder estar vazio.';
      $scope.showAlert($scope.texto);
    }else{
      firebase.database().ref('geo_filas/' + user.uid + '/' + $stateParams.id).set({
        nome: nome,
        ativa:ativa,
        prioridade:prioridade,
        prioridade_qtd:prioridade_qtd,
        manual:manual,
        numero_contador:numero_contador,
        prefixo:prefixo,
      }, function(error) {
          if(error){
            $scope.texto.titulo ='Ops! Foi mal!';
            $scope.texto.mensagem ='Não conseguimos desta vez.';
            $scope.showAlert($scope.texto);
          }else
          {
            $scope.texto.titulo ='Tudo certo!';
            $scope.texto.mensagem ='A configuração foi salva.';
            $scope.showAlert($scope.texto);
          }
      });
    }



  }


}])

.controller('signupCtrl', ['$scope','$cordovaOauth','$location','$firebaseObject','$firebaseAuth', '$stateParams','$ionicPopup','$ionicLoading','$timeout','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$cordovaOauth ,$location, $firebaseObject,$firebaseAuth,$stateParams,$ionicPopup,$ionicLoading,$timeout,$ionicSideMenuDelegate) {
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
    $('.ion-navicon').hide();
    user = firebase.auth().currentUser;
    //alert('passou1');
    firebase.auth().onAuthStateChanged(function(user) {
      if(user){
        //  document.location.href = '#/page1/page3';
      }
    });
  });
  $scope.$on('$ionicView.leave', function(){
      //$ionicSideMenuDelegate.canDragContent(true);
      //$('.ion-navicon').show();
    });
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
      if(user){
        $scope.showLoading();
        $timeout(function () {
          $scope.showLoading();
          //$location.path('#/page1/page3');;
          document.location.href = '#/page1/page3';
        }, 3000);
      }

    });
  });
  $scope.loginNormal = function (e) {
    $scope.user= e;
    ref.authWithPassword({
      email    : $scope.user.email,
      password : $scope.user.password
    }, function(error, authData) {
      if (error) {

      } else {
        //$location.path('#/page1/page3');;
        document.location.href = '#/page1/page3';

      //  window.location.href = '#/home';
      }
    });
  }

  $scope.showPopup = function(texto) {
    var alertPopup = $ionicPopup.alert({
     title: texto.titulo,
     template: texto.mensagem
   });

  };
  $scope.validaEmail= function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //$('.aviso-cadastro').hide();
    if(re.test(email)){
      $('.divAvisoEmail').hide();
      $('.lb-email ').removeClass('myredcolor');
      return true;
    }else {
      $('.divAvisoEmail').show();
      $('.lb-email ').addClass('myredcolor');
      return false;
    }
  }

  $scope.difpassword = function(user)
  {
    $('.aviso-cadastro').html('');
    if(typeof user !=='undefined')
    {
      if (user.password != user.cpassword && (user.password != '' && user.cpassword != '') ) {
          $('.lb-password ').addClass('myredcolor');
          $('.divAviso').show();
          return false;
      }else{
        $('.lb-password ').removeClass('myredcolor');
        $('.divAviso').hide();
        return true;
      }
    }else {
      $('.lb-password ').removeClass('myredcolor');
      $('.divAviso').hide();
      return true;
    }
  }
  $scope.validaCadastro = function(user) {
    $('.aviso-cadastro').html('');
    if(user.email == null || user.email == ''){
      $scope.texto.titulo='Ops! Algo deu errado.';
      $scope.texto.mensagem='O campo email não pode ficar vazio.';
      return false;
    }else{
      return true;
    }

  }
  $scope.validaFormulario = function(user)
  {
    $('.aviso-cadastro').html('');
    var flagValid=true;
    if($scope.difpassword(user)== false){
      flagValid= false;
    }
    if(!$scope.validaEmail(user.email)){
      flagValid= false;
    }
    if($scope.validaCadastro(user)== false){
      flagValid= false;
    }
    return flagValid;
  }
  function logUser(user)
  {
      var ref = firebase.database().ref("users");
    //  //console.log(user);
      var obj = {
          "user": user
      };
      ref.push(obj); // or however you wish to update the node

  }

  $scope.pos={};
  $scope.pos.lat=0;
  $scope.pos.lon=0;
  $scope.post={};
  $scope.imageUrl='';
  var onSuccessPos = function(position) {
      $scope.pos.lat = position.coords.latitude;
      $scope.pos.lon= position.coords.longitude;

      //console.log($scope.pos.lon);
  };

  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 3000
    }).then(function(){
      // //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
      // //console.log("The loading indicator is now hidden");
    });
  };
  $scope.showAlert = function(texto) {
    var alertPopup = $ionicPopup.alert({
      title: texto.titulo,
      template: texto.mensagem
    });
    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
      //$location.path('/page1/page10');
    });
  };

  function onErrorPos(error) {
      $scope.posErro=error;
      calldialog();
  }

  navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

  $scope.cadastrarUsuarioCliente = function(user) {
    $scope.showLoading();
    $('.aviso-cadastro').html('');

    if(typeof user != 'undefined')
    {
      //console.log('aqui');

      if($scope.validaCadastro(user)){
        if($scope.validaFormulario(user)){

          firebase.auth().createUserWithEmailAndPassword(user.email, user.password).catch(function(error) {
            // Handle Errors here.

            var errorCode = error.code;
            var errorMessage = error.message;
            var errorWeek ='auth/weak-password';
            $('.lb-email ').removeClass('myredcolor');
          //  //console.log('aqui1');
            if(errorCode.length == 18){
              $('.aviso-cadastro').html('Ops, a senha deve ter pelo menos 6 caracteres!');
              $('.divAvisoCadastro').show();
            }else if(errorCode.length == 25){
              $('.lb-email ').addClass('myredcolor');
              $('.aviso-cadastro').html('Ops, este email já se encontra em uso.');
              $('.divAvisoCadastro').show();
            }else if (errorCode.length == 27) {
              $('.divAvisoCadastro').show();
              $('.aviso-cadastro').html('Sem conexão com a internet.');
            }
            // ...
          });
          $scope.cadastrarManualCliente=1;
          firebase.auth().onAuthStateChanged(function(user) {
            if($scope.cadastrarManualCliente == 1){
              user = firebase.auth().currentUser;

                $scope.user = firebase.auth().currentUser;
                //console.log($scope.user);
                firebase.database().ref('users/' + user.uid).remove();

                firebase.database().ref('users/' + user.uid).set({
                  email: user.email,
                  active:1,
                  role:3,
                  ver_fila:true,
                  nome:user.displayName,
                  email:user.email,
                  foto:user.photoURL,
                  raio:50,
                }, function(error) {
                  if(error){
                    //console.log('erro');
                  }else{
                  }
                });
                $scope.cadastrarManualCliente=0;
                $timeout(function() {
                  //$location.path('#/page1/page3');;
                  document.location.href = '#/page1/page3';
                },1000);
            }

          });



            //});

        }
      }
    }else{
      $('.aviso-cadastro').html('Ops, digite o usuário e a senha!');
      $('.divAvisoCadastro').show();
      //console.log('aqui2');
    }
    //console.log(user);
  }
  $scope.cadastrarUsuarioFacebookCliente = function(user) {
    var auth = new firebase.auth.FacebookAuthProvider();
    $('.divAvisoCadastro').hide();
   $cordovaOauth.facebook("111991969424960", ["email"]).then(function(result) {

       var credential = firebase.auth.FacebookAuthProvider.credential(result.access_token);
       firebase.auth().signInWithCredential(credential).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            if (errorCode === 'auth/account-exists-with-different-credential') {
              //alert('Email already associated with another account.');
              // Handle account linking here, if using.
              $('.divAvisoCadastro').show();
              $('.divAvisoCadastro').html('Email já está associado com uma outra conta.');
            } else {
              console.error(error);
            }



       });


   }, function(error) {
       //alert("ERROR: " + error);
   });
   user = firebase.auth().currentUser;
   //alert('passou1');
   $scope.cadastraUsuarioFacebookFlag= 1;
   firebase.auth().onAuthStateChanged(function(user) {
     //alert('passou2');
     if($scope.cadastraUsuarioFacebookFlag == 1){
       firebase.database().ref().child('users').child(user.uid).child('email').once("value", function(snapshot) {
           //console.log(snapshot.val());
         if(snapshot.val() != null && snapshot.val() != 'null' ){
           //$location.path('#/page1/page3');;
           document.location.href = '#/page1/page3';
         }else{
           //console.log('aqui2');
           firebase.database().ref('users/' + user.uid).remove();

           firebase.database().ref('users/' + user.uid).set({
             email: user.email,
             active:1,
             role:3,
             ver_fila:true,
             nome:user.displayName,
             email:user.email,
             foto:user.photoURL,
             raio:50,
           }, function(error) {
             //$location.path('#/page1/page3');;
             document.location.href = '#/page1/page3';
           });

         }
       });
       $scope.cadastraUsuarioFacebookFlag=0;
     }

   });


  }





}])
.controller('minhacontaCtrl', ['$scope','$location','$ionicSideMenuDelegate', '$stateParams','$ionicHistory','$ionicLoading','$ionicPopup','$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$location,$ionicSideMenuDelegate, $stateParams,$ionicHistory,$ionicLoading,$ionicPopup,$timeout) {
  userLoggedOn = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  var connectedRef = firebase.database().ref(".info/connected");
  $scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {

    viewData.enableBack = true;
    $scope.notToShow = false;
    $scope.showLoadingNoTime();

    $scope.countLine=0;
    user = firebase.auth().currentUser;
    //firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;

        ///$scope.showLoading();
        $scope.user = firebase.auth().currentUser;
        //console.log($scope.user);
        //$scope.showLoading();
        firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
          $scope.datauser = snapshot.val();
          //console.log(snapshot.val());
        });

        firebase.database().ref().child('geo_lojas').child(user.uid).child('dados').once("value", function(snapshot) {
          $scope.dataLojas = snapshot.val();
          //console.log(snapshot.val());
        });

      }
      $('.numeric').keyup(function () {
          this.value = this.value.replace(/[^0-9\.]/g,'');
      });
    //});
    $scope.categorias = '';
    $scope.optCategorias=[];
    $scope.pos={};
    $scope.pos.lat=0;
    $scope.pos.lon=0;
    $scope.post={};
    $scope.imageUrl='';

    var onSuccessPos = function(position) {
        $scope.pos.lat = position.coords.latitude;
        $scope.pos.lon= position.coords.longitude;

        //console.log($scope.pos.lon);
    };
    function onErrorPos(error) {
        $scope.posErro=error;
        calldialog();
    }
    $scope.optCategorias=[];
    navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

    firebase.database().ref().child('categorias').on("value", function(snapshot) {
      //$scope.showLoading();
      if(snapshot.val() != null ){
        $scope.categorias = snapshot.val();
        $scope.optCategorias=[] ;
        angular.forEach($scope.categorias, function(value, key) {
            $scope.optCategorias.push({
                chave: key,
                valor: value
            });
        });


      $timeout(function () {
        if(typeof $scope.datauser != 'undefined'){
          $('#categoria').val($scope.datauser.categoria);
          $('#categoria').trigger('change');
          }
          $scope.hideLoading();
        },3000);
      }
    },function(error) {
        $scope.hideLoading();
    });
  });
  $scope.getImage = function (source) {
      //alert('passou1');
      // Retrieve image file location from specified source
      $('#configForm').submit(function(event) {
        event.preventDefault();
      });
      $scope.showImage=false;
      var options = {
          maximumImagesCount: 1,
          quality: 50
      };
      $scope.showLoading();
      window.imagePicker.getPictures(
        function(results) {

          //alert('passou2');
            for (var i = 0; i < results.length; i++) {

                //getFileEntry(results[i]);

                var imageData = results[i];
                var filename = imageData.split("/").pop();
                var storageRef = firebase.storage().ref();

                var getFileBlob = function(url, cb) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url);
                    xhr.responseType = "blob";
                    xhr.addEventListener('load', function() {
                        cb(xhr.response);
                    });
                    xhr.send();
                };

                var blobToFile = function(blob, name) {
                    blob.lastModifiedDate = new Date();
                    blob.name = name;
                    return blob;
                };

                var getFileObject = function(filePathOrUrl, cb) {
                    getFileBlob(filePathOrUrl, function(blob) {
                        cb(blobToFile(blob, 'test.jpg'));
                    });
                };

                getFileObject(imageData, function(fileObject) {
                    var uploadTask = storageRef.child('images/'+user.uid+'.jpg').put(fileObject);

                    uploadTask.on('state_changed', function(snapshot) {
                        //alert(snapshot);
                    }, function(error) {
                        //alert(error);
                    }, function() {
                        var downloadURL = uploadTask.snapshot.downloadURL;
                        $scope.datauser.foto = downloadURL;
                        firebase.database().ref('users/' + user.uid).set($scope.datauser, function(error) {
                          $scope.texto  ={};
                          $scope.hideLoading();
                          if(error){
                            $scope.texto.titulo ='Ops! Algo deu errado.';
                            $scope.texto.mensagem ='Não conseguimos salvar a configuração.';
                            $scope.showAlert($scope.texto);
                          }else{
                            $scope.texto.titulo ='Tudo Certo!';
                            $scope.texto.mensagem ='Sua configuração foi salva!';
                            $scope.showAlert($scope.texto);
                          }
                        });
                        //alert(downloadURL);
                        // handle image here
                    });
                });
                $timeout(function(){
                  $scope.hideLoading();
                },2000);
            }
        }, function (error) {
            $scope.showImage=false;
            alert('Error: ' + error);
            $timeout(function(){
              $scope.hideLoading();
            },2000);
        },
        options
      );
      $timeout(function(){
        $scope.hideLoading();
      },2000);


   }

  $scope.editarUsuario = function(userData) {
    //console.log(userData);
    user = firebase.auth().currentUser;
    $scope.user = firebase.auth().currentUser;
    //navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {enableHighAccuracy:true});
    $scope.showLoading();
    cat = $("#categoria").val();
    desc = $("#descricao").val();
    nome = $("#nome").val();
    limite = $("#limite").val();
    ver_fila = $("#ver_fila").val();
    rudovip  = $("#rudovip").val();
    desconto  = $("#desconto").val();
    porcentagem  = $("#porcentagem").val();
    condicoes = $("#condicoes").val();
    endereco = $("#endereco").val();
    bairro  = $("#bairro").val();
    cidade =  $("#cidade").val();
    uf = $("#uf").val();
    telefone1 = $("#telefone1").val();
    telefone2 = $("#telefone2").val();

    if($('#ver_fila').hasClass('ng-empty'))
    {
        ver_fila = false;
    }else{
        ver_fila = true;
    }
    if($('#rudovip').hasClass('ng-empty'))
    {
        rudovip = false;
    }else{
        rudovip = true;
    }
    if($('#desconto').hasClass('ng-empty'))
    {
        desconto = false;
    }else{
        desconto = true;
    }

    cat = cat || null;
    desc = desc || null;
    limite = limite || null;
    $scope.datauser2 =[];
    $scope.datauser2.nome = nome || null;

    porcentagem  = porcentagem || null;

    condicoes = condicoes || null;

    if(user.displayName != null && user.displayName !='' && typeof user.displayName!= 'undefined')
    {
        $scope.datauser2.nome = user.displayName;
        //console.log('aqui1');
    }

    $scope.datauser2.foto ='';
    if(user.photoURL != null && user.photoURL !=''  && typeof user.photoURL!= 'undefined')
    {
        $scope.datauser2.foto = user.photoURL;
    }else if($scope.datauser.foto != null && $scope.datauser.foto !=''  && typeof $scope.datauser.foto!= 'undefined'){
        $scope.datauser2.foto = $scope.datauser.foto;
    }else{
      $scope.datauser2.foto = null;
    }
    //user.displayName=nome;
    //user.photoURL= foto;
    //nome = user.displayName;
    //console.log(ver_fila);

    ver_fila = ver_fila || null;
    rudovip  = rudovip || null;
    desconto  = desconto || null;
    endereco  = endereco || null;
    bairro = bairro || null;
    cidade = cidade || null;
    uf = uf || null;
    telefone1 = telefone1 || null;
    telefone2 = telefone2 || null;
    //firebase.auth().onAuthStateChanged(function(user) {
      //console.log($scope.datauser.categoria);
      //console.log(user.uid);
      //if(typeof $scope.datauser.categoria !='undefined'){
      if(typeof user.uid != 'undefined'){
          firebase.database().ref('geo_lojas_cat').child(0).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(1).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(2).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(3).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(4).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(5).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(6).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(7).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(8).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(9).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(10).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(11).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(12).child(user.uid).remove();
      }
      //}
      firebase.database().ref('users/' + user.uid).set({
        email: user.email,
        active:1,
        role:2,
        limit:limite,
        nome:$scope.datauser2.nome,
        foto:$scope.datauser2.foto,
        descricao:desc,
        categoria:cat,
        raio:50,
        ver_fila:ver_fila,
        rudovip:rudovip,
        desconto:desconto,
        porcentagem:porcentagem,
        condicoes:condicoes,
        endereco:endereco,
        bairro:bairro,
        cidade:cidade,
        uf:uf,
        telefone1:telefone1,
        telefone2:telefone2,
      }, function(error) {
        if(error){
          $scope.texto={};
            $scope.texto.titulo ='Ops! Algo deu errado.';
            $scope.texto.mensagem ='Ops, o perfil não foi atualizado.';
            $scope.hideLoading();
            $scope.showPopup($scope.texto);
        }else{
          firebase.database().ref().child('geo_lojas').child(cat).remove();

          var firebaseRef = firebase.database().ref().child('geo_lojas_cat').child(cat);
          var geoFire = new GeoFire(firebaseRef);
          var ref = geoFire.ref();  // ref === firebaseRef
          var mykey = ref.child('lojas').push();

          geoFire.set(user.uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
            //console.log("Provided key has been added to GeoFire");
            firebase.database().ref('geo_lojas_cat/'+cat+'/'+ user.uid+'/dados').set({
              endereco:'-',
              telefone:'-',
              nome:$scope.datauser2.nome,
              email:user.email,
              foto:$scope.datauser2.foto,
              raio:50,
              rudovip:rudovip,
              desconto:desconto,
              porcentagem:porcentagem,
              condicoes:condicoes,
              endereco:endereco,
              bairro:bairro,
              cidade:cidade,
              uf:uf,
              telefone1:telefone1,
              telefone2:telefone2,
            }, function(error) {

            });
            if(($scope.pos.lat != '' && $scope.pos.lat != null) && ($scope.pos.lon != '' && $scope.pos.lon != null ) ){
              firebase.database().ref('geo_lojas/'+ user.uid+'/l').set({
                0:$scope.pos.lat, 1:$scope.pos.lon
              }, function(error) {

              });
            }

          }, function(error) {
            //console.log("Error: " + error);
          });

          $scope.texto={};
            $scope.texto.titulo ='Tudo Certo';
            $scope.texto.mensagem ='Seu perfil foi atualizado.';
            $scope.hideLoading();
            $scope.showPopup($scope.texto);
        }
      });



    //});


  }
  $scope.showPopup = function(texto) {
    var alertPopup = $ionicPopup.alert({
     title: texto.titulo,
     template: texto.mensagem
   });

  };
  $scope.showLoadingNoTime = function() {
    $ionicLoading.show({
      template: 'Carregando...',

    }).then(function(){
      // //console.log("The loading indicator is now displayed");
    });
  };
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 3000
    }).then(function(){
      // //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
      // //console.log("The loading indicator is now hidden");
    });
  };
}])

.controller('signuptwoCtrl', ['$scope','$cordovaOauth','$location', '$stateParams','$ionicPopup','$ionicLoading','$timeout','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$cordovaOauth, $location,$stateParams,$ionicPopup,$ionicLoading,$timeout,$ionicSideMenuDelegate) {
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
    $('.ion-navicon').hide();
  });
  $scope.pos={};
  $scope.pos.lat=0;
  $scope.pos.lon=0;
  var onSuccessPos = function(position) {
      $scope.pos.lat = position.coords.latitude;
      $scope.pos.lon= position.coords.longitude;
      //console.log($scope.pos.lon);
  };
  function onErrorPos(error) {
      $scope.posErro=error;
      $scope.pos.lat=0;
      $scope.pos.lon=0;
      calldialog();
  }
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {



    navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

    user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {

      if(user)
      {
        navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {enableHighAccuracy:true});
        $scope.showLoading();
        $timeout(function () {
          $scope.showLoading();
          //$location.path('#/page1/page3');;
          document.location.href = '#/page1/page3';
        }, 3000);
      }

    });
  });
$scope.$on('$ionicView.leave', function(){
    //$ionicSideMenuDelegate.canDragContent(true);
    //$('.ion-navicon').show();
  });
  $scope.loginNormal = function (e) {
    $scope.user= e;
    ref.authWithPassword({
      email    : $scope.user.email,
      password : $scope.user.password
    }, function(error, authData) {
      if (error) {

      } else {
        //$location.path('#/page1/page3');;
        document.location.href = '#/page1/page3';

      //  window.location.href = '#/home';
      }
    });
  }

  $scope.showPopup = function(texto) {
    var alertPopup = $ionicPopup.alert({
     title: texto.titulo,
     template: texto.mensagem
   });

  };
  $scope.validaEmail= function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //$('.aviso-cadastro').hide();
    if(re.test(email)){
      $('.divAvisoEmail').hide();
      $('.lb-email ').removeClass('myredcolor');
      return true;
    }else {
      $('.divAvisoEmail').show();
      $('.lb-email ').addClass('myredcolor');
      return false;
    }
  }

  $scope.difpassword = function(user)
  {
    $('.aviso-cadastro').html('');
    if(typeof user !=='undefined')
    {
      if (user.password != user.cpassword && (user.password != '' && user.cpassword != '') ) {
          $('.lb-password ').addClass('myredcolor');
          $('.divAviso').show();
          return false;
      }else{
        $('.lb-password ').removeClass('myredcolor');
        $('.divAviso').hide();
        return true;
      }
    }else {
      $('.lb-password ').removeClass('myredcolor');
      $('.divAviso').hide();
      return true;
    }
  }
  $scope.validaCadastro = function(user) {
    navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {enableHighAccuracy:true});
    $('.aviso-cadastro').html('');
    if(user.email == null || user.email == ''){
      $scope.texto.titulo='Ops! Algo deu errado.';
      $scope.texto.mensagem='O campo email não pode ficar vazio.';
      return false;
    }else{
      return true;
    }

  }
  $scope.validaFormulario = function(user)
  {
    $('.aviso-cadastro').html('');
    var flagValid=true;
    if($scope.difpassword(user)== false){
      flagValid= false;
    }
    if(!$scope.validaEmail(user.email)){
      flagValid= false;
    }
    if($scope.validaCadastro(user)== false){
      flagValid= false;
    }
    return flagValid;
  }
  function logUser(user)
  {
      var ref = firebase.database().ref("users");
    //  //console.log(user);
      var obj = {
          "user": user
      };
      ref.push(obj); // or however you wish to update the node

  }


  $scope.post={};
  $scope.imageUrl='';
  var onSuccessPos = function(position) {
      $scope.pos.lat = position.coords.latitude;
      $scope.pos.lon= position.coords.longitude;

      //console.log($scope.pos.lon);
  };

  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 3000
    }).then(function(){
      // //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
      // //console.log("The loading indicator is now hidden");
    });
  };
  $scope.showAlert = function(texto) {
    var alertPopup = $ionicPopup.alert({
      title: texto.titulo,
      template: texto.mensagem
    });
    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
      //$location.path('/page1/page10');
    });
  };

  function onErrorPos(error) {
      $scope.posErro=error;
      calldialog();
  }

  navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

  $scope.cadastrarUsuario = function(user) {
    $scope.showLoading();

    $('.aviso-cadastro').html('');

    if(typeof user != 'undefined')
    {
      //console.log('aqui');

      if($scope.validaCadastro(user)){
        if($scope.validaFormulario(user)){
          $scope.showLoading();
          firebase.auth().createUserWithEmailAndPassword(user.email, user.password).catch(function(error) {
            // Handle Errors here.
            $scope.showLoading();
            var errorCode = error.code;
            var errorMessage = error.message;
            var errorWeek ='auth/weak-password';
            $('.lb-email ').removeClass('myredcolor');
          //  //console.log('aqui1');
            if(errorCode.length == 18){
              $('.aviso-cadastro').html('Ops, a senha deve ter pelo menos 6 caracteres!');
              $('.divAvisoCadastro').show();
            }else if(errorCode.length == 25){
              $('.lb-email ').addClass('myredcolor');
              $('.aviso-cadastro').html('Ops, este email já se encontra em uso.');
              $('.divAvisoCadastro').show();
            }else if (errorCode.length == 27) {
              $('.divAvisoCadastro').show();
              $('.aviso-cadastro').html('Sem conexão com a internet.');
            }
            // ...

          });
          //console.log('cadastrou');
          $scope.cadastraUsuarioManualEstabelecimentoflag = 1;


          $timeout(function () {

            firebase.auth().onAuthStateChanged(function(userLoggedOn) {
              var user = firebase.auth().currentUser;
              $scope.user = firebase.auth().currentUser;;
              //console.log('mudou');
              $scope.showLoading();
              if($scope.cadastraUsuarioManualEstabelecimentoflag == 1){
                //console.log('flagou');

                //$scope.user = firebase.auth().currentUser;
                //console.log($scope.user);
                if(user != null){

                  firebase.database().ref('users/' + user.uid).remove();
                  firebase.database().ref('geo_filas/' + user.uid ).remove();
                  var firebaseRef = firebase.database().ref().child('geo_lojas');
                  var geoFire = new GeoFire(firebaseRef);
                  var ref = geoFire.ref();  // ref === firebaseRef
                  var mykey = ref.child('lojas').push();



                  firebase.database().ref('users/' + user.uid).set({
                    email: user.email,
                    active:1,
                    role:2,
                    limit:10000,
                    nome:null,
                    email:user.email,
                    foto:null,
                    raio:50,
                  }, function(error) {
                    if(error){
                      //console.log('erro');
                    }else{
                    }
                  });
                  //console.log('cadastrou1');
                  //console.log('Tudo Certo');

                  $scope.showLoading();

                  //Cadastra Fila Comum
                  //var user = firebase.auth().currentUser
                  firebase.database().ref('limit/' + user.uid).set({
                    limit:10000,
                  }, function(error) {

                  });
                  firebase.database().ref('geo_filas/' + user.uid ).push({
                    nome: 1,
                    ativa:true,
                    prioridade:false,
                    prioridade_qtd:0,
                    manual:false,
                    numero_contador:0,
                    prefixo:'CM-',
                  }, function(error) {
                  });

                  //Cadastra fila Prioritária
                  firebase.database().ref('geo_filas/' + user.uid ).push({
                    nome: 2,
                    ativa:true,
                    prioridade:true,
                    prioridade_qtd:2,
                    manual:false,
                    numero_contador:0,
                    prefixo:'PR-',
                  }, function(error) {
                  });

                  //Cadastra fila Manual
                  firebase.database().ref('geo_filas/' + user.uid ).push({
                    nome: 3,
                    ativa:true,
                    prioridade:false,
                    prioridade_qtd:0,
                    manual:true,
                    numero_contador:0,
                    prefixo:'MN-',
                  }, function(error) {
                  });
                  firebase.database().ref('geo_lojas/' + $scope.user.uid+'/dados').set({

                    endereco:'-',
                    telefone:'-',
                    nome:null,
                    email:user.email,
                    foto:null,
                    raio:50,
                  }, function(error) {

                  });
                  geoFire.set($scope.user.uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
                    //console.log("Provided key has been added to GeoFire");
                    firebase.database().ref('geo_lojas/' + $scope.user.uid+'/dados').set({

                      endereco:'-',
                      telefone:'-',
                      nome:null,
                      email:user.email,
                      foto:null,
                      raio:50,
                    }, function(error) {

                    });
                  }, function(error) {
                    //console.log("Error: " + error);
                  });
                  $timeout(function () {
                    //$location.path('#/page1/page3');;
                    document.location.href = '#/page1/page3';
                  }, 4000);
                  //console.log('cadastrou2');
                  $scope.cadastraUsuarioManualEstabelecimentoflag = 0;
                }else{

                  $timeout(function () {
                    var user = firebase.auth().currentUser;
                    $scope.user = firebase.auth().currentUser;
                    //console.log('cadastrou1');
                    //console.log('Tudo Certo');
                    var firebaseRef = firebase.database().ref().child('geo_lojas');
                    var geoFire = new GeoFire(firebaseRef);
                    var ref = geoFire.ref();  // ref === firebaseRef


                    firebase.database().ref('users/' + user.uid).remove();
                    firebase.database().ref('geo_filas/' + user.uid ).remove();
                    firebase.database().ref('users/' + user.uid).set({
                      email: user.email,
                      active:1,
                      role:2,
                      limit:10000,
                      nome:null,
                      email:user.email,
                      foto:null,
                      raio:50,
                    }, function(error) {
                      if(error){
                        //console.log('erro');
                      }else{
                      }
                    });

                    var mykey = ref.child('lojas').push();
                    $scope.showLoading();
                                        //Cadastra Fila Comum
                    //var user = firebase.auth().currentUser
                    firebase.database().ref('limit/' + user.uid).set({
                      limit:10000,
                    }, function(error) {

                    });
                    firebase.database().ref('geo_filas/' + user.uid ).push({
                      nome: 1,
                      ativa:true,
                      prioridade:false,
                      prioridade_qtd:0,
                      manual:false,
                      numero_contador:0,
                      prefixo:'CM-',
                    }, function(error) {
                    });

                    //Cadastra fila Prioritária
                    firebase.database().ref('geo_filas/' + user.uid ).push({
                      nome: 2,
                      ativa:true,
                      prioridade:true,
                      prioridade_qtd:2,
                      manual:false,
                      numero_contador:0,
                      prefixo:'PR-',
                    }, function(error) {
                    });

                    //Cadastra fila Manual
                    firebase.database().ref('geo_filas/' + user.uid ).push({
                      nome: 3,
                      ativa:true,
                      prioridade:false,
                      prioridade_qtd:0,
                      manual:true,
                      numero_contador:0,
                      prefixo:'MN-',
                    }, function(error) {
                    });
                    firebase.database().ref('geo_lojas/' + $scope.user.uid+'/dados').set({

                      endereco:'-',
                      telefone:'-',
                      nome:null,
                      email:user.email,
                      foto:null,
                      raio:50,
                    }, function(error) {

                    });

                    geoFire.set($scope.user.uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
                      //console.log("Provided key has been added to GeoFire");
                      firebase.database().ref('geo_lojas/' + $scope.user.uid+'/dados').set({

                        endereco:'-',
                        telefone:'-',
                        nome:null,
                        email:user.email,
                        foto:null,
                        raio:50,
                      }, function(error) {

                      });
                    }, function(error) {
                      //console.log("Error: " + error);
                    });

                    $timeout(function () {
                      //$location.path('#/page1/page3');;
                      document.location.href = '#/page1/page3';
                    }, 4000);
                    //console.log('cadastrou2');
                    $scope.cadastraUsuarioManualEstabelecimentoflag = 0;
                  }, 3000);
                }

              }else {
                //console.log('errou');
              }

            });
          }, 2000);
        }else{

        }
      }
    }else{
      $('.aviso-cadastro').html('Ops, digite o usuário e a senha!');
      $('.divAvisoCadastro').show();
      //console.log('aqui2');
    }
    //console.log(user);
  }



  $scope.cadastrarUsuarioFacebook = function(user) {
      $('.divAvisoCadastro').hide();
      var auth = new firebase.auth.FacebookAuthProvider();
      $cordovaOauth.facebook("111991969424960", ["email"]).then(function(result) {
       var credential = firebase.auth.FacebookAuthProvider.credential(result.access_token);
       firebase.auth().signInWithCredential(credential).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            if (errorCode === 'auth/account-exists-with-different-credential') {
              //alert('Email already associated with another account.');
              // Handle account linking here, if using.
              $('.divAvisoCadastro').show();
              $('.divAvisoCadastro').html('Email já está associado com uma outra conta.');
            } else {
              console.error(error);
            }


       });
         //alert('logou');
         //console.log(data);
         user = firebase.auth().currentUser;
         //alert('passou1');
         firebase.auth().onAuthStateChanged(function(user) {
           //alert('passou2');
           $scope.showLoading();
           firebase.database().ref().child('users').child(user.uid).child('email').once("value", function(snapshot) {
               if(snapshot.val() != null ){
                 //$location.path('#/page1/page3');;
                 document.location.href = '#/page1/page3';
               }else{
                 firebase.database().ref('users/' + user.uid).remove();
                 firebase.database().ref('geo_filas/' + user.uid ).remove();

                 firebase.database().ref('users/' + user.uid).set({
                   email: user.email,
                   active:1,
                   role:2,
                   limit:10000,
                   nome:user.displayName,
                   email:user.email,
                   foto:user.photoURL,
                   raio:50,
                 }, function(error) {
                     if(error){
                       //console.log('erro');
                     }else{

                 }
               });
           //console.log('Tudo Certo');
           firebase.database().ref('users/' + user.uid).remove();
           firebase.database().ref('geo_filas/' + user.uid ).remove();
           firebase.database().ref('users/' + user.uid).set({
             email: user.email,
             active:1,
             role:2,
             limit:10000,
             nome:user.displayName,
             email:user.email,
             foto:user.photoURL,
             raio:50,
           }, function(error) {
             if(error){
               //console.log('erro');
             }else{
             }
           });
           //console.log('Tudo Certo');
           var firebaseRef = firebase.database().ref().child('geo_lojas');
           var geoFire = new GeoFire(firebaseRef);
           var ref = geoFire.ref();  // ref === firebaseRef
           var mykey = ref.child('lojas').push();

           geoFire.set(user.uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
             //console.log("Provided key has been added to GeoFire");
             firebase.database().ref('geo_lojas/' + user.uid+'/dados').set({

               endereco:'-',
               telefone:'-',
               nome:user.displayName,
               email:user.email,
               foto:user.photoURL,
               raio:50,
             }, function(error) {

             });
           }, function(error) {
             //console.log("Error: " + error);
           });
           //Cadastra Fila Comum
           //var user = firebase.auth().currentUser
           firebase.database().ref('limit/' + user.uid).set({
             limit:10000,
           }, function(error) {

           });
           firebase.database().ref('geo_filas/' + user.uid ).push({
             nome: 1,
             ativa:true,
             prioridade:false,
             prioridade_qtd:0,
             manual:false,
             numero_contador:0,
             prefixo:'CM-',
           }, function(error) {
           });

           //Cadastra fila Prioritária
           firebase.database().ref('geo_filas/' + user.uid ).push({
             nome: 2,
             ativa:true,
             prioridade:true,
             prioridade_qtd:2,
             manual:false,
             numero_contador:0,
             prefixo:'PR-',
           }, function(error) {
           });

           //Cadastra fila Manual
           firebase.database().ref('geo_filas/' + user.uid ).push({
             nome: 3,
             ativa:true,
             prioridade:false,
             prioridade_qtd:0,
             manual:true,
             numero_contador:0,
             prefixo:'MN-',
           }, function(error) {
           });

           $timeout(function() {
             //$location.path('#/page1/page3');;
             document.location.href = '#/page1/page3';
           },2000);
       }
       });
     });



   }, function(error) {
      // alert("ERROR: " + error);
   });


  }



  $scope.Prioritária = function(user) {
    $scope.user=user;
    $('.myredcolor').removeClass('myredcolor');
    //$scope.validaCadastro(user);
    if($scope.validaFormulario(user))
    {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(function(user) {
        // [END createwithemail]
        // callSomeFunction(); Optional
        // var user = firebase.auth().currentUser;

      //  //console.log(user.uid);
        //function writeUserData(userId, email) {
          firebase.database().ref('users/' + user.uid).set({
            email: user.email,
            active:1,
            limit:10000,
            role:2,
            raio:50,
          }, function(error) {
            if(error){
              //console.log('erro');
            }else{
              //console.log('Tudo Certo');
              var firebaseRef = firebase.database().ref().child('geo_lojas');
              var geoFire = new GeoFire(firebaseRef);
              var ref = geoFire.ref();  // ref === firebaseRef
              var mykey = ref.child('lojas').push();

              geoFire.set(user.uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
                //console.log("Provided key has been added to GeoFire");
                firebase.database().ref('geo_lojas/' + user.uid+'/dados').set({
                  loja: 'Loja teste',
                  endereco:'endereco teste',
                  telefone:'telefone teste',
                  foto:'undefined',
                  raio:50,
                }, function(error) {

                });
              }, function(error) {
                //console.log("Error: " + error);
              });

            }
          });
        //}
        //alert('salvou');
        /*user.updateProfile({
            displayName: username
        }).then(function() {
            // Update successful.
        }, function(error) {
            // An error happened.
        });*/
    }, function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            console.error(error);
        }
        // [END_EXCLUDE]
    });
      /*firebase.auth().createUserWithEmailAndPassword(user.email, user.password).catch(function(error,userData) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
          } else {
            alert(errorMessage);
          }
          //console.log(userData);
        });*/

      /*firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .catch(function(error) {
        //console.log('aqui');
          var user = firebase.auth().currentUser;

          logUser(user); // Optional
      }, function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          var msg= '';
          if(error=='Error: The specified email address is already in use.')
          {
            msg='Email já em uso. Escolha outro email.';
            $('.lb-email').addClass('myredcolor');
          }
          if(error=='Error: Unable to contact the Firebase server.')
          {
            msg='Sem conexão com a internet. Tente mais terde.';
          }

          $('.aviso-erro').html(msg);
          $('.divAvisoEmailUso').show();
          return false;
      });*/

    }

  }

}])

.controller('pageCtrl', ['$scope', '$stateParams','$ionicSideMenuDelegate','$location', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicSideMenuDelegate,$location) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //viewData.enableBack = true;
    firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;
      $scope.user = firebase.auth().currentUser;
      firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
        $scope.datauser = snapshot.val();
        //console.log(snapshot.val());
      });
    });
  });
}])

.controller('page2Ctrl', ['$scope', '$stateParams','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //viewData.enableBack = true;
    firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;
      $scope.user = firebase.auth().currentUser;
      firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
        $scope.datauser = snapshot.val();
        //console.log(snapshot.val());
      });
    });
  });

}])

.controller('page3Ctrl', ['$scope', '$stateParams','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //viewData.enableBack = true;
    firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;
      $scope.user = firebase.auth().currentUser;
      firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
        $scope.datauser = snapshot.val();
        //console.log(snapshot.val());
      });
    });
  });

}])
.controller('filasCtrl', ['$scope','$timeout', '$ionicPopup', '$stateParams', '$ionicHistory', '$location','$ionicLoading','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$timeout, $ionicPopup, $stateParams, $ionicHistory, $location,$ionicLoading,$ionicSideMenuDelegate) {
//alert();
var connectedRef = firebase.database().ref(".info/connected");
$scope.tentativas = 0;
//$scope.conectDiv=true;
connectedRef.on("value", function(snap) {
  $ionicLoading.hide().then(function(){
     //console.log("The loading indicator is now hidden");
  });
  if (snap.val() === true) {
    $scope.conectDiv=true;

    $timeout(function () {
        $('body').trigger('click');
      //  $scope.conectDiv=true;
    },1500);
    //$window.location.reload();
  } else {

    $scope.conectDiv=false;
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });

  }
});
    userLoggedOn = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(userLoggedOn) {
      if(!userLoggedOn){
        $location.path('/login')
      }
    });
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.showLoading = function() {
      $ionicLoading.show({
        template: 'Carregando...',
        duration: 15000,
      }).then(function(){
         //console.log("The loading indicator is now displayed");
      });
    };
    $scope.hideLoading = function(){
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });
    };
    $scope.showAlert = function(texto) {
      var alertPopup = $ionicPopup.alert({
        title: texto.titulo,
        template: texto.mensagem
      });
      alertPopup.then(function(res) {
        //console.log('Thank you for not eating my delicious ice cream cone');
        //$location.path('/page1/page10');
      });
    };
    $scope.tituloPagina ='';
    $scope.$on('$ionicView.leave', function(){
      $scope.hasSenhas = true;
    });
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {

      $scope.showLoading();
      $scope.senhasAnteriores=[];
      $scope.hasSenhas =true;
      user = firebase.auth().currentUser;
      if (user)
      {
        //console.log('aquilslfkdsl');
        firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
          $scope.datauser = snapshot.val();
          if($scope.datauser.role==3){
            $scope.tituloPagina = "Minhas Senhas";
            $scope.showLoading();
              $scope.senhasAnteriores=[];
              firebase.database().ref().child('senhas_usuarios').child(user.uid).limitToLast(50).once("value", function(snapshot3) {
                $scope.showLoading();

                if(snapshot3.val() != null )
                {
                  $.each(snapshot3.val(), function (key, val) {
                    //$scope.showLoading();
                  //  //console.log(val);
                    firebase.database().ref().child('users').child(val.loja_id).once("value", function(snapshot4) {
                      if(snapshot4.val() != null )
                      {
                        val.loja = snapshot4.val().nome;
                        val.loja_email = snapshot4.val().email;
                        val.loja_foto = snapshot4.val().foto;
                        val.categoria = snapshot4.val().categoria;
                        val.categoriaNome = snapshot4.val().categoriaNome;
                        $scope.senhasAnteriores.unshift(val);
                        //$scope.conectDiv=true;
                        //console.log($scope.senhasAnteriores);

                      }
                    },function (error) {
                      //$scope.hideLoading();
                    });

                  });
                  $timeout(function(){
                      $('#filtro').val('');
                      $('#filtro').trigger('change');
                  },1000);
                }else{
                  //$scope.hideLoading();
                  $scope.hasSenhas = false;
                }

                $timeout(function(){
                  $scope.hideLoading();
                },2000);
              },function(error) {
                $timeout(function(){
                  $scope.hideLoading();
                },2000);
              });


          }else{
            $scope.tituloPagina = "Chamar Senha";
          }
          //console.log(snapshot.val());
        },function(error) {
          $timeout(function(){
            $scope.hideLoading();
          },2000);
        });
        $scope.items = [];
        firebase.database().ref().child('geo_filas').child(user.uid).once("value", function(snapshot) {
            if(snapshot.val() != null ){
              $.each(snapshot.val(), function(index, value) {

                if(value.nome==1 && value.ativa !=false){
                  //console.log('aqui');
                  $scope.showComum= true;
                }
                if(value.nome==3 &&  value.ativa !=false){
                  $scope.showManual=true;
                }
                if(value.nome==2 &&  value.ativa !=false){
                  $scope.showPrioridade=true;
                }
              });
            }else{
              $scope.totalItens =$scope.items.length;
            }
            $timeout(function(){
              $scope.hideLoading();
            },2000);
            //

        },function(error) {
          $timeout(function(){
            $scope.hideLoading();
          },2000);
        });

        $scope.guiches = '';
        firebase.database().ref().child('guiches').child(user.uid).on("value", function(snapshot) {
          if(snapshot.val() != null ){
            //console.log(snapshot.val());
            $scope.guiches = snapshot.val();
          }

        });
      }
      //$scope.hideLoading();
    },function(error) {
      $timeout(function(){
        $scope.hideLoading();
      },2000);
    });


    $scope.loadMoreData=function()
    {

       if(typeof $scope.senhasAnterioresAux[0] != "undefined")
       {

         $scope.senhasAnteriores.push($scope.senhasAnterioresAux[0]);
         $scope.senhasAnterioresAux.shift();

         $scope.$broadcast('scroll.infiniteScrollComplete');
       }else{

          $timeout(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.moredata=true;
          },3000);
       }

    };

  $scope.chamarProximo = function() {

  }

  $scope.changeGuiche = function(guiche) {
    $scope.guiche = guiche;
  }


  $scope.chamarPrioritario = function() {
    setDateTime();
    user = firebase.auth().currentUser;
    $scope.showLoading();
    $scope.countLine =0;
    //firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;
        //console.log('contador da linha 1615 é :'+$scope.countLine);
        //console.log(user);
          firebase.database().ref().child('geo_filas_senhas').child(user.uid).orderByChild("tipo").equalTo(2).limitToFirst(1).once("value", function(snapshot) {
            if(snapshot.val() != null){
              //  $scope.items.push(snapshot.val());
              var myKey;
              var array = $.map(snapshot.val(), function(value, index) {
                  //myKey = index;
                  return [value];
              });
              var myKey = $.map(snapshot.val(), function(value, index) {
                  return index;

              });
              //console.log(snapshot.key);


              for (var i = 0; i < array.length; i++) {
                obj = array[i];
                firebase.database().ref().child('geo_filas_senhas').child(user.uid).child(myKey[0]).remove();
              //  //console.log($scope.guiche);

                var guiche = $scope.guiche || null;
                if (typeof obj.user_id != 'undefined' ) {
                  sendNotificationTouUser(obj.user_id);
                  firebase.database().ref().child('senhas_usuarios').child(obj.user_id).orderByChild("loja_id").equalTo(user.uid).limitToLast(100).once("value", function(snapshot4) {
                  //  //console.log(snapshot.val());
                    if(snapshot4.val() != null){

                      $.each(snapshot4.val(), function (key2, val2) {
                         if(val2.numero == obj.numero)
                         {
                           val2.data_hora_chamada =  getDate(userDateTimeFull);
                           firebase.database().ref('senhas_usuarios').child(obj.user_id).child(key2).set( val2);
                         }
                     });
                    }
                  });
                }

                firebase.database().ref('geo_filas_senhas_usadas/' + user.uid).push({
                  'numero': obj.numero,
                  'tipo': obj.tipo,
                  'data':obj.data,
                  'data_hora_chamada':getDate(userDateTimeFull),
                  'guiche': guiche,
                }, function(error) {
                    if(error){
                      $scope.removeu =true;
                      //console.log('aqui1');
                      $scope.texto={};
                      $scope.texto.titulo ='Ops! Algo deu errado.';
                      $scope.texto.mensagem ='Operaçao não efetuada.';
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }else{
                      //console.log('aqui2');
                      $scope.texto={};
                      $scope.texto.titulo ='Tudo Certo';
                      $scope.texto.mensagem ='A senha foi '+obj.numero+' chamada.';
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }
                });
              //  //console.log($scope.removeu);
                //console.log(obj.ativo);
              }


              //console.log(snapshot.key);

            }else
            {
              //console.log('aqui2');
              $scope.texto={};
              $scope.texto.titulo ='Aviso';
              $scope.texto.mensagem ='Não existem senhas ativas nesta fila.';
              $scope.hideLoading();
              $scope.showAlert($scope.texto);
            }
          });
      }
    //});
  }
  $scope.chamarComum = function() {
    user = firebase.auth().currentUser;
    setDateTime();
    $scope.showLoading();
    $scope.countLine=0;
    //firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;
        //console.log('contador da linha 1525 é :'+$scope.countLine);
        //console.log(user);
          firebase.database().ref().child('geo_filas_senhas').child(user.uid).orderByChild("tipo").equalTo(1).limitToFirst(1).once("value", function(snapshot) {
          //  //console.log(snapshot.val());
            if(snapshot.val() != null){
              //  $scope.items.push(snapshot.val());
              var myKey;
              var array = $.map(snapshot.val(), function(value, index) {
                  //myKey = index;
                  return [value];
              });
              var myKey = $.map(snapshot.val(), function(value, index) {
                  return index;

              });
              //console.log(snapshot.key);
              for (var i = 0; i < array.length; i++) {
                obj = array[i];
                firebase.database().ref().child('geo_filas_senhas').child(user.uid).child(myKey[0]).remove();
                //console.log($scope.guiche);

                var guiche = $scope.guiche || null;
                //alert('passou1');
                if (typeof obj.user_id != 'undefined' ) {
                  //alert('passou2');
                  sendNotificationTouUser(obj.user_id);
                  firebase.database().ref().child('senhas_usuarios').child(obj.user_id).orderByChild("loja_id").equalTo(user.uid).limitToLast(100).once("value", function(snapshot4) {
                  //  //console.log(snapshot.val());
                    if(snapshot4.val() != null){

                      $.each(snapshot4.val(), function (key2, val2) {
                         if(val2.numero == obj.numero)
                         {
                           val2.data_hora_chamada =  getDate(userDateTimeFull);
                           firebase.database().ref('senhas_usuarios').child(obj.user_id).child(key2).set( val2);

                         }
                     });
                    }
                  });
                }
                firebase.database().ref('geo_filas_senhas_usadas/' + user.uid).push({
                  'numero': obj.numero,
                  'tipo': obj.tipo,
                  'data':obj.data,
                  'data_hora_chamada':getDate(userDateTimeFull),
                  'guiche': guiche,
                }, function(error) {
                    if(error){
                      $scope.removeu =true;
                      //console.log('aqui1');
                      $scope.texto={};
                      $scope.texto.titulo ='Ops! Algo deu errado.';
                      $scope.texto.mensagem ='Operaçao não efetuada.';
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }else{
                      //console.log('aqui2');
                      $scope.texto={};
                      $scope.texto.titulo ='Tudo Certo';
                      $scope.texto.mensagem ='A senha foi '+obj.numero+' chamada.';
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }
                });
                //console.log($scope.removeu);
                //console.log(obj.ativo);
              }
              //console.log(snapshot.key);

            }else
            {
              //console.log('aqui2');
              $scope.texto={};
              $scope.texto.titulo ='Aviso';
              $scope.texto.mensagem ='Não existem senhas ativas nesta fila.';
              $scope.hideLoading();
              $scope.showAlert($scope.texto);
            }
          });
      }
    //});

  }


}])

.controller('versenhasCtrl', ['$scope','$ionicPopup', '$stateParams', '$ionicHistory', '$location','$timeout','$ionicLoading','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $ionicPopup, $stateParams, $ionicHistory, $location,$timeout,$ionicLoading,$ionicSideMenuDelegate) {
//alert();
userLoggedOn = firebase.auth().currentUser;
firebase.auth().onAuthStateChanged(function(userLoggedOn) {
  if(!userLoggedOn){
    $location.path('/login')
  }
});
$ionicSideMenuDelegate.canDragContent(false);
$scope.showLoading = function() {
  $ionicLoading.show({
    template: 'Carregando...',
    duration: 3000
  }).then(function(){
    // //console.log("The loading indicator is now displayed");
  });
};
$scope.hideLoading = function(){
  $ionicLoading.hide().then(function(){
    // //console.log("The loading indicator is now hidden");
  });
};
$scope.ionicGoBack = function() {
  $ionicHistory.goBack();
};
$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  viewData.enableBack = true;
  $scope.showLoading();
  var user = firebase.auth().currentUser;

  if (user) {
    firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
      $scope.datauser = snapshot.val();
      //console.log(snapshot.val());
    });
    $scope.items = [];
    var array =[];
    firebase.database().ref().child('geo_filas_senhas').child(user.uid).on("value", function(snapshot) {
        if(snapshot.val() != null){

          $.each(snapshot.val(), function (key, val) {
            val.key = key;
            var array = $.map(val, function(value, index) {
                return [value];
            });
            $scope.items.push(array);

          });
        }else{
          $scope.totalItens =$scope.items.length;
        }
      });
      $scope.guiches = '';
      firebase.database().ref().child('guiches').child(user.uid).on("value", function(snapshot) {
        if(snapshot.val() != null ){
        //  //console.log(snapshot.val());
          $scope.guiches = snapshot.val();
        }
      });



  } else {
    $location.path('/page5');
  }
  $timeout(function(){
    $scope.filtro='';
  },1000);
});
$scope.hideLoading();
$scope.showAlert = function(texto) {
  var alertPopup = $ionicPopup.alert({
    title: texto.titulo,
    template: texto.mensagem
  });
  alertPopup.then(function(res) {
    //console.log('Thank you for not eating my delicious ice cream cone');
    //$location.path('/page1/page10');
  });
};




//console.log(user);

$scope.changeGuiche = function(guiche) {
  $scope.guiche = guiche;
}
$scope.mostrar=true;
$scope.chamarSenhaId = function(senha,id,guiche) {
  setDateTime();
  user = firebase.auth().currentUser;
  $scope.mostrar=false;
  $scope.showLoading();
  $scope.countLine=0;
  //firebase.auth().onAuthStateChanged(function(user) {
    if (user){
      $scope.countLine++;
      //console.log('contador da linha 1525 é :'+$scope.countLine);
      //console.log(user);
        if(id != senha[5]){
          //console.log('aqyui2');
          firebase.database().ref().child('geo_filas_senhas').child(user.uid).child(id).remove();
        }else{
          //console.log(senha);
            firebase.database().ref().child('geo_filas_senhas').child(user.uid).child(senha[5]).remove();
            if(typeof senha[6] != 'undefined')
            {
              firebase.database().ref().child('geo_filas_senhas').child(user.uid).child(senha[6]).remove();
            }
        }




        //firebase.database().ref().child('geo_filas_senhas').child(user.uid).child(myKey[0]).remove();
        var guiche = $scope.guiche || null;

        if (typeof senha[5] != 'undefined' &&  typeof senha[6] != 'undefined') {
          sendNotificationTouUser(senha[5]);
          firebase.database().ref().child('senhas_usuarios').child(senha[5]).orderByChild("loja_id").equalTo(user.uid).limitToLast(100).once("value", function(snapshot4) {
          //  //console.log(snapshot.val());
            if(snapshot4.val() != null){

              $.each(snapshot4.val(), function (key2, val2) {
                 if(val2.numero ==  senha[2])
                 {
                   val2.data_hora_chamada =  getDate(userDateTimeFull);
                   firebase.database().ref('senhas_usuarios').child(senha[5]).child(key2).set( val2);
                 }
             });
            }
          });
        }
        firebase.database().ref('geo_filas_senhas_usadas/' + user.uid).push({
          'numero': senha[2],
          'tipo': senha[4],
          'data': senha[1],
          'data_hora_chamada':getDate(userDateTimeFull),
          'guiche': guiche,
        }, function(error) {
            if(error){
              $scope.removeu =true;
              //console.log('aqui1');
              $scope.texto={};
              $scope.texto.titulo ='Ops! Algo deu errado.';
              $scope.texto.mensagem ='Operaçao não efetuada.';
              $scope.hideLoading();
              $scope.showAlert($scope.texto);
            }else{
              //console.log('aqui2');
              var user = firebase.auth().currentUser;
              //console.log("show after directive partial loaded");
              if (user) {
                $scope.items = [];
                // User is signed in.
                //var userId = firebase.auth().currentUser.uid;
                var array =[];
                firebase.database().ref().child('geo_filas_senhas').child(user.uid).on("value", function(snapshot) {
                //firebase.database().ref().child('geo_filas').child(user.uid).once('value').then(function(snapshot) {
                    if(snapshot.val() != null){

                      $.each(snapshot.val(), function (key, val) {
                        val.key = key;
                        var array = $.map(val, function(value, index) {
                            return [value];
                        });
                        $scope.items.push(array);
                          //console.log($scope.items);
                      });
                      //$scope.items.push(snapshot.val()) ;
                      //console.log(snapshot.val());
                    }else{
                      $scope.totalItens =$scope.items.length;
                    }
                  });

              } else {

                //$location.path('/page5');
              }
              //  alert();
              $timeout(function(){
                $scope.filtro='';
                $scope.mostrar=true;
              },1000);

              $scope.texto={};
              $scope.texto.titulo ='Tudo Certo';
              $scope.texto.mensagem ='A senha foi '+senha[2]+' chamada.';
              $scope.hideLoading();
              $scope.showAlert($scope.texto);
            }
        });
    }
  //});
}
}])
.controller('termosCtrl', ['$scope','$ionicPopup', '$stateParams', '$ionicHistory', '$location','$timeout','$ionicLoading','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $ionicPopup, $stateParams, $ionicHistory, $location,$timeout,$ionicLoading,$ionicSideMenuDelegate) {
//alert();

$ionicSideMenuDelegate.canDragContent(false);


}])
.controller('tabs1Controller', ['$scope','$ionicLoading', '$stateParams','$ionicPopup','$location','$ionicLoading','$timeout','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$ionicLoading, $stateParams,$ionicPopup,$location,$ionicLoading,$timeout,$ionicSideMenuDelegate) {
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',

    }).then(function(){
      // //console.log("The loading indicator is now displayed");
    });
  };

  $ionicSideMenuDelegate.canDragContent(false);
  $scope.limite =1;
  $scope.tituloPrimeiro='';
  $scope.tituloSegundo='';
  $scope.tituloTerceiro ='';
  $scope.tituloQuarto ='';

  $scope.tituloPrimeiroIco='';
  $scope.tituloSegundoIco='';
  $scope.tituloTerceiroIco ='';
  $scope.tituloQuartoIco ='';
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
    //$('.ion-navicon').hide();
    $scope.showContent= false;
    $timeout(function () {
      $scope.showContent= true;
    }, 2500);
  });
  $scope.$on('$ionicView.leave', function(){
      $scope.showContent= false;
      $scope.conectDiv= true;
      $scope.hasStore=true;
      $scope.hasLojas='';
  });
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //$scope.showLoading();
    var onSuccessPos = function(position) {
        $scope.pos.lat = position.coords.latitude;
        $scope.pos.lon= position.coords.longitude;

        //console.log($scope.pos.lon);
    };
    function onErrorPos(error) {
        $scope.posErro=error;
        calldialog();
    }
    $scope.pos = {};
    $scope.pos.lat = 0;
    $scope.pos.lon= 0;
    var onSuccessPos2 = function(position) {
        $scope.pos.lat = position.coords.latitude;
        $scope.pos.lon= position.coords.longitude;

        //console.log($scope.pos.lon);
    };
    function onErrorPos2(error) {
        $scope.posErro=error;
        //calldialog();
    }

    function tentarcadastrarnovamente(loja, usuario,uid) {
      navigator.geolocation.getCurrentPosition(onSuccessPos2, onErrorPos2, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
          setTimeout(function() {
              if($scope.pos.lat != 'undefined' && $scope.pos.lat != '' && $scope.pos.lat != null){
                  geoFire.set(uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
                    //console.log("Provided key has been added to GeoFire");
                    firebase.database().ref('geo_lojas/' + uid+'/dados').set({

                      endereco:'-',
                      telefone:'-',
                      nome:usuario.nome,
                      email:usuario.email,
                      foto:usuario.foto,
                      raio:50,
                    }, function(error) {

                    });
                  }, function(error) {
                    //console.log("Error: " + error);
                  });
                  firebase.database().ref('geo_filas/' + uid ).remove();
                  firebase.database().ref('limit/' + uid).set({
                    limit:10000,
                  }, function(error) {

                  });
                  firebase.database().ref('geo_filas/' + uid ).push({
                    nome: 1,
                    ativa:true,
                    prioridade:false,
                    prioridade_qtd:0,
                    manual:false,
                    numero_contador:0,
                    prefixo:'CM-',
                  }, function(error) {
                  });

                  //Cadastra fila Prioritária
                  firebase.database().ref('geo_filas/' + uid ).push({
                    nome: 2,
                    ativa:true,
                    prioridade:true,
                    prioridade_qtd:2,
                    manual:false,
                    numero_contador:0,
                    prefixo:'PR-',
                  }, function(error) {
                  });

                  //Cadastra fila Manual
                  firebase.database().ref('geo_filas/' + uid ).push({
                    nome: 3,
                    ativa:true,
                    prioridade:false,
                    prioridade_qtd:0,
                    manual:true,
                    numero_contador:0,
                    prefixo:'MN-',
                  }, function(error) {
                  });

                  if(typeof snapshot.val().categoria != 'undefined'){
                      var firebaseRef2 = firebase.database().ref().child('geo_lojas_cat').child(snapshot.val().categoria);
                      var geoFire2 = new GeoFire(firebaseRef2);
                      var ref2 = geoFire.ref();  // ref === firebaseRef


                      geoFire2.set(uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
                        //console.log("Provided key has been added to GeoFire");
                        firebase.database().ref('geo_lojas_cat/'+snapshot.val().categoria+'/'+ uid+'/dados').set({
                          endereco:'-',
                          telefone:'-',
                          nome:usuario.nome,
                          email:usuario.email,
                          foto:usuario.foto,
                          raio:50,
                        }, function(error) {

                        });
                    });
                }

            }else{
              tentarcadastrarnovamente(loja, usuario ,uid)
            }
          },1000);
    }
    navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

    $scope.showContent= false;
    $timeout(function () {
      $scope.showContent= true;
    }, 2500);

    user = firebase.auth().currentUser;
    $scope.countLine=0;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;

        $timeout(function() {
        //console.log(user.uid);
        firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
          $scope.datauser = snapshot.val();
          //console.log(snapshot.val());

          $scope.isAndroid = ionic.Platform.isAndroid();
          $scope.isIos = ionic.Platform.isIOS();
          //console.log($scope.isIos);
          if(snapshot.val() != null)
          {
            if(snapshot.val().role ==2){
              $scope.tituloPrimeiro='Gerar Senhas';
              $scope.tituloSegundo ='Chamar Senha';
              $scope.tituloTerceiro ='Minha Fila';
              $scope.tituloQuarto ='Configurações';


              if($scope.isAndroid == true){
                $scope.tituloPrimeiroIco='ion-plus-circled';
                $scope.tituloSegundoIco='ion-speakerphone';
                $scope.tituloTerceiroIco ='ion-person-stalker';
                $scope.tituloQuartoIco ='ion-gear-a';
              }else if($scope.isIos == true){
                $scope.tituloPrimeiroIco='ion-ios-plus';
                $scope.tituloSegundoIco='ion-speakerphone';
                $scope.tituloTerceiroIco ='ion-person-stalker';
                $scope.tituloQuartoIco ='ion-ios-gear';
              }else{
                $scope.tituloPrimeiroIco='ion-plus-circled';
                $scope.tituloSegundoIco='ion-speakerphone';
                $scope.tituloTerceiroIco ='ion-person-stalker';
                $scope.tituloQuartoIco ='ion-gear-a';
              }
              $scope.usuario ={};
              $scope.usuario.nome =  snapshot.val().nome || null;
              $scope.usuario.email =  snapshot.val().email || null;
              $scope.usuario.foto = snapshot.val().foto || null;

              firebase.database().ref().child('geo_lojas').child(user.uid).once("value", function(snapshotgeolojas) {
                if(snapshotgeolojas.val() == null)
                {
                    var firebaseRef = firebase.database().ref().child('geo_lojas');
                    var geoFire = new GeoFire(firebaseRef);
                    var ref = geoFire.ref();  // ref === firebaseRef
                    if($scope.pos.lat != 'undefined' && $scope.pos.lat != '' && $scope.pos.lat != null){
                        geoFire.set(user.uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
                          //console.log("Provided key has been added to GeoFire");
                          firebase.database().ref('geo_lojas/' + user.uid+'/dados').set({

                            endereco:'-',
                            telefone:'-',
                            nome:$scope.usuario.nome,
                            email:$scope.usuario.email,
                            foto:$scope.usuario.foto,
                            raio:50,
                          }, function(error) {

                          });
                        }, function(error) {
                          //console.log("Error: " + error);
                        });
                        firebase.database().ref('geo_filas/' + user.uid ).remove();
                        firebase.database().ref('limit/' + user.uid).set({
                          limit:10000,
                        }, function(error) {

                        });
                        firebase.database().ref('geo_filas/' + user.uid ).push({
                          nome: 1,
                          ativa:true,
                          prioridade:false,
                          prioridade_qtd:0,
                          manual:false,
                          numero_contador:0,
                          prefixo:'CM-',
                        }, function(error) {
                        });

                        //Cadastra fila Prioritária
                        firebase.database().ref('geo_filas/' + user.uid ).push({
                          nome: 2,
                          ativa:true,
                          prioridade:true,
                          prioridade_qtd:2,
                          manual:false,
                          numero_contador:0,
                          prefixo:'PR-',
                        }, function(error) {
                        });

                        //Cadastra fila Manual
                        firebase.database().ref('geo_filas/' + user.uid ).push({
                          nome: 3,
                          ativa:true,
                          prioridade:false,
                          prioridade_qtd:0,
                          manual:true,
                          numero_contador:0,
                          prefixo:'MN-',
                        }, function(error) {
                        });
                        if(typeof snapshot.val().categoria != 'undefined'){
                            var firebaseRef2 = firebase.database().ref().child('geo_lojas_cat').child(snapshot.val().categoria);
                            var geoFire2 = new GeoFire(firebaseRef2);
                            var ref2 = geoFire.ref();  // ref === firebaseRef


                            geoFire2.set(user.uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
                              //console.log("Provided key has been added to GeoFire");
                              firebase.database().ref('geo_lojas_cat/'+snapshot.val().categoria+'/'+ user.uid+'/dados').set({
                                endereco:'-',
                                telefone:'-',
                                nome:$scope.usuario.nome,
                                email:$scope.usuario.email,
                                foto:$scope.usuario.foto,
                                raio:50,
                              }, function(error) {

                              });
                          });
                      }

                  }else{
                    tentarcadastrarnovamente(snapshotgeolojas, $scope.usuario,user.uid )
                  }
                }

              });

            }else{
              $scope.tituloPrimeiro='Pegar Senha';
              $scope.tituloSegundo ='Minhas Filas';
              $scope.tituloTerceiro ='Favoritos';
              $scope.tituloQuarto ='Configurações';
              if($scope.isAndroid == true){
                $scope.tituloPrimeiroIco='ion-pricetags';
                $scope.tituloSegundoIco='ion-person-stalker';
                $scope.tituloTerceiroIco ='ion-heart';
                $scope.tituloQuartoIco ='ion-gear-a';
              }else if($scope.isIos == true){
                $scope.tituloPrimeiroIco='ion-ios-pricetags';
                $scope.tituloSegundoIco='ion-person-stalker';
                $scope.tituloTerceiroIco ='ion-heart';
                $scope.tituloQuartoIco ='ion-ios-gear';
              }else{
                $scope.tituloPrimeiroIco='ion-pricetags';
                $scope.tituloSegundoIco='ion-person-stalker';
                $scope.tituloTerceiroIco ='ion-heart';
                $scope.tituloQuartoIco ='ion-gear-a';
              }

            }
          }

        });
      },2500);
      }else{
        document.location.href = '#/page5';
      }
    });
  });
}])
angular.module('app.controllers', [])

.controller('assineCtrl', ['$scope','$location','$ionicSideMenuDelegate', '$stateParams','$ionicLoading','$ionicPopup','$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$location,$ionicSideMenuDelegate, $stateParams,$ionicLoading,$ionicPopup,$ionicHistory) {
  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });
$ionicSideMenuDelegate.canDragContent(false);

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    userLoggedOn = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(userLoggedOn) {
      if(!userLoggedOn){
        $location.path('/login')
      }
    });
    viewData.enableBack = true;
    $scope.countLine=0;
    //firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;
      if (user){
        $scope.countLine++;
        $scope.user = firebase.auth().currentUser;
        firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
          $scope.datauser = snapshot.val();
          //console.log(snapshot.val());
        });
      }else{
        //$location.path('/page5')
      }

    //});
  });
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 1000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  user = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(user) {
    $scope.user = firebase.auth().currentUser;
  });
  $scope.showAlert = function(texto) {
    var alertPopup = $ionicPopup.alert({
      title: texto.titulo,
      template: texto.mensagem
    });
    alertPopup.then(function(res) {
    });
  };

  $scope.assinar = function() {
    $scope.showLoading();
    $.getJSON( "http://hudo.000webhostapp.com/entregapp/RestPedidos/pagseguromobile?ref="+$scope.user.uid+"", function( data ){
        $scope.hideLoading();
      if(data[0] !='Existe' && data[0] !='E' )
      {
        //  //console.log(data[0]);
        window.open('https://sandbox.pagseguro.uol.com.br/v2/pre-approvals/request.html?code='+data[0],'_system');
        $scope.hideLoading();
      }else{
        //    //console.log(data[0]);
        $scope.texto  ={};
        $scope.texto.titulo ='Falha';
        $scope.texto.mensagem ='Esta conta já possui uma assinatura Premium.';

        $scope.showAlert($scope.texto);
      }
    });
    /**/
  }


}])

.controller('acompanharFilasCtrl', ['$scope','$timeout', '$ionicSideMenuDelegate','$stateParams','$location','$ionicLoading','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$timeout,$ionicSideMenuDelegate, $stateParams,$location,$ionicLoading,$ionicPopup) {

  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
      $scope.conectDiv=true;
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });
  $ionicSideMenuDelegate.canDragContent(false);
  userLoggedOn = firebase.auth().currentUser;
  $scope.userLoggedOn = userLoggedOn;

  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  $scope.$on('$ionicView.leave', function(){
      //$ionicSideMenuDelegate.canDragContent(true);
      //$('.ion-navicon').show();
      $scope.showContent=false;
    });
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    userLoggedOn = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(userLoggedOn) {
      if(!userLoggedOn){
        $location.path('/login')
      }
    });
    //viewData.enableBack = true;
    $scope.showLoading();
    firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;
      $scope.user = firebase.auth().currentUser;
      firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
        $scope.datauser = snapshot.val();
          //$scope.hideLoading();
          if(snapshot.val() != null){
            if(typeof $scope.datauser.categoria != 'undefined'){
              firebase.database().ref().child('categorias').child($scope.datauser.categoria).once("value", function(snapshot2) {
                  $scope.datauser.categoriaNome = snapshot2.val();
                  //console.log($scope.datauser.categoriaNome);
              },function(error) {
                $timeout(function(){
                  $scope.hideLoading();
                },2000);
              });
            }

          }
          $timeout(function(){
            $scope.showContent=true;
            $scope.hideLoading();
          },2000);
        //console.log(snapshot.val());
      },function(error) {
        $timeout(function(){
          $scope.showContent=true;
          $scope.hideLoading();
        },2000);
      });

    });
  });
  $scope.logout = function (){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      $scope.user = null;
      //$location.path('/login');
      navigator.app.exitApp();
    }, function(error) {
      // An error happened.
    });
  }
  user = firebase.auth().currentUser;
  $scope.user = user;
  firebase.auth().onAuthStateChanged(function(user) {
    $scope.user = firebase.auth().currentUser;
  });
    $scope.uploadProgres =0;
    $scope.showProgress=false;
    $scope.showProgress=false;
  $scope.getImage = function (source) {
      //alert('passou1');
      // Retrieve image file location from specified source
      $('#configForm').submit(function(event) {
        event.preventDefault();
      });
      $scope.showImage=false;
      var options = {
          maximumImagesCount: 1,
          quality: 50
      };
      $scope.showLoading();
      window.imagePicker.getPictures(
        function(results) {

          //alert('passou2');
            for (var i = 0; i < results.length; i++) {

                //getFileEntry(results[i]);

                var imageData = results[i];
                var filename = imageData.split("/").pop();
                var storageRef = firebase.storage().ref();

                var getFileBlob = function(url, cb) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url);
                    xhr.responseType = "blob";
                    xhr.addEventListener('load', function() {
                        cb(xhr.response);
                    });
                    xhr.send();
                };

                var blobToFile = function(blob, name) {
                    blob.lastModifiedDate = new Date();
                    blob.name = name;
                    return blob;
                };

                var getFileObject = function(filePathOrUrl, cb) {
                    getFileBlob(filePathOrUrl, function(blob) {
                        cb(blobToFile(blob, 'test.jpg'));
                    });
                };

                getFileObject(imageData, function(fileObject) {
                    var uploadTask = storageRef.child('images/'+user.uid+'.jpg').put(fileObject);

                    uploadTask.on('state_changed', function(snapshot) {
                        //alert(snapshot);
                    }, function(error) {
                        //alert(error);
                    }, function() {
                        var downloadURL = uploadTask.snapshot.downloadURL;
                        $scope.datauser.foto = downloadURL;
                        firebase.database().ref('users/' + user.uid).set($scope.datauser, function(error) {
                          $scope.texto  ={};
                          $scope.hideLoading();
                          if(error){
                            $scope.texto.titulo ='Ops! Algo deu errado.';
                            $scope.texto.mensagem ='Não conseguimos salvar a configuração.';
                            $scope.showAlert($scope.texto);
                          }else{
                            $scope.texto.titulo ='Tudo Certo!';
                            $scope.texto.mensagem ='Sua configuração foi salva!';
                            $scope.showAlert($scope.texto);
                          }
                        });
                        //alert(downloadURL);
                        // handle image here
                    });
                });
                $timeout(function(){
                  $scope.hideLoading();
                },2000);
            }
        }, function (error) {
            $scope.showImage=false;
            $timeout(function(){
              $scope.hideLoading();
            },2000);
            alert('Error: ' + error);
        },
        options
      );


      $timeout(function(){
        $scope.hideLoading();
      },2000);
   }
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 10000,
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  // Triggered on a button click, or some other target
$scope.showPopup = function() {

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    title: 'Cancelar Conta',
    subTitle: 'Deseja Canelar a conta Premium?',
    scope: $scope,
    buttons: [
      {
        text: '<b>Sim</b>',
        type: 'button-assertive',
        onTap: function(e) {
          $scope.confirmarcancelamento();
        }
      },
      { text: 'Não' }
    ]
  });
}
$scope.showAlert = function(texto) {
  var alertPopup = $ionicPopup.alert({
    title: texto.titulo,
    template: texto.mensagem
  });
  alertPopup.then(function(res) {
  });
};
$scope.confirmarcancelamento = function() {
  $scope.showLoading();
  $.getJSON( "http://hudo.000webhostapp.com/entregapp/RestPedidos/cancelarpagseguro?ref="+$scope.user.uid+"", function( data ){
      $scope.hideLoading();
    if(data[0] !='Not Found' && data[0] !='N' )
    {
        //console.log(data[0]);
    }else{
        //  //console.log(data[0]);
      $scope.texto  ={};
      $scope.texto.titulo ='Falha';
      $scope.texto.mensagem ='Não foi possível cancelar a assinatura, por favor entre em contato com suporte@hudo.com.br';
      $scope.showAlert($scope.texto);

    }
  });
}
$scope.setRaio = function(usercad) {
  $scope.showLoading();
  $scope.datauser.raio = usercad.raio || null;
  $scope.datauser.nome = usercad.nome || null;

  //user = firebase.auth().currentUser;
  //firebase.auth().onAuthStateChanged(function(user) {
    //$scope.user = firebase.auth().currentUser;
  firebase.database().ref('users/' + user.uid).set($scope.datauser, function(error) {
      $scope.texto  ={};
      $scope.hideLoading();
      if(error){
        $scope.texto.titulo ='Ops! Algo deu errado.';
        $scope.texto.mensagem ='Não conseguimos salvar a configuração.';
        $scope.showAlert($scope.texto);
      }else{
        $scope.texto.titulo ='Tudo Certo!';
        $scope.texto.mensagem ='Sua configuração foi salva!';
        $scope.showAlert($scope.texto);
      }
    });
  //});

}
$scope.cancelar = function() {

  $scope.showPopup();

  /**/
}
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };

  //$scope.showLoading();
  //$scope.hideLoading();


}])

.controller('guichesCtrl', ['$scope','$timeout','$ionicSideMenuDelegate', '$stateParams','$location','$ionicLoading','$ionicHistory','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$timeout, $ionicSideMenuDelegate,$stateParams,$location,$ionicLoading,$ionicHistory,$ionicPopup) {
  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });
  $ionicSideMenuDelegate.canDragContent(false);
  userLoggedOn = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  $scope.remover = function(key) {
    $scope.showLoading();
    user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
      firebase.database().ref().child('guiches').child(user.uid).child(key).remove();
      //console.log(key);
      $scope.hideLoading();
    });

  }
  $scope.cadastrar = function(guiche) {
    //console.log(guiche);
    $scope.showLoading();
    if(guiche != '' && typeof guiche != 'undefined')
    {
      user = firebase.auth().currentUser;
      firebase.auth().onAuthStateChanged(function(user) {
        firebase.database().ref().child('guiches').child(user.uid).orderByChild("guiche").startAt(guiche).endAt(guiche).limitToFirst(1).once("value", function(snapshot) {
          if(snapshot.val() != null){
            $scope.hideLoading();
            $scope.texto  ={};
            $scope.texto.titulo ='Aviso';
            $scope.texto.mensagem ='Este guichê já existe.';
            $scope.showAlert($scope.texto);
          }else{
              firebase.database().ref('guiches/' + user.uid ).push({
                guiche: guiche,
              }, function(error) {
                  if(!error)
                  {
                    $scope.texto  ={};
                    $scope.texto.titulo ='Tudo Certo';
                    $scope.texto.mensagem ='A operação foi efetuada.';
                    $scope.hideLoading();
                    $scope.showAlert($scope.texto);
                    $('[name="guiche"]').val('');
                  }
              });

          }
        });
      });
    }else{
      $scope.hideLoading();
      $scope.texto  ={};
      $scope.texto.titulo ='Ops! Algo deu errado.';
      $scope.texto.mensagem ='O guichê não pode estar vazio.';
      $scope.showAlert($scope.texto);
    }


  }
  $scope.showAlert = function(texto) {
    var alertPopup = $ionicPopup.alert({
      title: texto.titulo,
      template: texto.mensagem
    });
    alertPopup.then(function(res) {
    });
  };
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 1000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
    $scope.items =[];
    user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
      firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
        $scope.datauser = snapshot.val();
        //console.log(snapshot.val());
      });
      firebase.database().ref().child('guiches').child(user.uid).on("value", function(snapshot) {
        if(snapshot.val() != null){
          $scope.items = snapshot.val();
        //  //console.log($scope.items);
        }else{
          $scope.totalItens =$scope.items.length;
        }
        $scope.hideLoading();
      });
    })

  });
  $scope.showLoading();
  //$scope.hideLoading();


}])
.controller('gerarSenhasClienteCtrl', ['$scope','$timeout','$ionicSideMenuDelegate', '$ionicPopup', '$stateParams', '$ionicHistory', '$location','$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$timeout, $ionicSideMenuDelegate,$ionicPopup, $stateParams,$ionicHistory, $location, $ionicLoading) {

  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);

      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
    //console.log('off');
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });

  $ionicSideMenuDelegate.canDragContent(false);
  userLoggedOn = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  $scope.retornaNome = function(num) {
    switch (num) {
      case 1:
        return 'Comum';
        break;
        case 2:
          return 'Prioritária';
          break;
          case 3:
            return 'Manual';
            break;
      default:

    }
  }
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...'
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };
  $scope.contadorSenhaCanc= 0;
  $scope.contaSenhasCanceladas = function() {
    setDateTime();
    user = firebase.auth().currentUser;
    $scope.countLine=0;
  //firebase.auth().onAuthStateChanged(function(user) {
      if (user){
      $scope.countLine++;

        var hoje  =getDateSmall(userDateTimeFull);
        $scope.contadorSenhaCanc=0;
        firebase.database().ref().child('senhas_canceladas_usuarios').child(user.uid).orderByChild('data').equalTo(hoje).once("value", function(snapshot3){
          //console.log(snapshot3.val());
          if(snapshot3.val() != null){
            $.each(snapshot3.val(), function(key3,val3) {
              $scope.contadorSenhaCanc ++;

            });
            //console.log($scope.contadorSenhaCanc);
            return $scope.contadorSenhaCanc;
          }
        });
      }
   //});
  }
  $scope.cancelarsenha = function() {
    setDateTime();
    $scope.showLoading();
    $scope.texto ={}
    user = firebase.auth().currentUser;
  $scope.countLine=0;
//  firebase.auth().onAuthStateChanged(function(user) {
    if (user){
      $scope.countLine++;
            var contCandeladas = $scope.contaSenhasCanceladas();

            firebase.database().ref().child('geo_filas_senhas').child($stateParams.id).orderByChild('user_id').equalTo(user.uid).once("value", function(snapshot){

              if(snapshot.val() != null){
                $.each(snapshot.val(), function(key,val) {
                  //console.log(val);

                 firebase.database().ref().child('senhas_usuarios').child(user.uid).orderByChild('numero').equalTo(val.numero).once("value", function(snapshot2){
                     //console.log(snapshot2.val());
                     if(snapshot2.val() != null)
                     {
                       $.each(snapshot2.val(), function(key2,val2) {

                         var hoje  =getDateSmall(userDateTimeFull);
                         firebase.database().ref('senhas_canceladas_usuarios/' + user.uid).push({
                           loja_id:$stateParams.id,data:hoje
                         }, function(error) {

                         });
                         if($scope.contadorSenhaCanc < 3)
                         {
                           firebase.database().ref().child('senhas_usuarios').child(user.uid).child(key2).remove();
                           firebase.database().ref().child('geo_filas_senhas').child($stateParams.id).child(key).remove();
                           $scope.texto.titulo ='Boa!';
                           $scope.texto.mensagem ='Sua senha foi cancelada.';
                           $scope.hideLoading();
                           $scope.showAlert($scope.texto);
                         }else{
                           $scope.texto.titulo ='Ops, algo deu errado!';
                           $scope.texto.mensagem ='Você já não pode mais cancelar senhas por hoje.';
                           $scope.hideLoading();
                           $scope.showAlert($scope.texto);
                         }



                       });
                     }
                     $scope.hideLoading();
                   });
                });
                 $scope.hideLoading();
              }else{
                $scope.texto.titulo ='Opa!';
                $scope.texto.mensagem ='Você não tem senhas nesta fila.';
                $scope.showAlert($scope.texto);
              }
              $scope.hideLoading();
            });

        }else{
           $scope.hideLoading();
        }
    //});
  };
  var user = firebase.auth().currentUser;

  $scope.numFilasInativas=0;

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
    $scope.numFilasInativas=0;
    $scope.lojaFila= [];
    $scope.showLoading();
    firebase.database().ref().child('geo_filas').child($stateParams.id).once("value", function(snapshot) {
      $scope.items = [];
        if(snapshot.val() != null ){
          $scope.items.push(snapshot.val());
          $scope.numFilasInativas = 0;
          $.each(snapshot.val(), function (key, val) {
              //console.log(val);
               if(val.manual == false && val.ativa == false)
               {
                 $scope.numFilasInativas++;
               }
           });
          //console.log($scope.numFilasInativas);
        }else{
          $scope.totalItens =$scope.items.length;
        }
        $scope.hideLoading();

        firebase.database().ref().child('users').child($stateParams.id).once("value", function(snapshot2) {
          if(snapshot2.val() != null ){
            //console.log(snapshot2.val());
            $scope.lojaFila = snapshot2.val();
            $scope.limite = snapshot2.val().limit;
          }
        });
    });

  });


    $scope.showAlert = function(texto) {
      var alertPopup = $ionicPopup.alert({
        title: texto.titulo,
        template: texto.mensagem
      });
      alertPopup.then(function(res) {
      });
    };
    $scope.contador='';
    $scope.contaNumero = function(id){
      setDateTime();
      user = firebase.auth().currentUser;
      $scope.contadorAuxSenha = 0;
      $scope.countLine=0;
      //firebase.auth().onAuthStateChanged(function(user) {
        if (user){
          $scope.countLine++;

            if($scope.contadorAuxSenha==0)
            {
              firebase.database().ref().child('geo_filas').child($stateParams.id).child(id).once("value", function(snapshot) {
                fila =snapshot.val();
                $scope.contador = parseInt(fila.numero_contador) + 1;
              //  //console.log($scope.contador);
                user = firebase.auth().currentUser;
                var mykey = firebase.database().ref('geo_filas_senhas/' + $stateParams.id).push();
                var prefixo = fila.prefixo || '';
                var contador = $scope.contador || 1;
                var posFixoRestaurante = '';
                if(typeof $scope.lojaFila.categoria != 'undefined'){
                  if($scope.lojaFila.categoria== 1){
                    posFixoRestaurante ='';
                    posFixoRestaurante= $('#qtdPessoas').val();
                    if(typeof posFixoRestaurante != 'undefined' && posFixoRestaurante != '? undefined:undefined ?'){
                        posFixoRestaurante = ' P-'+ posFixoRestaurante;
                    }else {
                        posFixoRestaurante = ' P-'+ 1;
                    }

                  }
                }
                var nome  = fila.nome || 'S/N';
                var user_id = $('#user_id').val() || null;

                firebase.database().ref('geo_filas_senhas/' + $stateParams.id).push({
                  pos:contador, numero:prefixo + $scope.contador + posFixoRestaurante, ativo:'true', tipo:nome,data:getDate(userDateTimeFull),user_id:user.uid,
                }, function(error) {
                    $scope.texto={};
                    if(error){
                      $scope.texto.titulo ='Ops! Algo deu errado.';
                      $scope.texto.mensagem ='Operaçao não efetuada.';
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }else
                    {
                      $scope.texto.titulo ='Tudo Certo';
                      $scope.texto.mensagem ='Sua senha '+ prefixo + contador + posFixoRestaurante;
                      firebase.database().ref('geo_filas').child($stateParams.id).child(id).child('/numero_contador').set( $scope.contador);
                      if(user.uid != '')
                      {
                        firebase.database().ref('senhas_usuarios/' + user.uid).push({
                          pos:contador, numero:prefixo + $scope.contador + posFixoRestaurante, ativo:'true', tipo:nome,data:getDate(userDateTimeFull),loja_id:$stateParams.id,
                        }, function(error) {

                        });
                      }
                      // $('#qtdPessoas').val('');
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }
                });
              });
            }

          }
      //});

    }

    $scope.contaSenha = function()
    {
      setDateTime();
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();

      var ref = firebase.database().ref("senhas_gratis/"+$stateParams.id+'/'+ year +'/'+ month);
      ref.once("value").then(function(snapshot) {
        var a = snapshot.numChildren(); // 1 ("name")
        $scope.contadorSenha = snapshot.child(day).numChildren(); // 2 ("first", "last")
      });
    }
    $scope.contadorSenha = $scope.contaSenha();
    $scope.setlogsenha = function()
    {
      setDateTime();
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      user = firebase.auth().currentUser;
      firebase.database().ref('senhas_gratis/' + user.uid +'/' + year +'/'+ month+'/'+ day ).push({qtd:1});
    }
    //$scope.setlogsenha();
    $scope.gerarSenha = function(value, id)
    {
        $scope.showLoading();


        user = firebase.auth().currentUser;
        $scope.countLine=0;
        //firebase.auth().onAuthStateChanged(function(user) {
            if (user){
              $scope.countLine++;

                firebase.database().ref().child('geo_filas_senhas').child($stateParams.id).orderByChild('user_id').equalTo(user.uid).once("value", function(snapshot){
                    $scope.texto= {};
                    if(snapshot.val() == null)
                    {
                      user = firebase.auth().currentUser;
                      $scope.contaSenha();


                      if( $scope.contadorSenha  >= $scope.limite)
                      {
                        $scope.texto.titulo ='Ops! Que embaraçoso.';
                        $scope.texto.mensagem ='Acabaram as senhas disponíveis deste estabelecimento por hoje. Tente pegar uma senha outro dia.';
                        $scope.hideLoading();
                        $scope.showAlert($scope.texto);

                      }else{
                        userNotf = user.displayName;
                        userNotf = userNotf || user.email;
                        userNotf = userNotf || null;
                        if(userNotf != '' && userNotf !=null){
                            sendNotificationTouUserNewNumberEstab($stateParams.id,userNotf);
                        }

                        $scope.setlogsenha();
                        $scope.contaNumero(id);
                      }
                    }else{
                      $scope.texto.titulo ='Ops! Que embaraçoso.';
                      $scope.texto.mensagem ='Você já tem uma senha ativa neste estabelecimento, e não pode pegar outra senha neste momento. Cancele sua senha ou aguarde a sua senha ser chamada.';
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }
                });
            }
        //});

  }



  $scope.pos={};
  $scope.pos.lat=0;
  $scope.pos.lon=0;
  $scope.post={};
  $scope.imageUrl='';

  var onSuccessPos = function(position) {
      $scope.pos.lat = position.coords.latitude;
      $scope.pos.lon= position.coords.longitude;
      //console.log($scope.pos.lon);
  };

    // onError Callback receives a PositionError object
  function onErrorPos(error) {
      $scope.posErro=error;
      calldialog();
  }

  navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});


  //$scope.fila.user_id ='';
  $scope.fila = [];
  if (user) {
    // User is signed in.
    //alert('1');
    //console.log(user);
    $scope.fila.user_id = user.uid;
  } else {
      $location.path('/page5')

  }

  var firebaseRef = firebase.database().ref().child('geo_filas');
  var geoFire = new GeoFire(firebaseRef);
  var ref = geoFire.ref();  // ref === firebaseRef
  //var mykey = ref.child('dados').push();
  //console.log(user.uid);
  var user = firebase.auth().currentUser
  //$scope.showConfirm();
  // An alert dialog


  $scope.cadastrarFila = function(fila) {
    var user = firebase.auth().currentUser
    var nome = fila.nome || null;
    var ativa = fila.ativa || false;
    var prioridade = fila.prioridade || false;
    var prioridade_qtd = fila.qtd_prioridade || 0;
    var manual = fila.manual || false;
    var numero_contador = fila.numero_contador || 0;
    var prefixo = fila.prefixo || '';
    $scope.texto= {};
    //console.log(nome);
    if(nome == null || nome == 'undefined' )
    {
      $scope.texto.titulo ='Ops! Algo deu errado.';
      $scope.texto.mensagem ='O nome não poder estar vazio.';
      $scope.showAlert($scope.texto);
    }else{
      firebase.database().ref('geo_filas/' + user.uid + '/' + $stateParams.id).set({
        nome: nome,
        ativa:ativa,
        prioridade:prioridade,
        prioridade_qtd:prioridade_qtd,
        manual:manual,
        numero_contador:numero_contador,
        prefixo:prefixo,
      }, function(error) {
          if(error){
            $scope.texto.titulo ='Ops! Algo deu errado.';
            $scope.texto.mensagem ='Não conseguimos realizar a operação.';
            $scope.showAlert($scope.texto);
          }else
          {
            $scope.texto.titulo ='Tudo certo!';
            $scope.texto.mensagem ='A operação foi efetuada.';
            $scope.showAlert($scope.texto);
          }
      });
    }
  }
}])
.controller('painelLojaCtrl', ['$scope','$timeout', '$ionicSideMenuDelegate','$stateParams','$location','$ionicLoading','$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$timeout, $ionicSideMenuDelegate,$stateParams,$location,$ionicLoading,$timeout) {

  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });
  $ionicSideMenuDelegate.canDragContent(false);
  userLoggedOn = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.verFila = function(id)
  {
    $location.path('/painelloja/'+id);
  }
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
    $scope.showLoading();
    $scope.countLine=0;
    //firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;

      if (user){
        $scope.countLine++;
        $timeout(function() {
          firebase.database().ref().child('users').child($stateParams.id).once("value", function(snapshot) {

            $scope.datauser = snapshot.val();
            //console.log($scope.datauser);
            if($scope.datauser.role == 2)
            {
              firebase.database().ref().child('geo_filas_senhas_usadas').child($stateParams.id).limitToLast(1).on("child_added", function(snapshot) {
                if(snapshot.val() != null ){
                  $scope.senha=snapshot.val();
                  $scope.hideLoading();
                }
              });
              $scope.senhasAnterioresAux=[]
              var ref = firebase.database().ref().child('geo_filas_senhas_usadas').child($stateParams.id);

              $scope.senhasAnteriores=[];
              ref.orderByKey().limitToLast(10).on("child_added", function(snapshot) {
                if(snapshot.val() != null ){
                  //if($scope.senhasAnteriores.length < 5){
                    $scope.senhasAnteriores.unshift(snapshot.val());

                //  }else{
                    //$scope.senhasAnterioresAux.unshift(snapshot.val());
                  //}
                  //countRef++;

                }
              });
            }
            $scope.minhasenha='';
            firebase.database().ref().child('geo_filas_senhas').child($stateParams.id).orderByChild('user_id').equalTo(user.uid).once("value", function(snapshot){

                if(snapshot.val() != null)
                {
                  $.each(snapshot.val(), function (key, val) {
                     $scope.minhasenha = val;
                 });
                  //$scope.minhasenha=snapshot.val();

                  //console.log($scope.minhasenha);
                }
            });
          });
          $timeout(function () {
            $('#filtro').val(' ');
            $scope.hideLoading();
          }, 3000);
        },2500);


      } else {
          $scope.hideLoading();
          $location.path('/page5')

      }

    //});

  });

   $scope.moredata = false;

   $scope.loadMoreData=function()
   {

      if(typeof $scope.senhasAnterioresAux[0] != "undefined")
      {

        $scope.senhasAnteriores.push($scope.senhasAnterioresAux[0]);
        $scope.senhasAnterioresAux.shift();

        $scope.$broadcast('scroll.infiniteScrollComplete');
      }else{

         $timeout(function() {
           $scope.$broadcast('scroll.infiniteScrollComplete');
           $scope.moredata=true;
         },3000);
      }


   };


  $scope.mostrar = function()
  {
    $('.nav-bar-container').fadeIn(1000);
    $('.tabs').fadeIn(1000);
  }
  $scope.esconder = function()
  {
    $('.nav-bar-container').fadeOut(1000);
    $('.tabs').fadeOut(1000);
  }



//alert();
}])

.controller('gerarsenhascategoriasCtrl', ['$scope','$window','$ionicSideMenuDelegate','$timeout' ,'$stateParams','$location','$ionicLoading','$ionicHistory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$window,$ionicSideMenuDelegate ,$timeout,$stateParams,$location,$ionicLoading,$ionicHistory) {

var connectedRef = firebase.database().ref(".info/connected");
$scope.tentativas = 0;
//$scope.conectDiv=true;
connectedRef.on("value", function(snap) {
  $ionicLoading.hide().then(function(){
     //console.log("The loading indicator is now hidden");
  });
  if (snap.val() === true) {
    $scope.conectDiv=true;

    $timeout(function () {
        $('body').trigger('click');
      //  $scope.conectDiv=true;
    },1500);
    //$window.location.reload();
  } else {

    $scope.conectDiv=false;
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });

  }
});
 $ionicSideMenuDelegate.canDragContent(false);
 $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
   //calldialog();
   $scope.showLoading();
   //alert('passou1');

   navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
    //navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos);
    viewData.enableBack = true;

    //
  });
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };
  $scope.$on('$ionicView.leave', function(){
    $scope.pos={};
    $scope.pos.lat=0;
    $scope.pos.lon=0;
    $scope.noStores=false;
  });
  var geoQuery;
  $scope.pos={};
  $scope.pos.lat=0;
  $scope.pos.lon=0;
  $scope.noStores=false;
  if($stateParams.id == 't')
  {
    var firebaseRef = firebase.database().ref().child('geo_lojas');

  }else{
      var firebaseRef = firebase.database().ref().child('geo_lojas_cat').child($stateParams.id);
  }

  var geoFire = new GeoFire(firebaseRef);
  var ref = geoFire.ref();
  firebase.auth().onAuthStateChanged(function(user) {
    if (user)
    {
      $scope.user = user;
    }
  });
  function onSuccessPos(position) {

      $scope.pos.lat = position.coords.latitude;
      $scope.pos.lon= position.coords.longitude;
      //alert('passou2');
      //-22.5108
      //-43.1844

      //console.log();
      user = firebase.auth().currentUser;
      //console.log(user);
      //console.log($scope.lojaId);
      $scope.countLine=0;
      //firebase.auth().onAuthStateChanged(function(user) {
        if (user){
          $scope.countLine++;
          $scope.user = user;
          $scope.lojas=[];
          firebase.database().ref().child('users').child(user.uid).once("value", function(snapshotuser) {
            $scope.datauser = snapshotuser.val();

            var raio = snapshotuser.val().raio || 50;
            raio = parseInt(raio);
            geoQuery = geoFire.query({
              center: [$scope.pos.lat, $scope.pos.lon],
              radius: raio
            });
            $scope.hasStore = false;


            var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location) {
              //console.log(location);
                $scope.hasStore = true;
                $scope.noStores=false;
                $scope.temloja='tem';
                $scope.showLoading();


                if($stateParams.id == 't')
                {
                  firebase.database().ref().child('users').child(key).once("value", function(snapshot) {
                    $scope.segue='N';
                    //console.log(snapshot.val());
                    $timeout(function() {
                      $('#filtro').val('');
                      $('#filtro').trigger('change');
                      //$('#filtro').focus();
                      $scope.hideLoading();
                    },3500);
                    firebase.database().ref().child('lojas_seguidores').child(key).orderByValue().equalTo($scope.user.uid).once("value", function(snapshot2) {
                      if(snapshot2.val() != null){
                        //console.log(snapshot2.val());
                        $scope.segue='S';
                        //$scope.hasStore =true;
                        //$scope.noStores=false;
                      }else{
                        //$scope.hasStore = false;
                        //$scope.noStores=true;
                      }
                      //console.log(snapshot.val());
                      //console.log('aqui');
                      dadosLojas = {
                        'email':snapshot.val().email,
                        //'endereco':snapshot.val().endereco,
                        'foto':snapshot.val().foto,
                        'nome':snapshot.val().nome,
                        'categoriaNome':returnCategoria(snapshot.val().categoria),
                        'categoria':snapshot.val().categoria,
                        'rudovip':snapshot.val().rudovip,
                        'desconto':snapshot.val().desconto,
                        'porcentagem':snapshot.val().porcentagem,
                        'condicoes':snapshot.val().condicoes,
                        'endereco':snapshot.val().endereco,
                        'bairro':snapshot.val().bairro,
                        'cidade':snapshot.val().cidade,
                        'uf':snapshot.val().uf,
                        'telefone1':snapshot.val().telefone1,
                        'telefone2':snapshot.val().telefone2,
                         'id':key,
                         'segue':$scope.segue,
                         raio:50,
                      }
                      if($scope.lojas.length < 5)
                      {
                        $scope.lojas.unshift(dadosLojas);
                      }else
                      {
                        $scope.lojas.unshift(dadosLojas);
                      }
                      $scope.hideLoading();
                      //console.log(snapshot.key);
                    });
                      $scope.hideLoading();
                     //$scope.lojas.push(dadosLojas);
                     //console.log($scope.lojas);
                  });
                }else
                {
                  firebase.database().ref().child('geo_lojas_cat').child($stateParams.id).child(key).child('dados').once("value", function(snapshot) {
                    $scope.segue='N';

                    $timeout(function() {
                      $('#filtro').val('');
                      $('#filtro').trigger('change');
                      $scope.hideLoading();
                      //$('#filtro').focus();
                    },3000);

                    firebase.database().ref().child('lojas_seguidores').child(key).orderByValue().equalTo($scope.user.uid).once("value", function(snapshot2) {
                      if(snapshot2.val() != null){
                        //console.log(snapshot2.val());
                        $scope.segue='S';
                      }else{
                        $scope.noStores=true;
                      }
                      firebase.database().ref().child('users').child(key).once("value", function(snapshot3) {
                        if(snapshot3.val() != null){
                          //console.log(snapshot3.val());
                          //console.log(returnCategoria($stateParams.id));
                          //console.log($stateParams.id);
                          dadosLojas = {
                            'email':snapshot.val().email,
                            'endereco':snapshot.val().endereco,
                            'foto':snapshot3.val().foto,
                            'nome':snapshot.val().nome,
                            'categoriaNome':returnCategoria($stateParams.id),
                            'telefone':snapshot.val().telefone,
                             'id':key,
                             'segue':$scope.segue,
                             raio:50,
                          }
                          $scope.lojas.unshift(dadosLojas);

                          $scope.hideLoading();
                        }
                      });

                      //console.log(snapshot.key);
                    });
                    $scope.hideLoading();
                     //$scope.lojas.push(dadosLojas);
                     //console.log($scope.lojas);
                  });
                }



             });

          });
          $scope.hideLoading();
          // //console.log(onKeyEnteredRegistration);
        }else{
          $scope.hideLoading();
        }

      //});

  };

    // onError Callback receives a PositionError object
  function onErrorPos(error) {
      $scope.hideLoading();

      calldialog();
      $scope.posErro=error;
      //alert(error);
  }
  //$scope.moredata = false;

  /*$scope.loadMoreData=function()
  {
     if(typeof $scope.lojas[0] != "undefined")
     {
       $scope.lojas.push($scope.lojas[0]);
       $scope.lojas.shift();
       $scope.$broadcast('scroll.infiniteScrollComplete');
     }else{
        $timeout(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.moredata=true;
        },3000);
     }


  };*/
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.verFila=function(id)
  {

  }
  $scope.seguirEstabelecimento=function(id)
  {
    $scope.showLoading();
    $scope.lojaId = id;

    user = firebase.auth().currentUser;
    //console.log($scope.lojaId);
    $scope.countLine=0;
    //firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;
        //console.log();
        firebase.database().ref().child('lojas_seguidores').child($scope.lojaId).orderByValue().equalTo(user.uid).once("value", function(snapshot) {
          if(snapshot.val() != null){
            $.each(snapshot.val(), function (key, val) {
                firebase.database().ref('lojas_seguidores/'+$scope.lojaId+'/'+key).remove();
                firebase.database().ref('usuarios_favoritos').child(user.uid).child($scope.lojaId).remove();
                $('#seguir'+id).removeClass('segueS');
                $('#seguir'+id).removeClass('segueN');
                $('#seguir'+id).addClass('segueN');
            });
            $scope.hideLoading();
          }else{
            $('#seguir'+id).removeClass('segueN');
            $('#seguir'+id).removeClass('segueS');
            $('#seguir'+id).addClass('segueS');
            firebase.database().ref().child('lojas_seguidores').child($scope.lojaId).push(user.uid);
            firebase.database().ref().child('usuarios_favoritos').child(user.uid).child($scope.lojaId).push($scope.lojaId);
          }
          $scope.hideLoading();
          //console.log(snapshot.key);
        });
      }

      //$scope.hideLoading();
    //});

  }

}])


.controller('configurarSenhasCtrl', ['$scope','$timeout','$ionicSideMenuDelegate', '$stateParams','$location','$ionicLoading','$ionicHistory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$timeout,$ionicSideMenuDelegate, $stateParams,$location,$ionicLoading,$ionicHistory) {

  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });

  userLoggedOn = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  $ionicSideMenuDelegate.canDragContent(false);
  var user="";
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };
  $scope.retornaNome = function(num) {
    switch (num) {
      case 1:
        return 'Comum';
        break;
        case 2:
          return 'Prioritária';
          break;
          case 3:
            return 'Manual';
            break;
      default:

    }
  }
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 3000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
    $scope.showLoading();

    user = firebase.auth().currentUser;
    $scope.countLine=0;
    //firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;
        firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
          $scope.datauser = snapshot.val();
          //console.log(snapshot.val());
        });
        // User is signed in.
        //console.log(user);
          $scope.items =[];
          firebase.database().ref().child('geo_filas').child(user.uid).on("value", function(snapshot) {
            if(snapshot.val() != null){
              //console.log(snapshot.val());
              $scope.items.push(snapshot.val());
              //console.log($scope.items);
            }else{
              $scope.totalItens =$scope.items.length;
            }
            $scope.hideLoading();
            //  //console.log($scope.items);

          });

      } else {
        // No user is signed in.
        $location.path('/page5');
      }
    //});

  });
  $scope.hideLoading();

  $scope.irEditarFila = function(texto) {
    $location.path('/cadastrarfilas/'+texto);
  }
  $scope.showTrueFalse = function(texto) {
  //  //console.log(texto);
    if(texto== true){
      return 'Ativa';
    }else{
      return 'Inativa';
    }
  }

}])


.controller('gerarSenhasCtrl', ['$scope', '$ionicSideMenuDelegate','$stateParams','$ionicPopup','$location','$ionicLoading','$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $ionicSideMenuDelegate,$stateParams,$ionicPopup,$location,$ionicLoading,$timeout) {

  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
          $('#filtro').val('');
          $('#filtro').trigger('change');

          $('#filtro2').val('');
          $('#filtro2').trigger('change');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });


  $scope.limite =1;
  $scope.tituloPagina='';
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //$scope.conectDiv=true;
    $scope.showLoading();

    //console.log('entrou3');
    user = firebase.auth().currentUser;
    $scope.datauser = '';
    userLoggedOn = user;
    firebase.auth().onAuthStateChanged(function(userLoggedOn) {
      if(!userLoggedOn){
        $location.path('/login')
      }
    });

    //console.log($scope.datauser);
    $scope.countLine = 0;
  //  firebase.auth().onAuthStateChanged(function(user) {
      if (user)
      {

        $scope.countLine++;
        //$scope.showLoading();
        //console.log('contador de linhas da 1148 é :'+$scope.countLine);
        $timeout(function() {
            //console.log('aqui1');
        firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
          $scope.datauser = snapshot.val();
          //console.log(snapshot.val());
          //$scope.showLoading();
          //console.log('aqui2');
          if(snapshot.val().role ==2){
              $scope.tituloPagina='Gerar Senhas';
              //console.log('aqui3');
                firebase.database().ref().child('geo_filas').child(user.uid).once("value", function(snapshot) {
                  //console.log('aqui4');
                  $scope.items = [];
                    if(snapshot.val() != null ){
                      $scope.items.push(snapshot.val());
                      //console.log($scope.items);
                    }else{
                      $scope.totalItens =$scope.items.length;
                    }
                    $scope.hideLoading();
                    firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
                      if(snapshot.val() != null ){
                        $scope.limite = snapshot.val().limit;
                      }
                    },function(error) {
                      $scope.hideLoading();
                    });
                },function(error) {
                  $scope.hideLoading();
                });

          }else{
            $scope.tituloPagina='Pegar Senha';
            $scope.showLoading();
            //console.log('aqui');
            firebase.database().ref().child('categorias').orderByChild('categorias').once("value", function(snapshot) {
              //console.log('aqui2');
                if(snapshot.val() != null ){
                  //console.log('aqui3');
                  $scope.categorias = snapshot.val();
                  $scope.optCategorias = [];
                  $.each($scope.categorias, function(key, value){
                    if(value != '' && typeof value != 'undefined' && typeof value != undefined &&  value != null){

                        $scope.optCategorias.push({'categoria': value,'id':key});
                    }
                  });

                  //console.log($scope.optCategorias);
                  $timeout(function () {
                    //console.log('aqui4');
                    $('#filtro').val('');
                    $('#filtro').trigger('change');
                    $scope.hideLoading();
                  }, 1000);

                }else{
                  $timeout(function () {

                    $scope.hideLoading();
                  }, 2000);

                }



              //  $('#filtro').focus();

            },function(error){
              //console.log('aqui 5');
                $scope.hideLoading();
            });
          }
        }, function(error){
          //console.log('aqui 6');
            $scope.hideLoading();
        });

      },2500);
      }else{
        //console.log('aqui3');
        $scope.tituloPagina='Pegar Senha';
        $scope.showLoading();
        $timeout(function () {
          $scope.showLoading();
          user = firebase.auth().currentUser;
          if(user)
          {

            $scope.showLoading();
            firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
              $scope.datauser = snapshot.val();

              if(snapshot.val().role ==2)
              {
                $scope.tituloPagina='Gerar Senhas';
                //console.log('aqui3');
                  firebase.database().ref().child('geo_filas').child(user.uid).once("value", function(snapshot) {
                  //  //console.log('aqui4');
                    $scope.items = [];
                      if(snapshot.val() != null ){
                        $scope.items.push(snapshot.val());
                    //    //console.log($scope.items);
                      }else{
                        $scope.totalItens =$scope.items.length;
                      }
                      $scope.hideLoading();
                      firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
                        if(snapshot.val() != null ){
                          $scope.limite = snapshot.val().limit;
                        }
                      },function(error) {
                        $scope.hideLoading();
                      });
                  },function(error) {
                    $scope.hideLoading();
                  });

              }


            });



            //console.log($scope.datauser);
            $scope.showLoading();
            firebase.database().ref().child('categorias').orderByChild('categorias').once("value", function(snapshot) {
              //console.log('aqui2');
              //$scope.showLoading();
                if(snapshot.val() != null ){

                  $scope.categorias = snapshot.val();
                  $scope.optCategorias = [];
                  $.each($scope.categorias, function(key, value){
                    if(value != '' && typeof value != 'undefined' && typeof value != undefined &&  value != null){
                      $scope.optCategorias.push({'categoria': value,'id':key});
                    }
                  });

                  //console.log($scope.optCategorias);
                  $timeout(function () {
                    //console.log($scope.optCategorias);
                    $('#filtro').val('');
                    $('#filtro').trigger('change');
                    $scope.hideLoading();
                  }, 3000);

                }else{
                  $timeout(function () {
                    $scope.hideLoading();
                  }, 2000);

                }
              //  $('#filtro').focus();

            }, function(error){
              //console.log('aqui 5');
                $scope.hideLoading();
            });
            //console.log('aqui1');
          }else{
            $scope.showLoading();
          }


        }, 3000);


        //console.log('aqui');
      //  document.location.href = '#/page5';
      }
    //});
    $timeout(function() {
      //$('#filtro').val('');
      //$('#filtro').trigger('change');
      //$('#filtro').focus();
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });
    },3000);

    //$scope.titulo='Gerar Senhas';
    //$scope.hideLoading();

  });
  $scope.gerarSenhasCategorias = function(texto) {

    $location.path('/gerarsenhascategorias/'+texto);
  }
  $scope.removeUser = function() {
    $scope.showUserNotFind = false;
    $scope.userToNotify =[];
    $('#busca').val('');

  }
  $scope.showMensageuser = function(search) {
    if($scope.userToNotify == null || $scope.userToNotify == '' )
    {
        $scope.showUserNotFind = true;
      $timeout(function() {
        $scope.showUserNotFind = false;
      },9000);

    }else
    {
      $scope.showUserNotFind = false;
    }
  }
  $scope.retornaNome = function(num) {
    switch (num) {
      case 1:
        return 'Comum';
        break;
        case 2:
          return 'Prioritária';
          break;
          case 3:
            return 'Manual';
            break;
      default:

    }
  }
  $scope.userToNotify='';
  $scope.buscarUsuarios = function(search) {
    $scope.showUserNotFind = false;
    if(typeof search != 'undefined' )
    {
      busca =  search.split("@");
      //var rootRef = firebase.database.ref();
      //var usersRef = rootRef.child("users");
//      //console.log(usersRef.parent.isEqual(rootRef));
    firebase.database().ref().child('users').orderByChild('email').equalTo(search).on("value", function(snapshot) {

      $scope.userToNotify=snapshot.val();
    //  //console.log(snapshot.val());
    });
      if(busca.length == 1){

      }


      //console.log(search);
    }


  }
  $scope.pos={};
  $scope.pos.lat=0;
  $scope.pos.lon=0;
  $scope.post={};
  $scope.imageUrl='';
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...'
    }).then(function(){

    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){

    });
  };




  $scope.showAlert = function(texto) {
    var alertPopup = $ionicPopup.alert({
      title: texto.titulo,
      template: texto.mensagem
    });
    alertPopup.then(function(res) {
    });
  };
  $scope.contador='';
  $scope.contaNumero = function(id){
    setDateTime();
    user = firebase.auth().currentUser;
    $scope.contadorAuxSenha = 0;
    $scope.countLine=0;
    //firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;

          if($scope.contadorAuxSenha==0){
            $scope.contadorAuxSenha ++
            firebase.database().ref().child('geo_filas').child(user.uid).child(id).once("value", function(snapshot){
              if(snapshot.val() != null)
              {
                fila =snapshot.val();
                $scope.contador = parseInt(fila.numero_contador) + 1;
              //  //console.log($scope.contador);
                user = firebase.auth().currentUser;
                var mykey = firebase.database().ref('geo_filas_senhas/' + user.uid).push();
                var prefixo = fila.prefixo || '';
                var contador = $scope.contador || 1;
                var nome  = fila.nome || 'S/N';

                var posFixoRestaurante = '';
                if(typeof $scope.datauser.categoria != 'undefined'){
                  if($scope.datauser.categoria== 1){

                    posFixoRestaurante= $('#qtdPessoas').val();
                    if(typeof posFixoRestaurante != 'undefined' && posFixoRestaurante != '? undefined:undefined ?'){
                        posFixoRestaurante = ' P-'+ posFixoRestaurante;
                    }else {
                        posFixoRestaurante = ' P-'+ 1;
                    }

                  }
                }

                firebase.database().ref('geo_filas_senhas/' + user.uid).push({
                  pos:contador, numero:prefixo + $scope.contador + posFixoRestaurante, ativo:'true', tipo:nome,data:getDate(userDateTimeFull),user_id:$scope.user_id ,
                }, function(error) {
                    $scope.hideLoading();
                    $scope.texto={};
                    if(error){
                      $scope.texto.titulo ='Ops! Algo deu errado.';
                      $scope.texto.mensagem ='Não conseguimos efetuar a operação.';
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }else
                    {
                      $scope.texto.titulo ='Tudo certo!';
                      $scope.texto.mensagem ='Sua senha é  '+ prefixo + contador + posFixoRestaurante;
                      firebase.database().ref('geo_filas').child(user.uid).child(id).child('/numero_contador').set( $scope.contador);


                      if($scope.user_id  != '' && $scope.user_id  != null)
                      {

                        firebase.database().ref('senhas_usuarios/' + $scope.user_id).push({
                          pos:contador, numero:prefixo + $scope.contador + posFixoRestaurante, ativo:'true', tipo:nome,data:getDate(userDateTimeFull),loja_id:$scope.user_id ,
                        }, function(error) {

                        });
                      }
                      $scope.hideLoading();
                       $('#qtdPessoas').val('');
                      $scope.showAlert($scope.texto);
                    }
                });
              }else
              {
                  $scope.texto={};
                  $scope.texto.titulo ='Ops! Que embaraçoso';
                  $scope.texto.mensagem ='Algo deu errado, a operação não foi efetuada.';
                  $scope.hideLoading();
                  $scope.showAlert($scope.texto);
              }
            });

          }
        }
    //});

  }

  $scope.contaSenha = function()
  {
    setDateTime();
    $scope.countLine=0;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        $scope.countLine++;

        user = firebase.auth().currentUser;
        var ref = firebase.database().ref("senhas_gratis/"+user.uid+'/'+ year +'/'+ month);
        ref.once("value")
          .then(function(snapshot) {
            var a = snapshot.numChildren(); // 1 ("name")
            $scope.contadorSenha = snapshot.child(day).numChildren(); // 2 ("first", "last")
          //  //console.log($scope.contadorSenha);
            //return b;
          });
      }
    });

  }
  $scope.contadorSenha = $scope.contaSenha();
  $scope.setlogsenha = function()
  {
    setDateTime();
    //$timeout(function () {
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      user = firebase.auth().currentUser;
      firebase.database().ref('senhas_gratis/' + user.uid +'/' + year +'/'+ month+'/'+ day ).push({qtd:1});
    //}, 300);

  }
  //$scope.setlogsenha();
  $scope.gerarSenha = function(value, id)
  {
      $scope.showLoading();
      user = firebase.auth().currentUser;
      var user_id = $('#user_id').val();
      $scope.user_id = $('#user_id').val() || null;
      user_id = user_id || null;
      $('#user_id').val('');
      $('#busca').val('');
      $scope.userToNotify =[];
      $scope.contaSenha();
      $scope.texto= {};

      if( $scope.contadorSenha  >= $scope.limite)
      {
        $scope.texto.titulo ='Aviso';
        $scope.texto.mensagem ='Limite de senhas diárias excedido. Aumente o limite em configurações -> Minha Conta.';
        $scope.hideLoading();
        $scope.showAlert($scope.texto);

      }else{
        $scope.setlogsenha();
        $scope.contaNumero(id);
        estab = user.displayName;
        estab = estab || user.email;
        if(user_id != '' && user_id !=null){
            sendNotificationTouUserNewNumber(user_id,estab);
        }

      }
  }
  $scope.senhamanual='';
  $scope.gerarSenhaManual = function(value, id, senhamanual)
  {
      setDateTime();
      $scope.showLoading();
      //console.log('aqui');

      var user_id = $('#user_id').val();
      $scope.user_id = $('#user_id').val() || null;
      user_id = user_id || null;
      $('#user_id').val('');
      $('#busca').val('');
      $scope.userToNotify =[];
      if(senhamanual != '')
      {
        user = firebase.auth().currentUser;
        $scope.setlogsenha();
        $scope.existNum ='';
        $scope.contaSenha();
        $scope.texto= {};
        //console.log('aqi232');
        if( $scope.contadorSenha  >= $scope.limite)
        {
          $scope.texto.titulo ='Aviso';
          $scope.texto.mensagem ='Limite de senha diárias excedido.';
          $scope.hideLoading();
          $scope.showAlert($scope.texto);

        }else{
          firebase.database().ref().child('geo_filas_senhas').child(user.uid).orderByChild("numero").startAt(senhamanual).endAt(senhamanual).once("value", function(snapshot) {
            if(snapshot.val() != null && snapshot.val() != 'null'  && snapshot.val() != ''){
              $scope.texto={};
              $scope.texto.titulo ='Ops! Algo deu errado.';
              $scope.texto.mensagem ='Este número já está em uso.';
              $scope.hideLoading();
              $scope.showAlert($scope.texto);
            }else{
              var mykey = firebase.database().ref('geo_filas_senhas/' + user.uid).push();
              firebase.database().ref('geo_filas_senhas/' + user.uid +'/' + mykey.key ).set({
                pos:'1', numero:senhamanual, ativo:'true',tipo:value.nome,data:getDate(userDateTimeFull),user_id:user_id,
              }, function(error) {
                  $scope.texto={};
                  if(error){
                    $scope.texto.titulo ='Ops! Algo deu errado.';
                    $scope.texto.mensagem ='Operaçao não efetuada.';
                    $scope.hideLoading();
                    $scope.showAlert($scope.texto);
                  }else
                  {
                    $scope.texto.titulo ='Tudo Certo';
                    $scope.texto.mensagem ='Sua senha é '+ senhamanual;
                    estab = user.displayName;
                    estab = estab || user.email;
                    if(user_id != '' && user_id !=null){
                      sendNotificationTouUserNewNumber(user_id,estab);
                    }
                    $scope.hideLoading();
                    $scope.showAlert($scope.texto);
                  }
              });
            }
          });

        }

      }else{
        $scope.texto={};
        $scope.texto.titulo ='Ops! Algo deu errado.';
        $scope.texto.mensagem ='O valor do campo manual não pode ficar vazio.';
        $scope.hideLoading();
        $scope.showAlert($scope.texto);
      }
  }
}])

.controller('configuraEsCtrl', ['$scope','$ionicSideMenuDelegate', '$stateParams','$location','$ionicLoading','$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$ionicSideMenuDelegate, $stateParams,$location,$ionicLoading,$timeout) {
  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;

  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });
  userLoggedOn = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 15000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.titulo ='';
  $scope.$on('$ionicView.leave', function(){
      //$ionicSideMenuDelegate.canDragContent(true);
      //$('.ion-navicon').show();
    });
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    $scope.showContent= false;
    $timeout(function () {
      $scope.showContent= true;
    }, 2500);
    $scope.showLoading();
    var lojasAux = {};
    $scope.lojas =[];
    $scope.noticket = false;
    $scope.countLine = 0;
    //firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;
      $scope.datauser = user;

      if (user){
        $scope.countLine++;
        //console.log('contador da linha 1525 é :'+$scope.countLine);
        $timeout(function() {

          firebase.database().ref().child('users').child(user.uid).once("value", function(snapshotuser){

            $scope.datauser = snapshotuser.val();
            //console.log($scope.datauser);
            if($scope.datauser.role == 2)
            {
              $scope.titulo ='Minha Fila';
              firebase.database().ref().child('geo_filas_senhas_usadas').child(user.uid).limitToLast(1).on("child_added", function(snapshot) {
                if(snapshot.val() != null ){
                  $scope.senha=snapshot.val();
                  $scope.hideLoading();
                    $scope.noticket = false;
                }else{
                  $scope.noticket = true;
                  $scope.hideLoading();
                }
              },function(error) {
                $scope.hideLoading();
              });
              $scope.senhasAnterioresAux=[]
              var ref = firebase.database().ref().child('geo_filas_senhas_usadas').child(user.uid);

              $scope.senhasAnteriores=[];
              ref.orderByKey().limitToLast(10).on("child_added", function(snapshot) {
                if(snapshot.val() != null ){

                    $scope.senhasAnteriores.unshift(snapshot.val());

                  //countRef++;

                }
              },function(error) {
                $scope.hideLoading();
              });
              $('#filtro').val(' ');
            }else
            {
              $scope.titulo ='Favoritos';
              $scope.hasLojas='S';
              firebase.database().ref().child('usuarios_favoritos').child(user.uid).once("value", function(snapshot) {
                var lojasAux = {};

                if(snapshot.val() != null ){
                  $scope.lojas =[];
                  lojasAux.segue='S';
                  $.each(snapshot.val(), function (key, val) {
                    $scope.hasLojas='S';
                    firebase.database().ref().child('users').child(key).once("value", function(snapshot2) {
                      if(snapshot2.val() != null){
                          lojasAux = snapshot2.val();
                           lojasAux.key = key;
                           lojasAux.segue='S';
                           lojasAux.categoriaNome= returnCategoria(snapshot2.val().categoria);
                            //console.log(snapshot2.val());
                           $scope.lojas.push(lojasAux);
                          $timeout(function(){
                            $('#filtro2').val('');
                              $scope.hideLoading();
                            //console.log('her34');
                          },1000);

                          //console.log($scope.lojas);
                      }else{

                        lojasAux.segue='N';
                        $scope.hasLojas='N';
                      }
                    },function(error) {
                      $scope.hideLoading();
                    });

                  });
                  //console.log(snapshot.val());
                  //$scope.lojas=snapshot.val();
                  $scope.hideLoading();
                }else{
                    $scope.hasLojas='N';
                    $scope.hideLoading();
                }
              }, function(error) {
                  $scope.hideLoading();
              });
            }

          }, function(error) {
            //console.log('error aqui');
            $scope.hideLoading();
          });

          //$scope.hideLoading();
        },2500);
          //$scope.showLoading();

      } else {
          $scope.hideLoading();
          $location.path('/page5')

      }

    //});

  });
  $scope.seguirEstabelecimento=function(id)
  {
    $scope.showLoading();
    $scope.lojaId = id;

    user = firebase.auth().currentUser;
    //console.log($scope.lojaId);
    $scope.countLine=0;
  //  firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;
        //console.log('contador da linha 1615 é :'+$scope.countLine);
        //console.log();
        firebase.database().ref().child('lojas_seguidores').child($scope.lojaId).orderByValue().equalTo(user.uid).once("value", function(snapshot) {
          if(snapshot.val() != null){
            $.each(snapshot.val(), function (key, val) {
                firebase.database().ref('lojas_seguidores/'+$scope.lojaId+'/'+key).remove();
                firebase.database().ref('usuarios_favoritos').child(user.uid).child($scope.lojaId).remove();
                $('#seguir'+id).removeClass('segueS');
                $('#seguir'+id).removeClass('segueN');
                $('#seguir'+id).addClass('segueN');
            });
            $scope.hideLoading();
          }else{
            $('#seguir'+id).removeClass('segueN');
            $('#seguir'+id).removeClass('segueS');
            $('#seguir'+id).addClass('segueS');
            firebase.database().ref().child('lojas_seguidores').child($scope.lojaId).push(user.uid);
            firebase.database().ref().child('usuarios_favoritos').child(user.uid).child($scope.lojaId).push($scope.lojaId);
            $scope.hideLoading();
          }
          //console.log(snapshot.key);
        });

      }

      //$scope.hideLoading();
    //});

  }
   $scope.moredata = false;

   $scope.loadMoreData=function()
   {

      if(typeof $scope.senhasAnterioresAux[0] != "undefined")
      {

        $scope.senhasAnteriores.push($scope.senhasAnterioresAux[0]);
        $scope.senhasAnterioresAux.shift();

        $scope.$broadcast('scroll.infiniteScrollComplete');
      }else{

         $timeout(function() {
           $scope.$broadcast('scroll.infiniteScrollComplete');
           $scope.moredata=true;
         },3000);
      }


   };

  /*$scope.clicarCorpo = function()
  {
    //console.log('aqui');
    if($('.tabs').is(":visible")){
      $scope.esconder();
    }else{
      $scope.mostrar();
    }
  }*/
  $scope.mostrar = function()
  {
    $('.nav-bar-container').fadeIn(1000);
    $('.tabs').fadeIn(1000);
  }
  $scope.esconder = function()
  {
    $('.nav-bar-container').fadeOut(1000);
    $('.tabs').fadeOut(1000);
  }



//alert();
}])

.controller('menuCtrl', ['$scope','$ionicSideMenuDelegate', '$stateParams','$ionicLoading','$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$ionicSideMenuDelegate, $stateParams,$ionicLoading,$timeout) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //viewData.enableBack = true;
    firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;
      $scope.user = firebase.auth().currentUser;

      firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
        $scope.datauser = snapshot.val();
        //console.log(snapshot.val());
      });
    });
  });

  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 3000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.logoff = function() {

    firebase.auth().signOut().then(function() {
      // Sign-out successful.

    }, function(error) {
      // An error happened.
    });
    //$timeout(function() {
      //  document.location.href = '#/page5';
    //},3000);


  }
}])


.controller('loginCtrl', ['$scope','$timeout','$location','$cordovaOauth', '$stateParams','$ionicLoading','$ionicHistory','$timeout','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$timeout,$location,$cordovaOauth, $stateParams,$ionicLoading,$ionicHistory,$timeout,$ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(false);
    $scope.showLoading = function() {
      $ionicLoading.show({
        template: 'Carregando...',
        duration: 6000
      }).then(function(){
         //console.log("The loading indicator is now displayed");
      });
    };
    $scope.hideLoading = function(){
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });
    };
    /*$scope.ionicGoBack = function() {
      $ionicHistory.goBack();
    };*/

    var user = firebase.auth().currentUser;
    $scope.$on('$ionicView.enter', function(){
      $ionicSideMenuDelegate.canDragContent(false);
      $('.ion-navicon').hide();
    });
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {

      viewData.enableBack = false;
      $scope.notToShow = false;
      $scope.showContent = false;
      $timeout(function () {
        $scope.showContent = true;
      }, 6000);
      //$scope.showLoading();
      user = firebase.auth().currentUser;

      //console.log(user);
      $scope.countLine=0;
      firebase.auth().onAuthStateChanged(function(user) {
        //alert('passou1');
        $scope.showLoading();
          if(user){

              $scope.countLine++;

              $scope.user = firebase.auth().currentUser;
              firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
                //console.log('aqui2');
                $scope.datauser = snapshot.val();
                //$location.path('#/page1/page3');;
                document.location.href = '#/page1/page3';
              }, function(error) {
                //document.location.href = '#/page1/page3';
              });


          }

      });
    });

}])
.controller('login2Ctrl', ['$scope','$location','$cordovaOauth', '$stateParams','$ionicLoading','$ionicHistory','$timeout','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$location,$cordovaOauth, $stateParams,$ionicLoading,$ionicHistory,$timeout,$ionicSideMenuDelegate) {
$ionicSideMenuDelegate.canDragContent(false);
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 3000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };

  var user = firebase.auth().currentUser;
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
    $('.ion-navicon').hide();
  });



  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {

    viewData.enableBack = true;
    $scope.notToShow = false;
    //$scope.showLoading();
    user = firebase.auth().currentUser;

    //console.log(user);
    $scope.countLine=0;
    firebase.auth().onAuthStateChanged(function(user) {
      //alert('passou1');

        if(user){

            $scope.countLine++;

            $scope.user = firebase.auth().currentUser;
            firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
            //  //console.log('aqui2');
              $scope.datauser = snapshot.val();
              //$location.path('#/page1/page3');;
              document.location.href = '#/page1/page3';
            }, function(error) {
              //document.location.href = '#/page1/page3';
            });


        }

    });
  });


    $scope.loginTwitter = function(user) {
      $scope.showLoading();
      $('.aviso-login').html('');
      var provider = new firebase.auth.TwitterAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
            // You can use these server side with your app's credentials to access the Twitter API.
            var token = result.credential.accessToken;
            var secret = result.credential.secret;
            // The signed-in user info.
            var user = result.user;

            document.location.href = '#/page1/page3';
            // ...
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            $('.divAvisoLogin').show();
            $('.aviso-login').html('Ops, não encontramos o seu cadastro.');
          });
        $timeout(function() {
          firebase.auth().onAuthStateChanged(function(user) {
            user = firebase.auth().currentUser;
            $scope.user = firebase.auth().currentUser;
            firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
              //console.log(snapshot.val());
            });
            document.location.href = '#/page1/page3';
          });
        },1000);

    }

    $scope.loginGoogle = function(user) {
      $scope.showLoading();
      $('.aviso-login').html('');

      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          //console.log(user);
          document.location.href = '#/page1/page3';
          // ...
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          $('.divAvisoLogin').show();
          $('.aviso-login').html('Ops, não encontramos o seu cadastro.');
          // ...
        });
        $timeout(function() {
          firebase.auth().onAuthStateChanged(function(user) {
            user = firebase.auth().currentUser;
            $scope.user = firebase.auth().currentUser;
          //  //console.log(user);

            document.location.href = '#/page1/page3';
          });
        },1000);
    }
    $scope.esqueciasenha = function(user) {
        $scope.showLoading();
        $('.divAvisoLogin').hide();
        if (typeof user == 'undefined') {
          $('.aviso-login').html('Ops. Digite o email');
          $('.divAvisoLogin').show();
        }else if(user.email == '' || user.email == null){
          $('.aviso-login').html('Ops. Digite o email');
          $('.divAvisoLogin').show();
        }else{
          var auth = firebase.auth();


          auth.sendPasswordResetEmail(user.email).then(function() {
            $('.aviso-login').html('Tudo certo! Um e-mail foi enviado para a redeficição da sua senha.');
            $('.divAvisoLogin').show();
          }, function(error) {
            $('.aviso-login').html('Ops! Ocorreu um erro e não conseguimos continuar com a redefinição da sua senha.');
            $('.divAvisoLogin').show();
          });
        }


    }
    $scope.loginManual = function(user) {
      $scope.showLoading();
      $('.divAvisoLogin').hide();
      if(typeof user == 'undefined'){
        $('.aviso-login').html('Ops. Digite o Email e Senha');
        $('.divAvisoLogin').show();
      }else{
      //  //console.log(user);
        firebase.auth().signInWithEmailAndPassword(user.email, user.password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          //console.log(errorCode.length);
          if(errorCode.length == 19){
              $('.divAvisoLogin').show();
              $('.aviso-login').html('Algo deu errado, verifique seu email e senha.');
          }else if (errorCode.length == 27) {
            $('.divAvisoLogin').show();
            $('.aviso-login').html('Sem conexão com a internet.');
          }

        });
        $timeout(function() {
          firebase.auth().onAuthStateChanged(function(user) {
            user = firebase.auth().currentUser;
            $scope.user = firebase.auth().currentUser;
            firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
              //console.log(snapshot.val());
              document.location.href = '#/page1/page3';
            });

          });
        },1000);
      }
    }
    $scope.loginFacebook = function(user) {
      $('.divAvisoLogin').hide();
      var auth = new firebase.auth.FacebookAuthProvider();
     $cordovaOauth.facebook("111991969424960", ["email"]).then(function(result) {

         var credential = firebase.auth.FacebookAuthProvider.credential(result.access_token);
         firebase.auth().signInWithCredential(credential).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              if (errorCode === 'auth/account-exists-with-different-credential') {
                //alert('Email já está associado com uma outra conta.');
                $('.divAvisoLogin').show();
                $('.aviso-login').html('Email já está associado com uma outra conta.');
                // Handle account linking here, if using.
              } else {
                console.error(error);
              }


         });
         user = firebase.auth().currentUser;
         firebase.auth().onAuthStateChanged(function(user) {
           $scope.showLoading();
           user = firebase.auth().currentUser;
           $scope.user = firebase.auth().currentUser;
           $timeout(function() {

             firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
                if(snapshot.val() != null){
                    document.location.href = '#/page1/page3';
                }else{
                  $('.divAvisoLogin').show();
                  $('.aviso-login').html('Algo deu errado, esta conta ainda não possui cadastro.');

                  var user = firebase.auth().currentUser;
                  user.delete().then(function() {
                    // User deleted.
                  }, function(error) {
                    // An error happened.
                  });
                }
             },function(error){
               $scope.hideLoading();
               $('.divAvisoLogin').show();
               $('.aviso-login').html('Algo deu errado, por favor verifique a sua conexão com a internet.');
             });

           },5000);


         });

     }, function(error) {
         //alert("ERROR: " + error);
     });


    }
}])

.controller('cadastrarfilasCtrl', ['$scope','$ionicSideMenuDelegate', '$ionicPopup', '$stateParams', '$ionicHistory', '$location','$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $ionicSideMenuDelegate,$ionicPopup, $stateParams,$ionicHistory, $location, $ionicLoading) {

  var connectedRef = firebase.database().ref(".info/connected");
  $scope.tentativas = 0;
  //$scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $scope.conectDiv=true;
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });

  userLoggedOn = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.retornaNome = function(num) {
    switch (num) {
      case 1:
        return 'Comum';
        break;
        case 2:
          return 'Prioritária';
          break;
          case 3:
            return 'Manual';
            break;
      default:

    }
  }
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      //duration: 3000
    }).then(function(){
       //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
  };
  $scope.ionicGoBack = function() {
    $ionicHistory.goBack();
  };

  var user = firebase.auth().currentUser;
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {

    viewData.enableBack = true;
    $scope.notToShow = false;
    //$scope.conectDiv=true;
    $scope.showLoading();
    firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
      $scope.datauser = snapshot.val();
      //console.log(snapshot.val());
      if($scope.datauser.role ==2){
        firebase.database().ref().child('geo_filas').child(user.uid).child($stateParams.id).on("value", function(snapshot) {
          if(snapshot.val() != null ){
            $scope.fila = snapshot.val();
            //console.log($scope.fila);
          }
          $scope.hideLoading();
        },function(error) {
          $scope.hideLoading();
        });
      }else {
        $scope.hideLoading();
      }
    },function (error) {
      $scope.hideLoading();
    });

  });
  //console.log($stateParams.id);



  $scope.pos={};
  $scope.pos.lat=0;
  $scope.pos.lon=0;
  $scope.post={};
  $scope.imageUrl='';

  var onSuccessPos = function(position) {
      $scope.pos.lat = position.coords.latitude;
      $scope.pos.lon= position.coords.longitude;
      //console.log($scope.pos.lon);
  };

    // onError Callback receives a PositionError object
  function onErrorPos(error) {
      $scope.posErro=error;
      calldialog();
  }

  navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});


  //$scope.fila.user_id ='';
  $scope.fila = [];
  if (user) {
    // User is signed in.
    //alert('1');
    //console.log(user);
    $scope.fila.user_id = user.uid;
  } else {
      $location.path('/page5')

  }

  var firebaseRef = firebase.database().ref().child('geo_filas');
  var geoFire = new GeoFire(firebaseRef);
  var ref = geoFire.ref();  // ref === firebaseRef
  //var mykey = ref.child('dados').push();
  //console.log(user.uid);
  var user = firebase.auth().currentUser
  //$scope.showConfirm();
  // An alert dialog
  $scope.showAlert = function(texto) {
    var alertPopup = $ionicPopup.alert({
      title: texto.titulo,
      template: texto.mensagem
    });
    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
      $location.path('/page2');
    });
  };

  $scope.cadastrarFila = function(fila) {
    var user = firebase.auth().currentUser
    var nome = fila.nome || null;
    var ativa = fila.ativa || false;
    var prioridade = fila.prioridade || false;
    var prioridade_qtd = fila.qtd_prioridade || 0;
    var manual = fila.manual || false;
    var numero_contador = fila.numero_contador || 0;
    var prefixo = fila.prefixo || '';
    $scope.texto= {};
    //console.log(nome);
    if(nome == null || nome == 'undefined' )
    {
      $scope.texto.titulo ='Ops! Algo deu errado.';
      $scope.texto.mensagem ='O nome não poder estar vazio.';
      $scope.showAlert($scope.texto);
    }else{
      firebase.database().ref('geo_filas/' + user.uid + '/' + $stateParams.id).set({
        nome: nome,
        ativa:ativa,
        prioridade:prioridade,
        prioridade_qtd:prioridade_qtd,
        manual:manual,
        numero_contador:numero_contador,
        prefixo:prefixo,
      }, function(error) {
          if(error){
            $scope.texto.titulo ='Ops! Foi mal!';
            $scope.texto.mensagem ='Não conseguimos desta vez.';
            $scope.showAlert($scope.texto);
          }else
          {
            $scope.texto.titulo ='Tudo certo!';
            $scope.texto.mensagem ='A configuração foi salva.';
            $scope.showAlert($scope.texto);
          }
      });
    }



  }


}])

.controller('signupCtrl', ['$scope','$cordovaOauth','$location','$firebaseObject','$firebaseAuth', '$stateParams','$ionicPopup','$ionicLoading','$timeout','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$cordovaOauth ,$location, $firebaseObject,$firebaseAuth,$stateParams,$ionicPopup,$ionicLoading,$timeout,$ionicSideMenuDelegate) {
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
    $('.ion-navicon').hide();
    user = firebase.auth().currentUser;
    //alert('passou1');
    firebase.auth().onAuthStateChanged(function(user) {
      if(user){
        //  document.location.href = '#/page1/page3';
      }
    });
  });
  $scope.$on('$ionicView.leave', function(){
      //$ionicSideMenuDelegate.canDragContent(true);
      //$('.ion-navicon').show();
    });
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
      if(user){
        $scope.showLoading();
        $timeout(function () {
          $scope.showLoading();
          //$location.path('#/page1/page3');;
          document.location.href = '#/page1/page3';
        }, 3000);
      }

    });
  });
  $scope.loginNormal = function (e) {
    $scope.user= e;
    ref.authWithPassword({
      email    : $scope.user.email,
      password : $scope.user.password
    }, function(error, authData) {
      if (error) {

      } else {
        //$location.path('#/page1/page3');;
        document.location.href = '#/page1/page3';

      //  window.location.href = '#/home';
      }
    });
  }

  $scope.showPopup = function(texto) {
    var alertPopup = $ionicPopup.alert({
     title: texto.titulo,
     template: texto.mensagem
   });

  };
  $scope.validaEmail= function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //$('.aviso-cadastro').hide();
    if(re.test(email)){
      $('.divAvisoEmail').hide();
      $('.lb-email ').removeClass('myredcolor');
      return true;
    }else {
      $('.divAvisoEmail').show();
      $('.lb-email ').addClass('myredcolor');
      return false;
    }
  }

  $scope.difpassword = function(user)
  {
    $('.aviso-cadastro').html('');
    if(typeof user !=='undefined')
    {
      if (user.password != user.cpassword && (user.password != '' && user.cpassword != '') ) {
          $('.lb-password ').addClass('myredcolor');
          $('.divAviso').show();
          return false;
      }else{
        $('.lb-password ').removeClass('myredcolor');
        $('.divAviso').hide();
        return true;
      }
    }else {
      $('.lb-password ').removeClass('myredcolor');
      $('.divAviso').hide();
      return true;
    }
  }
  $scope.validaCadastro = function(user) {
    $('.aviso-cadastro').html('');
    if(user.email == null || user.email == ''){
      $scope.texto.titulo='Ops! Algo deu errado.';
      $scope.texto.mensagem='O campo email não pode ficar vazio.';
      return false;
    }else{
      return true;
    }

  }
  $scope.validaFormulario = function(user)
  {
    $('.aviso-cadastro').html('');
    var flagValid=true;
    if($scope.difpassword(user)== false){
      flagValid= false;
    }
    if(!$scope.validaEmail(user.email)){
      flagValid= false;
    }
    if($scope.validaCadastro(user)== false){
      flagValid= false;
    }
    return flagValid;
  }
  function logUser(user)
  {
      var ref = firebase.database().ref("users");
    //  //console.log(user);
      var obj = {
          "user": user
      };
      ref.push(obj); // or however you wish to update the node

  }

  $scope.pos={};
  $scope.pos.lat=0;
  $scope.pos.lon=0;
  $scope.post={};
  $scope.imageUrl='';
  var onSuccessPos = function(position) {
      $scope.pos.lat = position.coords.latitude;
      $scope.pos.lon= position.coords.longitude;

      //console.log($scope.pos.lon);
  };

  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 3000
    }).then(function(){
      // //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
      // //console.log("The loading indicator is now hidden");
    });
  };
  $scope.showAlert = function(texto) {
    var alertPopup = $ionicPopup.alert({
      title: texto.titulo,
      template: texto.mensagem
    });
    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
      //$location.path('/page1/page10');
    });
  };

  function onErrorPos(error) {
      $scope.posErro=error;
      calldialog();
  }

  navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

  $scope.cadastrarUsuarioCliente = function(user) {
    $scope.showLoading();
    $('.aviso-cadastro').html('');

    if(typeof user != 'undefined')
    {
      //console.log('aqui');

      if($scope.validaCadastro(user)){
        if($scope.validaFormulario(user)){

          firebase.auth().createUserWithEmailAndPassword(user.email, user.password).catch(function(error) {
            // Handle Errors here.

            var errorCode = error.code;
            var errorMessage = error.message;
            var errorWeek ='auth/weak-password';
            $('.lb-email ').removeClass('myredcolor');
          //  //console.log('aqui1');
            if(errorCode.length == 18){
              $('.aviso-cadastro').html('Ops, a senha deve ter pelo menos 6 caracteres!');
              $('.divAvisoCadastro').show();
            }else if(errorCode.length == 25){
              $('.lb-email ').addClass('myredcolor');
              $('.aviso-cadastro').html('Ops, este email já se encontra em uso.');
              $('.divAvisoCadastro').show();
            }else if (errorCode.length == 27) {
              $('.divAvisoCadastro').show();
              $('.aviso-cadastro').html('Sem conexão com a internet.');
            }
            // ...
          });
          $scope.cadastrarManualCliente=1;
          firebase.auth().onAuthStateChanged(function(user) {
            if($scope.cadastrarManualCliente == 1){
              user = firebase.auth().currentUser;

                $scope.user = firebase.auth().currentUser;
                //console.log($scope.user);
                firebase.database().ref('users/' + user.uid).remove();

                firebase.database().ref('users/' + user.uid).set({
                  email: user.email,
                  active:1,
                  role:3,
                  ver_fila:true,
                  nome:user.displayName,
                  email:user.email,
                  foto:user.photoURL,
                  raio:50,
                }, function(error) {
                  if(error){
                    //console.log('erro');
                  }else{
                  }
                });
                $scope.cadastrarManualCliente=0;
                $timeout(function() {
                  //$location.path('#/page1/page3');;
                  document.location.href = '#/page1/page3';
                },1000);
            }

          });



            //});

        }
      }
    }else{
      $('.aviso-cadastro').html('Ops, digite o usuário e a senha!');
      $('.divAvisoCadastro').show();
      //console.log('aqui2');
    }
    //console.log(user);
  }
  $scope.cadastrarUsuarioFacebookCliente = function(user) {
    var auth = new firebase.auth.FacebookAuthProvider();
    $('.divAvisoCadastro').hide();
   $cordovaOauth.facebook("111991969424960", ["email"]).then(function(result) {

       var credential = firebase.auth.FacebookAuthProvider.credential(result.access_token);
       firebase.auth().signInWithCredential(credential).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            if (errorCode === 'auth/account-exists-with-different-credential') {
              //alert('Email already associated with another account.');
              // Handle account linking here, if using.
              $('.divAvisoCadastro').show();
              $('.divAvisoCadastro').html('Email já está associado com uma outra conta.');
            } else {
              console.error(error);
            }



       });


   }, function(error) {
       //alert("ERROR: " + error);
   });
   user = firebase.auth().currentUser;
   //alert('passou1');
   $scope.cadastraUsuarioFacebookFlag= 1;
   firebase.auth().onAuthStateChanged(function(user) {
     //alert('passou2');
     if($scope.cadastraUsuarioFacebookFlag == 1){
       firebase.database().ref().child('users').child(user.uid).child('email').once("value", function(snapshot) {
           //console.log(snapshot.val());
         if(snapshot.val() != null && snapshot.val() != 'null' ){
           //$location.path('#/page1/page3');;
           document.location.href = '#/page1/page3';
         }else{
           //console.log('aqui2');
           firebase.database().ref('users/' + user.uid).remove();

           firebase.database().ref('users/' + user.uid).set({
             email: user.email,
             active:1,
             role:3,
             ver_fila:true,
             nome:user.displayName,
             email:user.email,
             foto:user.photoURL,
             raio:50,
           }, function(error) {
             //$location.path('#/page1/page3');;
             document.location.href = '#/page1/page3';
           });

         }
       });
       $scope.cadastraUsuarioFacebookFlag=0;
     }

   });


  }





}])
.controller('minhacontaCtrl', ['$scope','$location','$ionicSideMenuDelegate', '$stateParams','$ionicHistory','$ionicLoading','$ionicPopup','$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$location,$ionicSideMenuDelegate, $stateParams,$ionicHistory,$ionicLoading,$ionicPopup,$timeout) {
  userLoggedOn = firebase.auth().currentUser;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(!userLoggedOn){
      $location.path('/login')
    }
  });
  var connectedRef = firebase.database().ref(".info/connected");
  $scope.conectDiv=true;
  connectedRef.on("value", function(snap) {
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });
    if (snap.val() === true) {
      $scope.conectDiv=true;

      $timeout(function () {
          $('body').trigger('click');
        //  $scope.conectDiv=true;
      },1500);
      //$window.location.reload();
    } else {

      $scope.conectDiv=false;
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });

    }
  });
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {

    viewData.enableBack = true;
    $scope.notToShow = false;
    $scope.showLoadingNoTime();

    $scope.countLine=0;
    user = firebase.auth().currentUser;
    //firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;

        ///$scope.showLoading();
        $scope.user = firebase.auth().currentUser;
        //console.log($scope.user);
        //$scope.showLoading();
        firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
          $scope.datauser = snapshot.val();
          //console.log(snapshot.val());
        });

        firebase.database().ref().child('geo_lojas').child(user.uid).child('dados').once("value", function(snapshot) {
          $scope.dataLojas = snapshot.val();
          //console.log(snapshot.val());
        });

      }
      $('.numeric').keyup(function () {
          this.value = this.value.replace(/[^0-9\.]/g,'');
      });
    //});
    $scope.categorias = '';
    $scope.optCategorias=[];
    $scope.pos={};
    $scope.pos.lat=0;
    $scope.pos.lon=0;
    $scope.post={};
    $scope.imageUrl='';

    var onSuccessPos = function(position) {
        $scope.pos.lat = position.coords.latitude;
        $scope.pos.lon= position.coords.longitude;

        //console.log($scope.pos.lon);
    };
    function onErrorPos(error) {
        $scope.posErro=error;
        calldialog();
    }
    $scope.optCategorias=[];
    navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

    firebase.database().ref().child('categorias').on("value", function(snapshot) {
      //$scope.showLoading();
      if(snapshot.val() != null ){
        $scope.categorias = snapshot.val();
        $scope.optCategorias=[] ;
        angular.forEach($scope.categorias, function(value, key) {
            $scope.optCategorias.push({
                chave: key,
                valor: value
            });
        });


      $timeout(function () {
        if(typeof $scope.datauser != 'undefined'){
          $('#categoria').val($scope.datauser.categoria);
          $('#categoria').trigger('change');
          }
          $scope.hideLoading();
        },3000);
      }
    },function(error) {
        $scope.hideLoading();
    });
  });
  $scope.getImage = function (source) {
      //alert('passou1');
      // Retrieve image file location from specified source
      $('#configForm').submit(function(event) {
        event.preventDefault();
      });
      $scope.showImage=false;
      var options = {
          maximumImagesCount: 1,
          quality: 50
      };
      $scope.showLoading();
      window.imagePicker.getPictures(
        function(results) {

          //alert('passou2');
            for (var i = 0; i < results.length; i++) {

                //getFileEntry(results[i]);

                var imageData = results[i];
                var filename = imageData.split("/").pop();
                var storageRef = firebase.storage().ref();

                var getFileBlob = function(url, cb) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url);
                    xhr.responseType = "blob";
                    xhr.addEventListener('load', function() {
                        cb(xhr.response);
                    });
                    xhr.send();
                };

                var blobToFile = function(blob, name) {
                    blob.lastModifiedDate = new Date();
                    blob.name = name;
                    return blob;
                };

                var getFileObject = function(filePathOrUrl, cb) {
                    getFileBlob(filePathOrUrl, function(blob) {
                        cb(blobToFile(blob, 'test.jpg'));
                    });
                };

                getFileObject(imageData, function(fileObject) {
                    var uploadTask = storageRef.child('images/'+user.uid+'.jpg').put(fileObject);

                    uploadTask.on('state_changed', function(snapshot) {
                        //alert(snapshot);
                    }, function(error) {
                        //alert(error);
                    }, function() {
                        var downloadURL = uploadTask.snapshot.downloadURL;
                        $scope.datauser.foto = downloadURL;
                        firebase.database().ref('users/' + user.uid).set($scope.datauser, function(error) {
                          $scope.texto  ={};
                          $scope.hideLoading();
                          if(error){
                            $scope.texto.titulo ='Ops! Algo deu errado.';
                            $scope.texto.mensagem ='Não conseguimos salvar a configuração.';
                            $scope.showAlert($scope.texto);
                          }else{
                            $scope.texto.titulo ='Tudo Certo!';
                            $scope.texto.mensagem ='Sua configuração foi salva!';
                            $scope.showAlert($scope.texto);
                          }
                        });
                        //alert(downloadURL);
                        // handle image here
                    });
                });
                $timeout(function(){
                  $scope.hideLoading();
                },2000);
            }
        }, function (error) {
            $scope.showImage=false;
            alert('Error: ' + error);
            $timeout(function(){
              $scope.hideLoading();
            },2000);
        },
        options
      );
      $timeout(function(){
        $scope.hideLoading();
      },2000);


   }

  $scope.editarUsuario = function(userData) {
    // //console.log(userData);
    user = firebase.auth().currentUser;
    $scope.user = firebase.auth().currentUser;
    //navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {enableHighAccuracy:true});
    $scope.showLoading();
    cat = $("#categoria").val();
    desc = $("#descricao").val();
    nome = $("#nome").val();
    limite = $("#limite").val();
    ver_fila = $("#ver_fila").val();
    rudovip  = $("#rudovip").val();
    desconto  = $("#desconto").val();
    porcentagem  = $("#porcentagem").val();
    condicoes = $("#condicoes").val();
    endereco =userData.endereco;
    bairro  = userData.bairro;
    cidade =  userData.cidade;
    uf = userData.uf;
    telefone1 = userData.telefone1;
    telefone2 = userData.telefone2;

    if($('#ver_fila').hasClass('ng-empty'))
    {
        ver_fila = false;
    }else{
        ver_fila = true;
    }
    if($('#rudovip').hasClass('ng-empty'))
    {
        rudovip = false;
    }else{
        rudovip = true;
    }
    if($('#desconto').hasClass('ng-empty'))
    {
        desconto = false;
    }else{
        desconto = true;
    }

    cat = cat || null;
    desc = desc || null;
    limite = limite || null;
    $scope.datauser2 =[];
    $scope.datauser2.nome = nome || null;

    porcentagem  = porcentagem || null;

    condicoes = condicoes || null;

    if(user.displayName != null && user.displayName !='' && typeof user.displayName!= 'undefined')
    {
        $scope.datauser2.nome = user.displayName;
        //console.log('aqui1');
    }

    $scope.datauser2.foto ='';
    if(user.photoURL != null && user.photoURL !=''  && typeof user.photoURL!= 'undefined')
    {
        $scope.datauser2.foto = user.photoURL;
    }else if($scope.datauser.foto != null && $scope.datauser.foto !=''  && typeof $scope.datauser.foto!= 'undefined'){
        $scope.datauser2.foto = $scope.datauser.foto;
    }else{
      $scope.datauser2.foto = null;
    }
    //user.displayName=nome;
    //user.photoURL= foto;
    //nome = user.displayName;
    //console.log(ver_fila);

    ver_fila = ver_fila || null;
    rudovip  = rudovip || null;
    desconto  = desconto || null;
    endereco  = endereco || null;
    bairro = bairro || null;
    cidade = cidade || null;
    uf = uf || null;
    telefone1 = telefone1 || null;
    telefone2 = telefone2 || null;
    //firebase.auth().onAuthStateChanged(function(user) {
      //console.log($scope.datauser.categoria);
      //console.log(user.uid);
      //if(typeof $scope.datauser.categoria !='undefined'){
      if(typeof user.uid != 'undefined'){
          firebase.database().ref('geo_lojas_cat').child(0).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(1).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(2).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(3).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(4).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(5).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(6).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(7).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(8).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(9).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(10).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(11).child(user.uid).remove();
          firebase.database().ref('geo_lojas_cat').child(12).child(user.uid).remove();
      }
      //}
      firebase.database().ref('users/' + user.uid).set({
        email: user.email,
        active:1,
        role:2,
        limit:limite,
        nome:$scope.datauser2.nome,
        foto:$scope.datauser2.foto,
        descricao:desc,
        categoria:cat,
        raio:50,
        ver_fila:ver_fila,
        rudovip:rudovip,
        desconto:desconto,
        porcentagem:porcentagem,
        condicoes:condicoes,
        endereco:endereco,
        bairro:bairro,
        cidade:cidade,
        uf:uf,
        telefone1:telefone1,
        telefone2:telefone2,
      }, function(error) {
        if(error){
          $scope.texto={};
            $scope.texto.titulo ='Ops! Algo deu errado.';
            $scope.texto.mensagem ='Ops, o perfil não foi atualizado.';
            $scope.hideLoading();
            $scope.showPopup($scope.texto);
        }else{
          firebase.database().ref().child('geo_lojas').child(cat).remove();

          var firebaseRef = firebase.database().ref().child('geo_lojas_cat').child(cat);
          var geoFire = new GeoFire(firebaseRef);
          var ref = geoFire.ref();  // ref === firebaseRef
          var mykey = ref.child('lojas').push();

          geoFire.set(user.uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
            //console.log("Provided key has been added to GeoFire");
            firebase.database().ref('geo_lojas_cat/'+cat+'/'+ user.uid+'/dados').set({
              endereco:'-',
              telefone:'-',
              nome:$scope.datauser2.nome,
              email:user.email,
              foto:$scope.datauser2.foto,
              raio:50,
              rudovip:rudovip,
              desconto:desconto,
              porcentagem:porcentagem,
              condicoes:condicoes,
              endereco:endereco,
              bairro:bairro,
              cidade:cidade,
              uf:uf,
              telefone1:telefone1,
              telefone2:telefone2,
            }, function(error) {

            });
            if(($scope.pos.lat != '' && $scope.pos.lat != null) && ($scope.pos.lon != '' && $scope.pos.lon != null ) ){
              firebase.database().ref('geo_lojas/'+ user.uid+'/l').set({
                0:$scope.pos.lat, 1:$scope.pos.lon
              }, function(error) {

              });
            }

          }, function(error) {
            //console.log("Error: " + error);
          });

          $scope.texto={};
            $scope.texto.titulo ='Tudo Certo';
            $scope.texto.mensagem ='Seu perfil foi atualizado.';
            $scope.hideLoading();
            $scope.showPopup($scope.texto);
        }
      });



    //});


  }
  $scope.showPopup = function(texto) {
    var alertPopup = $ionicPopup.alert({
     title: texto.titulo,
     template: texto.mensagem
   });

  };
  $scope.showLoadingNoTime = function() {
    $ionicLoading.show({
      template: 'Carregando...',

    }).then(function(){
      // //console.log("The loading indicator is now displayed");
    });
  };
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 3000
    }).then(function(){
      // //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
      // //console.log("The loading indicator is now hidden");
    });
  };
}])

.controller('signuptwoCtrl', ['$scope','$cordovaOauth','$location', '$stateParams','$ionicPopup','$ionicLoading','$timeout','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$cordovaOauth, $location,$stateParams,$ionicPopup,$ionicLoading,$timeout,$ionicSideMenuDelegate) {
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
    $('.ion-navicon').hide();
  });
  $scope.pos={};
  $scope.pos.lat=0;
  $scope.pos.lon=0;
  var onSuccessPos = function(position) {
      $scope.pos.lat = position.coords.latitude;
      $scope.pos.lon= position.coords.longitude;
      //console.log($scope.pos.lon);
  };
  function onErrorPos(error) {
      $scope.posErro=error;
      $scope.pos.lat=0;
      $scope.pos.lon=0;
      calldialog();
  }
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {



    navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

    user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {

      if(user)
      {
        navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {enableHighAccuracy:true});
        $scope.showLoading();
        $timeout(function () {
          $scope.showLoading();
          //$location.path('#/page1/page3');;
          document.location.href = '#/page1/page3';
        }, 3000);
      }

    });
  });
$scope.$on('$ionicView.leave', function(){
    //$ionicSideMenuDelegate.canDragContent(true);
    //$('.ion-navicon').show();
  });
  $scope.loginNormal = function (e) {
    $scope.user= e;
    ref.authWithPassword({
      email    : $scope.user.email,
      password : $scope.user.password
    }, function(error, authData) {
      if (error) {

      } else {
        //$location.path('#/page1/page3');;
        document.location.href = '#/page1/page3';

      //  window.location.href = '#/home';
      }
    });
  }

  $scope.showPopup = function(texto) {
    var alertPopup = $ionicPopup.alert({
     title: texto.titulo,
     template: texto.mensagem
   });

  };
  $scope.validaEmail= function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //$('.aviso-cadastro').hide();
    if(re.test(email)){
      $('.divAvisoEmail').hide();
      $('.lb-email ').removeClass('myredcolor');
      return true;
    }else {
      $('.divAvisoEmail').show();
      $('.lb-email ').addClass('myredcolor');
      return false;
    }
  }

  $scope.difpassword = function(user)
  {
    $('.aviso-cadastro').html('');
    if(typeof user !=='undefined')
    {
      if (user.password != user.cpassword && (user.password != '' && user.cpassword != '') ) {
          $('.lb-password ').addClass('myredcolor');
          $('.divAviso').show();
          return false;
      }else{
        $('.lb-password ').removeClass('myredcolor');
        $('.divAviso').hide();
        return true;
      }
    }else {
      $('.lb-password ').removeClass('myredcolor');
      $('.divAviso').hide();
      return true;
    }
  }
  $scope.validaCadastro = function(user) {
    navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {enableHighAccuracy:true});
    $('.aviso-cadastro').html('');
    if(user.email == null || user.email == ''){
      $scope.texto.titulo='Ops! Algo deu errado.';
      $scope.texto.mensagem='O campo email não pode ficar vazio.';
      return false;
    }else{
      return true;
    }

  }
  $scope.validaFormulario = function(user)
  {
    $('.aviso-cadastro').html('');
    var flagValid=true;
    if($scope.difpassword(user)== false){
      flagValid= false;
    }
    if(!$scope.validaEmail(user.email)){
      flagValid= false;
    }
    if($scope.validaCadastro(user)== false){
      flagValid= false;
    }
    return flagValid;
  }
  function logUser(user)
  {
      var ref = firebase.database().ref("users");
    //  //console.log(user);
      var obj = {
          "user": user
      };
      ref.push(obj); // or however you wish to update the node

  }


  $scope.post={};
  $scope.imageUrl='';
  var onSuccessPos = function(position) {
      $scope.pos.lat = position.coords.latitude;
      $scope.pos.lon= position.coords.longitude;

      //console.log($scope.pos.lon);
  };

  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 3000
    }).then(function(){
      // //console.log("The loading indicator is now displayed");
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
      // //console.log("The loading indicator is now hidden");
    });
  };
  $scope.showAlert = function(texto) {
    var alertPopup = $ionicPopup.alert({
      title: texto.titulo,
      template: texto.mensagem
    });
    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
      //$location.path('/page1/page10');
    });
  };

  function onErrorPos(error) {
      $scope.posErro=error;
      calldialog();
  }

  navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

  $scope.cadastrarUsuario = function(user) {
    $scope.showLoading();

    $('.aviso-cadastro').html('');

    if(typeof user != 'undefined')
    {
      //console.log('aqui');

      if($scope.validaCadastro(user)){
        if($scope.validaFormulario(user)){
          $scope.showLoading();
          firebase.auth().createUserWithEmailAndPassword(user.email, user.password).catch(function(error) {
            // Handle Errors here.
            $scope.showLoading();
            var errorCode = error.code;
            var errorMessage = error.message;
            var errorWeek ='auth/weak-password';
            $('.lb-email ').removeClass('myredcolor');
          //  //console.log('aqui1');
            if(errorCode.length == 18){
              $('.aviso-cadastro').html('Ops, a senha deve ter pelo menos 6 caracteres!');
              $('.divAvisoCadastro').show();
            }else if(errorCode.length == 25){
              $('.lb-email ').addClass('myredcolor');
              $('.aviso-cadastro').html('Ops, este email já se encontra em uso.');
              $('.divAvisoCadastro').show();
            }else if (errorCode.length == 27) {
              $('.divAvisoCadastro').show();
              $('.aviso-cadastro').html('Sem conexão com a internet.');
            }
            // ...

          });
          //console.log('cadastrou');
          $scope.cadastraUsuarioManualEstabelecimentoflag = 1;


          $timeout(function () {

            firebase.auth().onAuthStateChanged(function(userLoggedOn) {
              var user = firebase.auth().currentUser;
              $scope.user = firebase.auth().currentUser;;
              //console.log('mudou');
              $scope.showLoading();
              if($scope.cadastraUsuarioManualEstabelecimentoflag == 1){
                //console.log('flagou');

                //$scope.user = firebase.auth().currentUser;
                //console.log($scope.user);
                if(user != null){

                  firebase.database().ref('users/' + user.uid).remove();
                  firebase.database().ref('geo_filas/' + user.uid ).remove();
                  var firebaseRef = firebase.database().ref().child('geo_lojas');
                  var geoFire = new GeoFire(firebaseRef);
                  var ref = geoFire.ref();  // ref === firebaseRef
                  var mykey = ref.child('lojas').push();



                  firebase.database().ref('users/' + user.uid).set({
                    email: user.email,
                    active:1,
                    role:2,
                    limit:10000,
                    nome:null,
                    email:user.email,
                    foto:null,
                    raio:50,
                  }, function(error) {
                    if(error){
                      //console.log('erro');
                    }else{
                    }
                  });
                  //console.log('cadastrou1');
                  //console.log('Tudo Certo');

                  $scope.showLoading();

                  //Cadastra Fila Comum
                  //var user = firebase.auth().currentUser
                  firebase.database().ref('limit/' + user.uid).set({
                    limit:10000,
                  }, function(error) {

                  });
                  firebase.database().ref('geo_filas/' + user.uid ).push({
                    nome: 1,
                    ativa:true,
                    prioridade:false,
                    prioridade_qtd:0,
                    manual:false,
                    numero_contador:0,
                    prefixo:'CM-',
                  }, function(error) {
                  });

                  //Cadastra fila Prioritária
                  firebase.database().ref('geo_filas/' + user.uid ).push({
                    nome: 2,
                    ativa:true,
                    prioridade:true,
                    prioridade_qtd:2,
                    manual:false,
                    numero_contador:0,
                    prefixo:'PR-',
                  }, function(error) {
                  });

                  //Cadastra fila Manual
                  firebase.database().ref('geo_filas/' + user.uid ).push({
                    nome: 3,
                    ativa:true,
                    prioridade:false,
                    prioridade_qtd:0,
                    manual:true,
                    numero_contador:0,
                    prefixo:'MN-',
                  }, function(error) {
                  });
                  firebase.database().ref('geo_lojas/' + $scope.user.uid+'/dados').set({

                    endereco:'-',
                    telefone:'-',
                    nome:null,
                    email:user.email,
                    foto:null,
                    raio:50,
                  }, function(error) {

                  });
                  geoFire.set($scope.user.uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
                    //console.log("Provided key has been added to GeoFire");
                    firebase.database().ref('geo_lojas/' + $scope.user.uid+'/dados').set({

                      endereco:'-',
                      telefone:'-',
                      nome:null,
                      email:user.email,
                      foto:null,
                      raio:50,
                    }, function(error) {

                    });
                  }, function(error) {
                    //console.log("Error: " + error);
                  });
                  $timeout(function () {
                    //$location.path('#/page1/page3');;
                    document.location.href = '#/page1/page3';
                  }, 4000);
                  //console.log('cadastrou2');
                  $scope.cadastraUsuarioManualEstabelecimentoflag = 0;
                }else{

                  $timeout(function () {
                    var user = firebase.auth().currentUser;
                    $scope.user = firebase.auth().currentUser;
                    //console.log('cadastrou1');
                    //console.log('Tudo Certo');
                    var firebaseRef = firebase.database().ref().child('geo_lojas');
                    var geoFire = new GeoFire(firebaseRef);
                    var ref = geoFire.ref();  // ref === firebaseRef


                    firebase.database().ref('users/' + user.uid).remove();
                    firebase.database().ref('geo_filas/' + user.uid ).remove();
                    firebase.database().ref('users/' + user.uid).set({
                      email: user.email,
                      active:1,
                      role:2,
                      limit:10000,
                      nome:null,
                      email:user.email,
                      foto:null,
                      raio:50,
                    }, function(error) {
                      if(error){
                        //console.log('erro');
                      }else{
                      }
                    });

                    var mykey = ref.child('lojas').push();
                    $scope.showLoading();
                                        //Cadastra Fila Comum
                    //var user = firebase.auth().currentUser
                    firebase.database().ref('limit/' + user.uid).set({
                      limit:10000,
                    }, function(error) {

                    });
                    firebase.database().ref('geo_filas/' + user.uid ).push({
                      nome: 1,
                      ativa:true,
                      prioridade:false,
                      prioridade_qtd:0,
                      manual:false,
                      numero_contador:0,
                      prefixo:'CM-',
                    }, function(error) {
                    });

                    //Cadastra fila Prioritária
                    firebase.database().ref('geo_filas/' + user.uid ).push({
                      nome: 2,
                      ativa:true,
                      prioridade:true,
                      prioridade_qtd:2,
                      manual:false,
                      numero_contador:0,
                      prefixo:'PR-',
                    }, function(error) {
                    });

                    //Cadastra fila Manual
                    firebase.database().ref('geo_filas/' + user.uid ).push({
                      nome: 3,
                      ativa:true,
                      prioridade:false,
                      prioridade_qtd:0,
                      manual:true,
                      numero_contador:0,
                      prefixo:'MN-',
                    }, function(error) {
                    });
                    firebase.database().ref('geo_lojas/' + $scope.user.uid+'/dados').set({

                      endereco:'-',
                      telefone:'-',
                      nome:null,
                      email:user.email,
                      foto:null,
                      raio:50,
                    }, function(error) {

                    });

                    geoFire.set($scope.user.uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
                      //console.log("Provided key has been added to GeoFire");
                      firebase.database().ref('geo_lojas/' + $scope.user.uid+'/dados').set({

                        endereco:'-',
                        telefone:'-',
                        nome:null,
                        email:user.email,
                        foto:null,
                        raio:50,
                      }, function(error) {

                      });
                    }, function(error) {
                      //console.log("Error: " + error);
                    });

                    $timeout(function () {
                      //$location.path('#/page1/page3');;
                      document.location.href = '#/page1/page3';
                    }, 4000);
                    //console.log('cadastrou2');
                    $scope.cadastraUsuarioManualEstabelecimentoflag = 0;
                  }, 3000);
                }

              }else {
                //console.log('errou');
              }

            });
          }, 2000);
        }else{

        }
      }
    }else{
      $('.aviso-cadastro').html('Ops, digite o usuário e a senha!');
      $('.divAvisoCadastro').show();
      //console.log('aqui2');
    }
    //console.log(user);
  }



  $scope.cadastrarUsuarioFacebook = function(user) {
      $('.divAvisoCadastro').hide();
      var auth = new firebase.auth.FacebookAuthProvider();
      $cordovaOauth.facebook("111991969424960", ["email"]).then(function(result) {
       var credential = firebase.auth.FacebookAuthProvider.credential(result.access_token);
       firebase.auth().signInWithCredential(credential).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            if (errorCode === 'auth/account-exists-with-different-credential') {
              //alert('Email already associated with another account.');
              // Handle account linking here, if using.
              $('.divAvisoCadastro').show();
              $('.divAvisoCadastro').html('Email já está associado com uma outra conta.');
            } else {
              console.error(error);
            }


       });
         //alert('logou');
         //console.log(data);
         user = firebase.auth().currentUser;
         //alert('passou1');
         firebase.auth().onAuthStateChanged(function(user) {
           //alert('passou2');
           $scope.showLoading();
           firebase.database().ref().child('users').child(user.uid).child('email').once("value", function(snapshot) {
               if(snapshot.val() != null ){
                 //$location.path('#/page1/page3');;
                 document.location.href = '#/page1/page3';
               }else{
                 firebase.database().ref('users/' + user.uid).remove();
                 firebase.database().ref('geo_filas/' + user.uid ).remove();

                 firebase.database().ref('users/' + user.uid).set({
                   email: user.email,
                   active:1,
                   role:2,
                   limit:10000,
                   nome:user.displayName,
                   email:user.email,
                   foto:user.photoURL,
                   raio:50,
                 }, function(error) {
                     if(error){
                       //console.log('erro');
                     }else{

                 }
               });
           //console.log('Tudo Certo');
           firebase.database().ref('users/' + user.uid).remove();
           firebase.database().ref('geo_filas/' + user.uid ).remove();
           firebase.database().ref('users/' + user.uid).set({
             email: user.email,
             active:1,
             role:2,
             limit:10000,
             nome:user.displayName,
             email:user.email,
             foto:user.photoURL,
             raio:50,
           }, function(error) {
             if(error){
               //console.log('erro');
             }else{
             }
           });
           //console.log('Tudo Certo');
           var firebaseRef = firebase.database().ref().child('geo_lojas');
           var geoFire = new GeoFire(firebaseRef);
           var ref = geoFire.ref();  // ref === firebaseRef
           var mykey = ref.child('lojas').push();

           geoFire.set(user.uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
             //console.log("Provided key has been added to GeoFire");
             firebase.database().ref('geo_lojas/' + user.uid+'/dados').set({

               endereco:'-',
               telefone:'-',
               nome:user.displayName,
               email:user.email,
               foto:user.photoURL,
               raio:50,
             }, function(error) {

             });
           }, function(error) {
             //console.log("Error: " + error);
           });
           //Cadastra Fila Comum
           //var user = firebase.auth().currentUser
           firebase.database().ref('limit/' + user.uid).set({
             limit:10000,
           }, function(error) {

           });
           firebase.database().ref('geo_filas/' + user.uid ).push({
             nome: 1,
             ativa:true,
             prioridade:false,
             prioridade_qtd:0,
             manual:false,
             numero_contador:0,
             prefixo:'CM-',
           }, function(error) {
           });

           //Cadastra fila Prioritária
           firebase.database().ref('geo_filas/' + user.uid ).push({
             nome: 2,
             ativa:true,
             prioridade:true,
             prioridade_qtd:2,
             manual:false,
             numero_contador:0,
             prefixo:'PR-',
           }, function(error) {
           });

           //Cadastra fila Manual
           firebase.database().ref('geo_filas/' + user.uid ).push({
             nome: 3,
             ativa:true,
             prioridade:false,
             prioridade_qtd:0,
             manual:true,
             numero_contador:0,
             prefixo:'MN-',
           }, function(error) {
           });

           $timeout(function() {
             //$location.path('#/page1/page3');;
             document.location.href = '#/page1/page3';
           },2000);
       }
       });
     });



   }, function(error) {
      // alert("ERROR: " + error);
   });


  }



  $scope.Prioritária = function(user) {
    $scope.user=user;
    $('.myredcolor').removeClass('myredcolor');
    //$scope.validaCadastro(user);
    if($scope.validaFormulario(user))
    {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(function(user) {
        // [END createwithemail]
        // callSomeFunction(); Optional
        // var user = firebase.auth().currentUser;

      //  //console.log(user.uid);
        //function writeUserData(userId, email) {
          firebase.database().ref('users/' + user.uid).set({
            email: user.email,
            active:1,
            limit:10000,
            role:2,
            raio:50,
          }, function(error) {
            if(error){
              //console.log('erro');
            }else{
              //console.log('Tudo Certo');
              var firebaseRef = firebase.database().ref().child('geo_lojas');
              var geoFire = new GeoFire(firebaseRef);
              var ref = geoFire.ref();  // ref === firebaseRef
              var mykey = ref.child('lojas').push();

              geoFire.set(user.uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
                //console.log("Provided key has been added to GeoFire");
                firebase.database().ref('geo_lojas/' + user.uid+'/dados').set({
                  loja: 'Loja teste',
                  endereco:'endereco teste',
                  telefone:'telefone teste',
                  foto:'undefined',
                  raio:50,
                }, function(error) {

                });
              }, function(error) {
                //console.log("Error: " + error);
              });

            }
          });
        //}
        //alert('salvou');
        /*user.updateProfile({
            displayName: username
        }).then(function() {
            // Update successful.
        }, function(error) {
            // An error happened.
        });*/
    }, function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            console.error(error);
        }
        // [END_EXCLUDE]
    });
      /*firebase.auth().createUserWithEmailAndPassword(user.email, user.password).catch(function(error,userData) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
          } else {
            alert(errorMessage);
          }
          //console.log(userData);
        });*/

      /*firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .catch(function(error) {
        //console.log('aqui');
          var user = firebase.auth().currentUser;

          logUser(user); // Optional
      }, function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          var msg= '';
          if(error=='Error: The specified email address is already in use.')
          {
            msg='Email já em uso. Escolha outro email.';
            $('.lb-email').addClass('myredcolor');
          }
          if(error=='Error: Unable to contact the Firebase server.')
          {
            msg='Sem conexão com a internet. Tente mais terde.';
          }

          $('.aviso-erro').html(msg);
          $('.divAvisoEmailUso').show();
          return false;
      });*/

    }

  }

}])

.controller('pageCtrl', ['$scope', '$stateParams','$ionicSideMenuDelegate','$location', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicSideMenuDelegate,$location) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //viewData.enableBack = true;
    firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;
      $scope.user = firebase.auth().currentUser;
      firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
        $scope.datauser = snapshot.val();
        //console.log(snapshot.val());
      });
    });
  });
}])

.controller('page2Ctrl', ['$scope', '$stateParams','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //viewData.enableBack = true;
    firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;
      $scope.user = firebase.auth().currentUser;
      firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
        $scope.datauser = snapshot.val();
        //console.log(snapshot.val());
      });
    });
  });

}])

.controller('page3Ctrl', ['$scope', '$stateParams','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //viewData.enableBack = true;
    firebase.auth().onAuthStateChanged(function(user) {
      user = firebase.auth().currentUser;
      $scope.user = firebase.auth().currentUser;
      firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
        $scope.datauser = snapshot.val();
        //console.log(snapshot.val());
      });
    });
  });

}])
.controller('filasCtrl', ['$scope','$timeout', '$ionicPopup', '$stateParams', '$ionicHistory', '$location','$ionicLoading','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$timeout, $ionicPopup, $stateParams, $ionicHistory, $location,$ionicLoading,$ionicSideMenuDelegate) {
//alert();
var connectedRef = firebase.database().ref(".info/connected");
$scope.tentativas = 0;
//$scope.conectDiv=true;
connectedRef.on("value", function(snap) {
  $ionicLoading.hide().then(function(){
     //console.log("The loading indicator is now hidden");
  });
  if (snap.val() === true) {
    $scope.conectDiv=true;

    $timeout(function () {
        $('body').trigger('click');
      //  $scope.conectDiv=true;
    },1500);
    //$window.location.reload();
  } else {

    $scope.conectDiv=false;
    $ionicLoading.hide().then(function(){
       //console.log("The loading indicator is now hidden");
    });

  }
});
    userLoggedOn = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(userLoggedOn) {
      if(!userLoggedOn){
        $location.path('/login')
      }
    });
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.showLoading = function() {
      $ionicLoading.show({
        template: 'Carregando...',
        duration: 15000,
      }).then(function(){
         //console.log("The loading indicator is now displayed");
      });
    };
    $scope.hideLoading = function(){
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });
    };
    $scope.showAlert = function(texto) {
      var alertPopup = $ionicPopup.alert({
        title: texto.titulo,
        template: texto.mensagem
      });
      alertPopup.then(function(res) {
        //console.log('Thank you for not eating my delicious ice cream cone');
        //$location.path('/page1/page10');
      });
    };
    $scope.tituloPagina ='';
    $scope.$on('$ionicView.leave', function(){
      $scope.hasSenhas = true;
    });
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {

      $scope.showLoading();
      $scope.senhasAnteriores=[];
      $scope.hasSenhas =true;
      user = firebase.auth().currentUser;
      if (user)
      {
        //console.log('aquilslfkdsl');
        firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
          $scope.datauser = snapshot.val();
          if($scope.datauser.role==3){
            $scope.tituloPagina = "Minhas Senhas";
            $scope.showLoading();
              $scope.senhasAnteriores=[];
              firebase.database().ref().child('senhas_usuarios').child(user.uid).limitToLast(50).once("value", function(snapshot3) {
                $scope.showLoading();

                if(snapshot3.val() != null )
                {
                  $.each(snapshot3.val(), function (key, val) {
                    //$scope.showLoading();
                  //  //console.log(val);
                    firebase.database().ref().child('users').child(val.loja_id).once("value", function(snapshot4) {
                      if(snapshot4.val() != null )
                      {
                        val.loja = snapshot4.val().nome;
                        val.loja_email = snapshot4.val().email;
                        val.loja_foto = snapshot4.val().foto;
                        val.categoria = snapshot4.val().categoria;
                        val.categoriaNome = snapshot4.val().categoriaNome;
                        $scope.senhasAnteriores.unshift(val);
                        //$scope.conectDiv=true;
                        //console.log($scope.senhasAnteriores);

                      }
                    },function (error) {
                      //$scope.hideLoading();
                    });

                  });
                  $timeout(function(){
                      $('#filtro').val('');
                      $('#filtro').trigger('change');
                  },1000);
                }else{
                  //$scope.hideLoading();
                  $scope.hasSenhas = false;
                }

                $timeout(function(){
                  $scope.hideLoading();
                },2000);
              },function(error) {
                $timeout(function(){
                  $scope.hideLoading();
                },2000);
              });


          }else{
            $scope.tituloPagina = "Chamar Senha";
          }
          //console.log(snapshot.val());
        },function(error) {
          $timeout(function(){
            $scope.hideLoading();
          },2000);
        });
        $scope.items = [];
        firebase.database().ref().child('geo_filas').child(user.uid).once("value", function(snapshot) {
            if(snapshot.val() != null ){
              $.each(snapshot.val(), function(index, value) {

                if(value.nome==1 && value.ativa !=false){
                  //console.log('aqui');
                  $scope.showComum= true;
                }
                if(value.nome==3 &&  value.ativa !=false){
                  $scope.showManual=true;
                }
                if(value.nome==2 &&  value.ativa !=false){
                  $scope.showPrioridade=true;
                }
              });
            }else{
              $scope.totalItens =$scope.items.length;
            }
            $timeout(function(){
              $scope.hideLoading();
            },2000);
            //

        },function(error) {
          $timeout(function(){
            $scope.hideLoading();
          },2000);
        });

        $scope.guiches = '';
        firebase.database().ref().child('guiches').child(user.uid).on("value", function(snapshot) {
          if(snapshot.val() != null ){
            //console.log(snapshot.val());
            $scope.guiches = snapshot.val();
          }

        });
      }
      //$scope.hideLoading();
    },function(error) {
      $timeout(function(){
        $scope.hideLoading();
      },2000);
    });


    $scope.loadMoreData=function()
    {

       if(typeof $scope.senhasAnterioresAux[0] != "undefined")
       {

         $scope.senhasAnteriores.push($scope.senhasAnterioresAux[0]);
         $scope.senhasAnterioresAux.shift();

         $scope.$broadcast('scroll.infiniteScrollComplete');
       }else{

          $timeout(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.moredata=true;
          },3000);
       }

    };

  $scope.chamarProximo = function() {

  }

  $scope.changeGuiche = function(guiche) {
    $scope.guiche = guiche;
  }


  $scope.chamarPrioritario = function() {
    setDateTime();
    user = firebase.auth().currentUser;
    $scope.showLoading();
    $scope.countLine =0;
    //firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;
        //console.log('contador da linha 1615 é :'+$scope.countLine);
        //console.log(user);
          firebase.database().ref().child('geo_filas_senhas').child(user.uid).orderByChild("tipo").equalTo(2).limitToFirst(1).once("value", function(snapshot) {
            if(snapshot.val() != null){
              //  $scope.items.push(snapshot.val());
              var myKey;
              var array = $.map(snapshot.val(), function(value, index) {
                  //myKey = index;
                  return [value];
              });
              var myKey = $.map(snapshot.val(), function(value, index) {
                  return index;

              });
              //console.log(snapshot.key);


              for (var i = 0; i < array.length; i++) {
                obj = array[i];
                firebase.database().ref().child('geo_filas_senhas').child(user.uid).child(myKey[0]).remove();
              //  //console.log($scope.guiche);

                var guiche = $scope.guiche || null;
                if (typeof obj.user_id != 'undefined' ) {
                  sendNotificationTouUser(obj.user_id);
                  firebase.database().ref().child('senhas_usuarios').child(obj.user_id).orderByChild("loja_id").equalTo(user.uid).limitToLast(100).once("value", function(snapshot4) {
                  //  //console.log(snapshot.val());
                    if(snapshot4.val() != null){

                      $.each(snapshot4.val(), function (key2, val2) {
                         if(val2.numero == obj.numero)
                         {
                           val2.data_hora_chamada =  getDate(userDateTimeFull);
                           firebase.database().ref('senhas_usuarios').child(obj.user_id).child(key2).set( val2);
                         }
                     });
                    }
                  });
                }

                firebase.database().ref('geo_filas_senhas_usadas/' + user.uid).push({
                  'numero': obj.numero,
                  'tipo': obj.tipo,
                  'data':obj.data,
                  'data_hora_chamada':getDate(userDateTimeFull),
                  'guiche': guiche,
                }, function(error) {
                    if(error){
                      $scope.removeu =true;
                      //console.log('aqui1');
                      $scope.texto={};
                      $scope.texto.titulo ='Ops! Algo deu errado.';
                      $scope.texto.mensagem ='Operaçao não efetuada.';
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }else{
                      //console.log('aqui2');
                      $scope.texto={};
                      $scope.texto.titulo ='Tudo Certo';
                      $scope.texto.mensagem ='A senha foi '+obj.numero+' chamada.';
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }
                });
              //  //console.log($scope.removeu);
                //console.log(obj.ativo);
              }


              //console.log(snapshot.key);

            }else
            {
              //console.log('aqui2');
              $scope.texto={};
              $scope.texto.titulo ='Aviso';
              $scope.texto.mensagem ='Não existem senhas ativas nesta fila.';
              $scope.hideLoading();
              $scope.showAlert($scope.texto);
            }
          });
      }
    //});
  }
  $scope.chamarComum = function() {
    user = firebase.auth().currentUser;
    setDateTime();
    $scope.showLoading();
    $scope.countLine=0;
    //firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;
        //console.log('contador da linha 1525 é :'+$scope.countLine);
        //console.log(user);
          firebase.database().ref().child('geo_filas_senhas').child(user.uid).orderByChild("tipo").equalTo(1).limitToFirst(1).once("value", function(snapshot) {
          //  //console.log(snapshot.val());
            if(snapshot.val() != null){
              //  $scope.items.push(snapshot.val());
              var myKey;
              var array = $.map(snapshot.val(), function(value, index) {
                  //myKey = index;
                  return [value];
              });
              var myKey = $.map(snapshot.val(), function(value, index) {
                  return index;

              });
              //console.log(snapshot.key);
              for (var i = 0; i < array.length; i++) {
                obj = array[i];
                firebase.database().ref().child('geo_filas_senhas').child(user.uid).child(myKey[0]).remove();
                //console.log($scope.guiche);

                var guiche = $scope.guiche || null;
                //alert('passou1');
                if (typeof obj.user_id != 'undefined' ) {
                  //alert('passou2');
                  sendNotificationTouUser(obj.user_id);
                  firebase.database().ref().child('senhas_usuarios').child(obj.user_id).orderByChild("loja_id").equalTo(user.uid).limitToLast(100).once("value", function(snapshot4) {
                  //  //console.log(snapshot.val());
                    if(snapshot4.val() != null){

                      $.each(snapshot4.val(), function (key2, val2) {
                         if(val2.numero == obj.numero)
                         {
                           val2.data_hora_chamada =  getDate(userDateTimeFull);
                           firebase.database().ref('senhas_usuarios').child(obj.user_id).child(key2).set( val2);

                         }
                     });
                    }
                  });
                }
                firebase.database().ref('geo_filas_senhas_usadas/' + user.uid).push({
                  'numero': obj.numero,
                  'tipo': obj.tipo,
                  'data':obj.data,
                  'data_hora_chamada':getDate(userDateTimeFull),
                  'guiche': guiche,
                }, function(error) {
                    if(error){
                      $scope.removeu =true;
                      //console.log('aqui1');
                      $scope.texto={};
                      $scope.texto.titulo ='Ops! Algo deu errado.';
                      $scope.texto.mensagem ='Operaçao não efetuada.';
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }else{
                      //console.log('aqui2');
                      $scope.texto={};
                      $scope.texto.titulo ='Tudo Certo';
                      $scope.texto.mensagem ='A senha foi '+obj.numero+' chamada.';
                      $scope.hideLoading();
                      $scope.showAlert($scope.texto);
                    }
                });
                //console.log($scope.removeu);
                //console.log(obj.ativo);
              }
              //console.log(snapshot.key);

            }else
            {
              //console.log('aqui2');
              $scope.texto={};
              $scope.texto.titulo ='Aviso';
              $scope.texto.mensagem ='Não existem senhas ativas nesta fila.';
              $scope.hideLoading();
              $scope.showAlert($scope.texto);
            }
          });
      }
    //});

  }


}])

.controller('versenhasCtrl', ['$scope','$ionicPopup', '$stateParams', '$ionicHistory', '$location','$timeout','$ionicLoading','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $ionicPopup, $stateParams, $ionicHistory, $location,$timeout,$ionicLoading,$ionicSideMenuDelegate) {
//alert();
userLoggedOn = firebase.auth().currentUser;
firebase.auth().onAuthStateChanged(function(userLoggedOn) {
  if(!userLoggedOn){
    $location.path('/login')
  }
});
$ionicSideMenuDelegate.canDragContent(false);
$scope.showLoading = function() {
  $ionicLoading.show({
    template: 'Carregando...',
    duration: 3000
  }).then(function(){
    // //console.log("The loading indicator is now displayed");
  });
};
$scope.hideLoading = function(){
  $ionicLoading.hide().then(function(){
    // //console.log("The loading indicator is now hidden");
  });
};
$scope.ionicGoBack = function() {
  $ionicHistory.goBack();
};
$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  viewData.enableBack = true;
  $scope.showLoading();
  var user = firebase.auth().currentUser;

  if (user) {
    firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
      $scope.datauser = snapshot.val();
      //console.log(snapshot.val());
    });
    $scope.items = [];
    var array =[];
    firebase.database().ref().child('geo_filas_senhas').child(user.uid).on("value", function(snapshot) {
        if(snapshot.val() != null){

          $.each(snapshot.val(), function (key, val) {
            val.key = key;
            var array = $.map(val, function(value, index) {
                return [value];
            });
            $scope.items.push(array);

          });
        }else{
          $scope.totalItens =$scope.items.length;
        }
      });
      $scope.guiches = '';
      firebase.database().ref().child('guiches').child(user.uid).on("value", function(snapshot) {
        if(snapshot.val() != null ){
        //  //console.log(snapshot.val());
          $scope.guiches = snapshot.val();
        }
      });



  } else {
    $location.path('/page5');
  }
  $timeout(function(){
    $scope.filtro='';
  },1000);
});
$scope.hideLoading();
$scope.showAlert = function(texto) {
  var alertPopup = $ionicPopup.alert({
    title: texto.titulo,
    template: texto.mensagem
  });
  alertPopup.then(function(res) {
    //console.log('Thank you for not eating my delicious ice cream cone');
    //$location.path('/page1/page10');
  });
};




//console.log(user);

$scope.changeGuiche = function(guiche) {
  $scope.guiche = guiche;
}
$scope.mostrar=true;
$scope.chamarSenhaId = function(senha,id,guiche) {
  setDateTime();
  user = firebase.auth().currentUser;
  $scope.mostrar=false;
  $scope.showLoading();
  $scope.countLine=0;
  //firebase.auth().onAuthStateChanged(function(user) {
    if (user){
      $scope.countLine++;
      //console.log('contador da linha 1525 é :'+$scope.countLine);
      //console.log(user);
        if(id != senha[5]){
          //console.log('aqyui2');
          firebase.database().ref().child('geo_filas_senhas').child(user.uid).child(id).remove();
        }else{
          //console.log(senha);
            firebase.database().ref().child('geo_filas_senhas').child(user.uid).child(senha[5]).remove();
            if(typeof senha[6] != 'undefined')
            {
              firebase.database().ref().child('geo_filas_senhas').child(user.uid).child(senha[6]).remove();
            }
        }




        //firebase.database().ref().child('geo_filas_senhas').child(user.uid).child(myKey[0]).remove();
        var guiche = $scope.guiche || null;

        if (typeof senha[5] != 'undefined' &&  typeof senha[6] != 'undefined') {
          sendNotificationTouUser(senha[5]);
          firebase.database().ref().child('senhas_usuarios').child(senha[5]).orderByChild("loja_id").equalTo(user.uid).limitToLast(100).once("value", function(snapshot4) {
          //  //console.log(snapshot.val());
            if(snapshot4.val() != null){

              $.each(snapshot4.val(), function (key2, val2) {
                 if(val2.numero ==  senha[2])
                 {
                   val2.data_hora_chamada =  getDate(userDateTimeFull);
                   firebase.database().ref('senhas_usuarios').child(senha[5]).child(key2).set( val2);
                 }
             });
            }
          });
        }
        firebase.database().ref('geo_filas_senhas_usadas/' + user.uid).push({
          'numero': senha[2],
          'tipo': senha[4],
          'data': senha[1],
          'data_hora_chamada':getDate(userDateTimeFull),
          'guiche': guiche,
        }, function(error) {
            if(error){
              $scope.removeu =true;
              //console.log('aqui1');
              $scope.texto={};
              $scope.texto.titulo ='Ops! Algo deu errado.';
              $scope.texto.mensagem ='Operaçao não efetuada.';
              $scope.hideLoading();
              $scope.showAlert($scope.texto);
            }else{
              //console.log('aqui2');
              var user = firebase.auth().currentUser;
              //console.log("show after directive partial loaded");
              if (user) {
                $scope.items = [];
                // User is signed in.
                //var userId = firebase.auth().currentUser.uid;
                var array =[];
                firebase.database().ref().child('geo_filas_senhas').child(user.uid).on("value", function(snapshot) {
                //firebase.database().ref().child('geo_filas').child(user.uid).once('value').then(function(snapshot) {
                    if(snapshot.val() != null){

                      $.each(snapshot.val(), function (key, val) {
                        val.key = key;
                        var array = $.map(val, function(value, index) {
                            return [value];
                        });
                        $scope.items.push(array);
                          //console.log($scope.items);
                      });
                      //$scope.items.push(snapshot.val()) ;
                      //console.log(snapshot.val());
                    }else{
                      $scope.totalItens =$scope.items.length;
                    }
                  });

              } else {

                //$location.path('/page5');
              }
              //  alert();
              $timeout(function(){
                $scope.filtro='';
                $scope.mostrar=true;
              },1000);

              $scope.texto={};
              $scope.texto.titulo ='Tudo Certo';
              $scope.texto.mensagem ='A senha foi '+senha[2]+' chamada.';
              $scope.hideLoading();
              $scope.showAlert($scope.texto);
            }
        });
    }
  //});
}
}])
.controller('termosCtrl', ['$scope','$ionicPopup', '$stateParams', '$ionicHistory', '$location','$timeout','$ionicLoading','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $ionicPopup, $stateParams, $ionicHistory, $location,$timeout,$ionicLoading,$ionicSideMenuDelegate) {
//alert();

$ionicSideMenuDelegate.canDragContent(false);


}])
.controller('tabs1Controller', ['$scope','$ionicLoading', '$stateParams','$ionicPopup','$location','$ionicLoading','$timeout','$ionicSideMenuDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$ionicLoading, $stateParams,$ionicPopup,$location,$ionicLoading,$timeout,$ionicSideMenuDelegate) {
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Carregando...',

    }).then(function(){
      // //console.log("The loading indicator is now displayed");
    });
  };

  $ionicSideMenuDelegate.canDragContent(false);
  $scope.limite =1;
  $scope.tituloPrimeiro='';
  $scope.tituloSegundo='';
  $scope.tituloTerceiro ='';
  $scope.tituloQuarto ='';

  $scope.tituloPrimeiroIco='';
  $scope.tituloSegundoIco='';
  $scope.tituloTerceiroIco ='';
  $scope.tituloQuartoIco ='';
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
    //$('.ion-navicon').hide();
    $scope.showContent= false;
    $timeout(function () {
      $scope.showContent= true;
    }, 2500);
  });
  $scope.$on('$ionicView.leave', function(){
      $scope.showContent= false;
      $scope.conectDiv= true;
      $scope.hasStore=true;
      $scope.hasLojas='';
  });
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //$scope.showLoading();
    var onSuccessPos = function(position) {
        $scope.pos.lat = position.coords.latitude;
        $scope.pos.lon= position.coords.longitude;

        //console.log($scope.pos.lon);
    };
    function onErrorPos(error) {
        $scope.posErro=error;
        calldialog();
    }
    $scope.pos = {};
    $scope.pos.lat = 0;
    $scope.pos.lon= 0;
    var onSuccessPos2 = function(position) {
        $scope.pos.lat = position.coords.latitude;
        $scope.pos.lon= position.coords.longitude;

        //console.log($scope.pos.lon);
    };
    function onErrorPos2(error) {
        $scope.posErro=error;
        //calldialog();
    }

    function tentarcadastrarnovamente(loja, usuario,uid) {
      navigator.geolocation.getCurrentPosition(onSuccessPos2, onErrorPos2, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
          setTimeout(function() {
              if($scope.pos.lat != 'undefined' && $scope.pos.lat != '' && $scope.pos.lat != null){
                  geoFire.set(uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
                    //console.log("Provided key has been added to GeoFire");
                    firebase.database().ref('geo_lojas/' + uid+'/dados').set({

                      endereco:'-',
                      telefone:'-',
                      nome:usuario.nome,
                      email:usuario.email,
                      foto:usuario.foto,
                      raio:50,
                    }, function(error) {

                    });
                  }, function(error) {
                    //console.log("Error: " + error);
                  });
                  firebase.database().ref('geo_filas/' + uid ).remove();
                  firebase.database().ref('limit/' + uid).set({
                    limit:10000,
                  }, function(error) {

                  });
                  firebase.database().ref('geo_filas/' + uid ).push({
                    nome: 1,
                    ativa:true,
                    prioridade:false,
                    prioridade_qtd:0,
                    manual:false,
                    numero_contador:0,
                    prefixo:'CM-',
                  }, function(error) {
                  });

                  //Cadastra fila Prioritária
                  firebase.database().ref('geo_filas/' + uid ).push({
                    nome: 2,
                    ativa:true,
                    prioridade:true,
                    prioridade_qtd:2,
                    manual:false,
                    numero_contador:0,
                    prefixo:'PR-',
                  }, function(error) {
                  });

                  //Cadastra fila Manual
                  firebase.database().ref('geo_filas/' + uid ).push({
                    nome: 3,
                    ativa:true,
                    prioridade:false,
                    prioridade_qtd:0,
                    manual:true,
                    numero_contador:0,
                    prefixo:'MN-',
                  }, function(error) {
                  });

                  if(typeof snapshot.val().categoria != 'undefined'){
                      var firebaseRef2 = firebase.database().ref().child('geo_lojas_cat').child(snapshot.val().categoria);
                      var geoFire2 = new GeoFire(firebaseRef2);
                      var ref2 = geoFire.ref();  // ref === firebaseRef


                      geoFire2.set(uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
                        //console.log("Provided key has been added to GeoFire");
                        firebase.database().ref('geo_lojas_cat/'+snapshot.val().categoria+'/'+ uid+'/dados').set({
                          endereco:'-',
                          telefone:'-',
                          nome:usuario.nome,
                          email:usuario.email,
                          foto:usuario.foto,
                          raio:50,
                        }, function(error) {

                        });
                    });
                }

            }else{
              tentarcadastrarnovamente(loja, usuario ,uid)
            }
          },1000);
    }
    navigator.geolocation.getCurrentPosition(onSuccessPos, onErrorPos, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

    $scope.showContent= false;
    $timeout(function () {
      $scope.showContent= true;
    }, 2500);

    user = firebase.auth().currentUser;
    $scope.countLine=0;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        $scope.countLine++;

        $timeout(function() {
        //console.log(user.uid);
        firebase.database().ref().child('users').child(user.uid).once("value", function(snapshot) {
          $scope.datauser = snapshot.val();
          //console.log(snapshot.val());

          $scope.isAndroid = ionic.Platform.isAndroid();
          $scope.isIos = ionic.Platform.isIOS();
          //console.log($scope.isIos);
          if(snapshot.val() != null)
          {
            if(snapshot.val().role ==2){
              $scope.tituloPrimeiro='Gerar Senhas';
              $scope.tituloSegundo ='Chamar Senha';
              $scope.tituloTerceiro ='Minha Fila';
              $scope.tituloQuarto ='Configurações';


              if($scope.isAndroid == true){
                $scope.tituloPrimeiroIco='ion-plus-circled';
                $scope.tituloSegundoIco='ion-speakerphone';
                $scope.tituloTerceiroIco ='ion-person-stalker';
                $scope.tituloQuartoIco ='ion-gear-a';
              }else if($scope.isIos == true){
                $scope.tituloPrimeiroIco='ion-ios-plus';
                $scope.tituloSegundoIco='ion-speakerphone';
                $scope.tituloTerceiroIco ='ion-person-stalker';
                $scope.tituloQuartoIco ='ion-ios-gear';
              }else{
                $scope.tituloPrimeiroIco='ion-plus-circled';
                $scope.tituloSegundoIco='ion-speakerphone';
                $scope.tituloTerceiroIco ='ion-person-stalker';
                $scope.tituloQuartoIco ='ion-gear-a';
              }
              $scope.usuario ={};
              $scope.usuario.nome =  snapshot.val().nome || null;
              $scope.usuario.email =  snapshot.val().email || null;
              $scope.usuario.foto = snapshot.val().foto || null;

              firebase.database().ref().child('geo_lojas').child(user.uid).once("value", function(snapshotgeolojas) {
                if(snapshotgeolojas.val() == null)
                {
                    var firebaseRef = firebase.database().ref().child('geo_lojas');
                    var geoFire = new GeoFire(firebaseRef);
                    var ref = geoFire.ref();  // ref === firebaseRef
                    if($scope.pos.lat != 'undefined' && $scope.pos.lat != '' && $scope.pos.lat != null){
                        geoFire.set(user.uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
                          //console.log("Provided key has been added to GeoFire");
                          firebase.database().ref('geo_lojas/' + user.uid+'/dados').set({

                            endereco:'-',
                            telefone:'-',
                            nome:$scope.usuario.nome,
                            email:$scope.usuario.email,
                            foto:$scope.usuario.foto,
                            raio:50,
                          }, function(error) {

                          });
                        }, function(error) {
                          //console.log("Error: " + error);
                        });
                        firebase.database().ref('geo_filas/' + user.uid ).remove();
                        firebase.database().ref('limit/' + user.uid).set({
                          limit:10000,
                        }, function(error) {

                        });
                        firebase.database().ref('geo_filas/' + user.uid ).push({
                          nome: 1,
                          ativa:true,
                          prioridade:false,
                          prioridade_qtd:0,
                          manual:false,
                          numero_contador:0,
                          prefixo:'CM-',
                        }, function(error) {
                        });

                        //Cadastra fila Prioritária
                        firebase.database().ref('geo_filas/' + user.uid ).push({
                          nome: 2,
                          ativa:true,
                          prioridade:true,
                          prioridade_qtd:2,
                          manual:false,
                          numero_contador:0,
                          prefixo:'PR-',
                        }, function(error) {
                        });

                        //Cadastra fila Manual
                        firebase.database().ref('geo_filas/' + user.uid ).push({
                          nome: 3,
                          ativa:true,
                          prioridade:false,
                          prioridade_qtd:0,
                          manual:true,
                          numero_contador:0,
                          prefixo:'MN-',
                        }, function(error) {
                        });
                        if(typeof snapshot.val().categoria != 'undefined'){
                            var firebaseRef2 = firebase.database().ref().child('geo_lojas_cat').child(snapshot.val().categoria);
                            var geoFire2 = new GeoFire(firebaseRef2);
                            var ref2 = geoFire.ref();  // ref === firebaseRef


                            geoFire2.set(user.uid, [$scope.pos.lat, $scope.pos.lon]).then(function() {
                              //console.log("Provided key has been added to GeoFire");
                              firebase.database().ref('geo_lojas_cat/'+snapshot.val().categoria+'/'+ user.uid+'/dados').set({
                                endereco:'-',
                                telefone:'-',
                                nome:$scope.usuario.nome,
                                email:$scope.usuario.email,
                                foto:$scope.usuario.foto,
                                raio:50,
                              }, function(error) {

                              });
                          });
                      }

                  }else{
                    tentarcadastrarnovamente(snapshotgeolojas, $scope.usuario,user.uid )
                  }
                }

              });

            }else{
              $scope.tituloPrimeiro='Pegar Senha';
              $scope.tituloSegundo ='Minhas Filas';
              $scope.tituloTerceiro ='Favoritos';
              $scope.tituloQuarto ='Configurações';
              if($scope.isAndroid == true){
                $scope.tituloPrimeiroIco='ion-pricetags';
                $scope.tituloSegundoIco='ion-person-stalker';
                $scope.tituloTerceiroIco ='ion-heart';
                $scope.tituloQuartoIco ='ion-gear-a';
              }else if($scope.isIos == true){
                $scope.tituloPrimeiroIco='ion-ios-pricetags';
                $scope.tituloSegundoIco='ion-person-stalker';
                $scope.tituloTerceiroIco ='ion-heart';
                $scope.tituloQuartoIco ='ion-ios-gear';
              }else{
                $scope.tituloPrimeiroIco='ion-pricetags';
                $scope.tituloSegundoIco='ion-person-stalker';
                $scope.tituloTerceiroIco ='ion-heart';
                $scope.tituloQuartoIco ='ion-gear-a';
              }

            }
          }

        });
      },2500);
      }else{
        document.location.href = '#/page5';
      }
    });
  });
}])
