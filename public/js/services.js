angular.module('starter.services', [])

.factory('IonicLogin', function( $http, $state, $ionicPopup, $ionicLoading) {

  function login(email, password){

      $ionicLoading.show({
              template: 'Logging In...'
          });

      $http.post("https://monicle.herokuapp.com/login",
             { params: {
                         "email": email,
                         "username": email,
                         "password": password}
                        })
               .success(function(response) {
                    console.log(response);
                    $ionicLoading.hide();

              if ( response == "LOGIN_FAIL" ){
                    $ionicPopup.alert({
                     title: 'Login Failed',
                      template: 'Wrong email and/or password.'
                    });
              }
             else{ // SUCCESS
                  window.localStorage['session'] = JSON.stringify(response);
                  $state.transitionTo('app.home');
             }
            })
            .error(function(response) {

                   $ionicLoading.hide();
                   $ionicPopup.alert({
                       title: 'Login',
                       template: 'Service unavailable, make sure you are online.'
                   });
            });
  }


  function logout(email){

        $ionicLoading.show({
              template: 'Logging Out...'
          });

        $http.post("https://monicle.herokuapp.com/logout",
             { params: { "email": email }})
               .success(function(response) {

                    $ionicLoading.hide();

              if ( response == "LOGIN_FAIL" ){
                    $ionicPopup.alert({
                     title: 'Logout Failed',
                      template: 'Oops something went wrong.'
                    });
              }
             else{ // SUCCESS

                  window.localStorage['session'] = null;
                  $state.transitionTo('login');
             }
            })
            .error(function(response) { // IF THERE IS AN ERROR LOGOUT ANYWAY

                   $ionicLoading.hide();

                  window.localStorage['session'] = "";
                  $state.transitionTo('login');
            });
  }


  function signUp(email, password){

       $ionicLoading.show({
              template: 'Creating Account...'
          });

            $http.post("https://monicle.herokuapp.com/signUp",
               { params: {
                           "email": email,
                           "password": password }
                           })
                 .success(function(response) {

                      $ionicLoading.hide();

                if ( response == "USER_EXISTS" ){
                      $ionicPopup.alert({
                       title: 'Username Taken',
                        template: 'Username taken, try another one.'
                      });
                }
               else{ // SUCCESS

                    window.localStorage['session'] = JSON.stringify(response);
                    $state.transitionTo('app.home');
               }
              })
              .error(function(response) {
                     $ionicLoading.hide();

                     $ionicPopup.alert({
                         title: 'Account',
                         template: 'Service unavailable, make sure you are online.'
                     });
              });
  }


 function socialLogin(email, password){

       $ionicLoading.show({
              template: 'Loggin In...'
          });

            $http.post("https://monicle.herokuapp.com/socialLogin",
               { params: {
                           "email": email,
                           "password": password }
                           })
                 .success(function(response) {

                    $ionicLoading.hide();

                    window.localStorage['session'] = JSON.stringify(response);
                    $state.transitionTo('app.home');

              })
              .error(function(response) {
                     $ionicLoading.hide();

                     $ionicPopup.alert({
                         title: 'Account',
                         template: 'Service unavailable, make sure you are online.'
                     });
              });
  }

  return {

    login: login,
    signUp: signUp,
    logout: logout,
    socialLogin: socialLogin

  };
});
