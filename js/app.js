// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic','firebase','ngCordovaOauth','ngCordova','app.controllers', 'app.routes', 'app.directives','app.services'])

.config(function($ionicConfigProvider, $sceDelegateProvider){


  $sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**']);
  $ionicConfigProvider.views.maxCache(5);
  $ionicConfigProvider.backButton.text('Voltar');
  //$ionicConfigProvider.tabs.position("bottom");
  $ionicConfigProvider.tabs.style("standard");
  //$ionicConfigProvider.navBar.alignTitle('center');
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

/*
  This directive is used to disable the "drag to open" functionality of the Side-Menu
  when you are dragging a Slider component.
*/
.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
    return {
        restrict: "A",
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            function stopDrag(){
              $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag(){
              $ionicSideMenuDelegate.canDragContent(true);
            }

            $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
            $element.on('touchstart', stopDrag);
            $element.on('touchend', allowDrag);
            $element.on('mousedown', stopDrag);
            $element.on('mouseup', allowDrag);

        }]
    };
}])

/*
  This directive is used to open regular and dynamic href links inside of inappbrowser.
*/
/*.directive('hrefInappbrowser', function() {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    link: function(scope, element, attrs) {
      var href = attrs['hrefInappbrowser'];

      attrs.$observe('hrefInappbrowser', function(val){
        href = val;
      });

      element.bind('click', function (event) {

        window.open(href, '_system', 'location=yes');

        event.preventDefault();
        event.stopPropagation();

      });
    }
  };
});*/
var userDateTimeFull;
var userTimeGlobal;
firebase.auth().onAuthStateChanged(function(userTime) {
  if(userTime){
    var ref = firebase.database().ref("sessions");
    userTimeGlobal = userTime;
    setDateTime();
    userDateTimeFull = new Date();
    ref.child(userTime.uid).on('value', function(snapshot) {
      if(snapshot.val() != null && snapshot.val() !="null"){
        userDateTimeFull = snapshot.val().startedAt;
      }else{
        userDateTimeFull = new Date();
      }
    });
  }
});

function setDateTime() {
  var ref = firebase.database().ref("sessions");
  //key = ref.push().getKey(); // this will fetch unique key in advance
  if(typeof userTimeGlobal   != 'undefined')
  {
    ref.child(userTimeGlobal.uid).set({
       startedAt: firebase.database.ServerValue.TIMESTAMP
     });
  }else{
    userDateTimeFull = new Date();
  }

}


function getDateSmall(timestamp) {
  if(typeof timestamp == 'undefined'){
    timestamp =new Date()
  }

  var dateObj = new Date(timestamp);
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  return day+'/'+month+'/'+year;
}
function getDate(timestamp) {
  if(typeof timestamp == 'undefined'){
    timestamp =new Date()
  }
  var data = new Date(timestamp);

  // Guarda cada pedaço em uma variável
  var dia     = data.getDate();           // 1-31
  var dia_sem = data.getDay();            // 0-6 (zero=domingo)
  var mes     = data.getMonth();          // 0-11 (zero=janeiro)
  var ano2    = data.getYear();           // 2 dígitos
  var ano4    = data.getFullYear();       // 4 dígitos
  var hora    = data.getHours();          // 0-23
  var min     = data.getMinutes();        // 0-59
  var seg     = data.getSeconds();        // 0-59
  var mseg    = data.getMilliseconds();   // 0-999
  var tz      = data.getTimezoneOffset(); // em minutos

  if(dia.toString().length == 1)
  {
    diaAux = '0'+dia.toString();
  }else{
    diaAux = dia.toString();
  }


  //mesAux = mes.toString();
  //console.log(mes.toString().length);
  if(mes.toString().length ==1)
  {
    mesAux = '0'+mes.toString();
  }else{
    mesAux = mes.toString();
  }

  if(hora.toString().length ==1)
  {
    horaAux = '0'+hora.toString();
  }else{
    horaAux = hora.toString();
  }

  if(min.toString().length ==1)
  {
    minAux = '0'+min.toString();
  }else{
    minAux = min.toString();
  }

  if(seg.toString().length ==1)
  {
    segAux = '0'+seg.toString();
  }else{
    segAux = seg.toString();
  }
  anoAux = ano4.toString();
  data_hora_atendimento = diaAux+'/'+mesAux+'/'+ anoAux+' '+horaAux+':'+ minAux+':'+segAux;
  return data_hora_atendimento;
}
var refInap;
var pictureSource;   // picture source
var destinationType;
function calldialog() {
 //document.addEventListener("deviceready",function() {
 cordova.dialogGPS("Seu GPS está desabilitado, este aplicativo necessita que ele esteja ativo para um mehor funcionamento.",//message
                 "Use GPS, com wifi ou 3G.",//description
                 function(buttonIndex){//callback
                   switch(buttonIndex) {
                     case 0: break;//cancel
                     case 1: break;//neutro option
                     case 2: break;//user go to configuration
                   }},
                   "Por favor habilite o GPS",//title
                   //["Cancelar","Fechar","Habilitar"]
                   ["Fechar","Habilitar"]
                 );//buttons
  //});
}
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    window.open = cordova.InAppBrowser.open;
    pictureSource=navigator.camera.PictureSourceType;
    estinationType=navigator.camera.DestinationType;
    //var refInap = cordova.InAppBrowser.open('http://apache.org', '_blank', 'location=yes');

}

function upload(fileEntry) {
    // !! Assumes variable fileURL contains a valid URL to a text file on the device,
    var fileURL = fileEntry.toURL();

    var success = function (r) {
        alert("Successful upload...");
        alert("Code = " + r.responseCode);

        alert("Response = " + r.response);
        alert("Sent = " + r.bytesSent);
        alert(fileEntry.fullPath + " (content uploaded to server)");
    }

    var fail = function (error) {
        alert("An error has occurred: Code = " + error.code);
    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);


    var params = {};
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;

    var ft = new FileTransfer();
    // SERVER must be a URL that can handle the request, like
    // http://some.server.com/upload.php
    var urlAction = URLAPP+"RestImages/uploadimage.json";
    ft.upload(fileURL, encodeURI(urlAction), success, fail, options);
}

function uploadPhoto(imageURI) {

  var options = new FileUploadOptions();

  options.fileKey = "file";

  options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
  options.mimeType = "image/jpeg";

  var params = {};
  params.value1 = "test";
  params.value2 = "param";

  options.params = params;

  var ft = new FileTransfer();


  var urlAction = URLAPP+"RestImages/uploadimage.json";
  ft.upload(imageURI, encodeURI(urlAction), win, fail, options);




}
// !! Assumes variable fileURL contains a valid URL to a text file on the device,
//    for example, cdvfile://localhost/persistent/path/to/file.txt

var win = function (r) {
    alert('win');
    //console.log("Code = " + r.responseCode);
    //console.log("Response = " + r.response);
    //console.log("Sent = " + r.bytesSent);
}

var fail = function (error) {
  alert('erro');
    alert("An error has occurred: Code = " + error.code);
    //console.log("upload error source " + error.source);
    //console.log("upload error target " + error.target);
}


function writeFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function () {
            alert("Successful file write...");
            upload(fileEntry);
        };

        fileWriter.onerror = function (e) {
            //console.log("Failed file write: " + e.toString());
        };

        if (!dataObj) {
          dataObj = new Blob(['id'], { type: 'image/jpeg' });
        }

        fileWriter.write(dataObj);
    });
}
function getFileEntry(imgUri) {

    window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {

        // Do something with the FileEntry object, like write to it, upload it, etc.
          writeFile(fileEntry, imgUri);

        // displayFileData(fileEntry.nativeURL, "Native URL");

    }, function () {
      // If don't get the FileEntry (which may happen when testing
      // on some emulators), copy to a new FileEntry.
        createNewFileEntry(imgUri);
    });
}
function returnCategoria(id)
{
    switch (id) {
      case '0':
        return 'Outros';
        break;
      case '1':
        return 'Bares e Restaurantes';
        break;
      case '2':
        return 'Consultórios Médicos';
        break;
      case '3':
        return 'Barbearias';
        break;
      case '4':
        return 'Bancos';
        break;
      case '5':
        return 'Serviços Públicos';
        break;
      case '6':
        return 'Gráficas';
        break;
      case '7':
        return 'Casas de Show';
        break;
      case '8':
        return 'Hospitais - Clínicas';
        break;
      case '9':
        return 'Assistências Técnicas';
        break;
      case '10':
        return 'Show e Eventos';
        break;
      case '11':
        return 'Casas Lotéricas';
        break;
      case '12':
        return 'Postos de Saúde';
        break;
      default:
      return 'Sem Categoria';


    }
}
var tokenUser=null;
checkFCM();
function getNotToken(){
  FCMPlugin.getToken(function(token){
    tokenUser = token;
    //alert(token);

    firebase.auth().onAuthStateChanged(function(userLoggedOn) {
      //var userLoggedOn = firebase.auth().currentUser;
      if(userLoggedOn){
        //alert(tokenUser);
        firebase.database().ref('users_not/' + userLoggedOn.uid).set(tokenUser, function(error) {
          if(error){
            //alert(error);
          }
        });
      }
    });
  });
}

function checkFCM (){
      setTimeout(function(){
        if(typeof FCMPlugin == 'undefined'){

          checkFCM();
        }else{

          FCMPlugin.onTokenRefresh(function(token){
              tokenUser = token;
              //alert(token);

              firebase.auth().onAuthStateChanged(function(userLoggedOn) {
                //var userLoggedOn = firebase.auth().currentUser;
                if(userLoggedOn){
                  //alert(tokenUser);
                  firebase.database().ref('users_not/' + userLoggedOn.uid).set(tokenUser, function(error) {
                    if(error){
                      //alert(error);
                    }
                  });
                }
              });
          });
          FCMPlugin.onNotification(function(data){
              //console.log('data push: ');
              //console.log(data);

              if(data.wasTapped){
                //alert('Tapped '+JSON.stringify(data) );
              }else{
                //alert('Foreground: '+JSON.stringify(data) );
              }
          });
          getNotToken();
        };
      }, 1000);
}

/*var tokenUser=null;
FCMPlugin.onTokenRefresh(function(token){
  tokenUser = token;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(userLoggedOn){
      //alert(tokenUser);
      firebase.database().ref('users_not/' + userLoggedOn.uid).set(tokenUser, function(error) {
        if(error){
          //alert(error);
        }
      });
    }
  });
    //alert( token );
});
FCMPlugin.getToken(function(token){
  tokenUser = token;
  firebase.auth().onAuthStateChanged(function(userLoggedOn) {
    if(userLoggedOn){
      //alert(tokenUser);
      firebase.database().ref('users_not/' + userLoggedOn.uid).set(tokenUser, function(error) {
        if(error){
          //alert(error);
        }
      });
    }
  });

  FCMPlugin.onNotification(function(data){
    if(data.wasTapped){
      //Notification was received on device tray and tapped by the user.
      alert( JSON.stringify(data) );
    }else{
      //Notification was received in foreground. Maybe the user needs to be notified.
      alert( JSON.stringify(data) );
    }
});
});*/
function sendNotificationTouUser(myUserId){
  firebase.database().ref().child('users_not').child(myUserId).once("value", function(snapshot){
    if(snapshot.val() != null)
    {
      //alert(snapshot.val());
      var json = {
         "to": snapshot.val(),
         "notification": {
           "sound": "default",
           "icon": "fcm_push_icon",
           "title": "Sua vez chegou!",
           "body": "A sua senha acabou de ser chamada."
         },
         "data": {
           "titulo": "Sua vez chegou!",
           "descricao": "A sua senha acabou de ser chamada."
         }
       };
       $.ajax({
        url: 'https://fcm.googleapis.com/fcm/send',
        type: "POST",
        processData : false,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('Authorization', 'key=AAAANqHsY-o:APA91bG57seGghLsQZqgJENHc-oqF1U1uccDXn9yaWOI1DZ-9NR-xJllBMl0bh8wwXRj1IGNTruOEV25NJfQ8KUy2wjygDQBd7gR0J6xjLC5sztoWdBclORiHQ1YAErmxMqPdvsdmhJY');
        },
        data: JSON.stringify(json),
        success: function (response) {
          //console.log(response);
          //alert("Mensagem enviada com sucesso!");
        },
        error: function(error) {
          //alert(error);
        }
      });

    }
  });
}
function sendNotificationTouUserNewNumber(myUserId, estabelecimento){
  firebase.database().ref().child('users_not').child(myUserId).once("value", function(snapshot){
    if(snapshot.val() != null)
    {
      //alert(snapshot.val());
      estabelecimento = estabelecimento || null;
      var json = {
         "to": snapshot.val(),
         "notification": {
           "sound": "default",
           "icon": "fcm_push_icon",
           "title": "Nova senha gerada.",
           "body": "O estabelecimento "+estabelecimento+" gerou uma senha para você."
         },
         "data": {
           "titulo": "Nova senha gerada.",
           "descricao": "O estabelecimento "+estabelecimento+" gerou uma senha para você."
         }
       };
       $.ajax({
        url: 'https://fcm.googleapis.com/fcm/send',
        type: "POST",
        processData : false,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('Authorization', 'key=AAAANqHsY-o:APA91bG57seGghLsQZqgJENHc-oqF1U1uccDXn9yaWOI1DZ-9NR-xJllBMl0bh8wwXRj1IGNTruOEV25NJfQ8KUy2wjygDQBd7gR0J6xjLC5sztoWdBclORiHQ1YAErmxMqPdvsdmhJY');
        },
        data: JSON.stringify(json),
        success: function (response) {
          //console.log(response);
          //alert("Mensagem enviada com sucesso!");
        },
        error: function(error) {
          //alert(error);
        }
      });

    }
  });
}

function sendNotificationTouUserNewNumberEstab(myUserId, usuario){
  firebase.database().ref().child('users_not').child(myUserId).once("value", function(snapshot){
    if(snapshot.val() != null)
    {
      //alert(snapshot.val());
      usuario = usuario || '';
      var json = {
         "to": snapshot.val(),
         "notification": {
           "sound": "default",
           "icon": "fcm_push_icon",
           "title": "Nova senha gerada.",
           "body": usuario+" gerou uma senha no seu estabelecimento."
         },
         "data": {
           "titulo": "Nova senha gerada.",
           "descricao": usuario+" gerou uma senha no seu estabelecimento."
         }
       };
       $.ajax({
        url: 'https://fcm.googleapis.com/fcm/send',
        type: "POST",
        processData : false,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('Authorization', 'key=AAAANqHsY-o:APA91bG57seGghLsQZqgJENHc-oqF1U1uccDXn9yaWOI1DZ-9NR-xJllBMl0bh8wwXRj1IGNTruOEV25NJfQ8KUy2wjygDQBd7gR0J6xjLC5sztoWdBclORiHQ1YAErmxMqPdvsdmhJY');
        },
        data: JSON.stringify(json),
        success: function (response) {
          //console.log(response);
          //alert("Mensagem enviada com sucesso!");
        },
        error: function(error) {
          //alert(error);
        }
      });

    }
  });
}
