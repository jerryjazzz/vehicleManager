angular.module('starter.controllers', [])

// HOME PAGE CONTROLLER
.controller('DashCtrl', function($scope, IonicLogin, $state, $http, $ionicLoading) {

 var self = this ;

 $scope.items = [
    { id: 0, vehicleId: 123, expires: '12/20/2012' },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 } ];

  this.openVehiclePage = function(){
    $state.go('app.addVehicle');
  }

  this.openHomePage = function(){
    $state.go('app.home');
  }

  this.getVehicles = function (){

    this.session = JSON.parse( window.localStorage['session']);

        $http.post("http://localhost:8100/getVehicles", { params:    
                      { 
                        "username": this.session.username,
                        "type": "getVehicles" 
                      }
                    })
                .success(function(data) {
                      self.vehiclesList = data ;
                      console.log(data);
                      $ionicLoading.hide();
                })
                .error(function(data) {
                    $ionicLoading.hide();
                    alert('Uh oh. Looks like we screwed up. Unable to post right now.');
                });
  }

  $scope.$on('$ionicView.enter', function(e) {
      self.session = JSON.parse( window.localStorage['session']) ; // read the session information
      if (!self.session){
        $state.go('login');
      }
      else
       self.getVehicles();
  });

   $scope.logout = function(){
       IonicLogin.logout(self.session.username);
  }

  $scope.showHome = function(){
      $state.go('app.home');
  }

   $scope.showAbout = function(){
      $state.transitionTo('app.about');
  }

   $scope.showContact = function(){
      $state.go('app.contact');
  }

   $scope.showSettings = function(){
      $state.go('app.settings');
  }
})

.controller('SplashController', function ($scope, $state, $window, $http){

    $scope.$on("$ionicView.enter", function(event) {
          $scope.checkSession();
    });

  $scope.checkSession = function () {

        if ( window.localStorage['session'] != null 
            && window.localStorage['session'] != undefined && window.localStorage['session'] != "")
        {
            console.log('checking session');
            var sesh = JSON.parse(window.localStorage['session']) ;

              $http.post("http://localhost:8100/checkSession",
                { params: { "session": JSON.stringify(sesh)}})
                  .success(function(response) {
                   if ( response == "error" || response == "LOGIN_FAIL" ){
                        $state.go('login');
                   }
                   else{
                       $state.go('app.home');
                   }
                  })
                  .error(function(response) {
                        $state.go('login');
            });
        }
        else{
           console.log('no session found.');
           $state.go('login');
        }
     }
})

// LOGIN PAGE CONTROLLER
.controller('IonicLogin', function($scope, IonicLogin, $ionicLoading, $cordovaOauth, $http) {

  // REMOVE THE USER LOGIN INFORMATION WHEN RETURNING TO LOGIN SCREEN
  $scope.$on('$ionicView.enter', function(e) {
      $scope.data = {} ;
  });

  // LOGOUT FUNCTION
  $scope.logout = function(){
       IonicLogin.logout();
  }

  // LOGIN FUNCTION
  $scope.login = function(){
       IonicLogin.login($scope.data.email, $scope.data.password);
  }

   // SIGNUP FUNCTION
   $scope.signUp = function(){
      IonicLogin.signUp($scope.data.email, $scope.data.password);
  }

  // FACEBOOK LOGIN
  $scope.facebookLogin = function() {

       var appID = "928219620607005"; // PUT YOUR FACEBOOK APP ID HERE
       var redirectURL = "http://localhost/callback" ; // PUT YOUR APP CALLBACK URL HERE

       $cordovaOauth.facebook(appID, ["email"], {redirect_uri: redirectURL})
            .then(function(result){
                var access_token = result.access_token;

               $http.get("https://graph.facebook.com/v2.2/me",
                    { params: {access_token: access_token, fields: "name, email", format: "json" }})
                        .then(function(user) {
                        //     alert(JSON.stringify(user));
                             IonicLogin.socialLogin( user.data.email, user.data.id); // USING ID TO GENERATE A HASH PASSWORD
                    })
        },
          function(error){
                console.log("Error: " + error);
        });
    }

    // TWITTER LOGIN
    $scope.twitterLogin = function(){

          // YOUR TWITTER CALLBACK WILL HAVE TO BE HTTP://LOCALHOST/CALLBACK FOR TESTING BUT
          // IT NEEDS TO BE SET VIA TINYURL.COM
           var consumerKey = "fMNg8ecQmeOTHNFGgJKsGwYbw"; // PUT YOUR CONSUMER KEY HERE
           var consumerSecretKey = "cPOHMNSrDXLb1dXrVQP0e3CaeSlVGONzYgGq92gpPh38q9g51Q"; // PUT YOUR SECRET KEY HERE
           var oathToken = ""
           var oathSecret = "" ;

          $cordovaOauth.twitter( consumerKey,  consumerSecretKey)
              .then(function(result){
               // alert(JSON.stringify(user));
                oathToken = result.oauth_token ;
                oathSecret = result.oauth_token_secret ;

                // IF YOU WANT TO GET TWITTER USERS EMAIL ADDRESS YOU WILL HAVE TO WHITELIST YOUR APP WITH TWITTER
                // THEY DO NOT ALLOW IT BY DEFAULT
                // https://dev.twitter.com/rest/reference/get/account/verify_credentials
              IonicLogin.socialLogin( result.screen_name, result.user_id ); // USING ID TO GENERATE A HASH PASSWORD
        });
    }

    // GOOGLE PLUS LOGIN
    $scope.googleLogin = function(){

          // CREATE A PROJECT ON GOOGLE DEVELOPER CONSOLE AND PUT YOUR CLIENT ID HERE
          // GOOGLE OAUTH DOES NOT GIVE US EMAIL RIGHT AWAY SO WE HAVE TO MAKE 2 API CALLS
          $cordovaOauth.google("584540832467-tv8i4a8utt7tk5aih3ej8a6gc65sjk87.apps.googleusercontent.com", ["email"], {redirect_uri: "http://localhost/callback"}).then(function(result) {
                  //   alert("Response Object -> " + JSON.stringify(result));

                  $http.get("https://www.googleapis.com/plus/v1/people/me", // TO GET THE USER'S EMAIL
                     { params: {access_token: result.access_token,
                              key: "584540832467-tv8i4a8utt7tk5aih3ej8a6gc65sjk87.apps.googleusercontent.com"}})
                        .then(function(user) {
                     //      alert(JSON.stringify(user));
                             IonicLogin.socialLogin( user.data.emails[0].value, result.access_token); // USING ID TO GENERATE A HASH PASSWORD
                        });
            });
     }

    // INSTAGRAM LOGIN
    $scope.instagramLogin = function(){

        var clientID = "a0c936f91d4d4219b3230fb96650216d" ; // PUT YOUR CLIENT ID HERE
        var redirectURL = "http://tinyurl.com/krmpchb" // PUT YOUR REDIRECT URL HERE

        $cordovaOauth.instagram(clientID, ["basic"], {redirect_uri: redirectURL})
          .then(function(result){
                  // INSTAGRAM OAUTH DOES NOT GIVE US USERNAME SO WE HAVE TO MAKE 2 API CALLS
                  $http.get("https://api.instagram.com/v1/users/self/", // TO GET THE USERSNAME
                     { params: {access_token: result.access_token }})
                        .then(function(user) {
                     //     alert(JSON.stringify(user));
                            IonicLogin.socialLogin( user.data.data.username, result.access_token); // USING ID TO GENERATE A HASH PASSWORD
                        });
          });
    }
})

// HOME PAGE CONTROLLER
.controller('newVehicleController', function($scope, IonicLogin, $state, $ionicLoading, $http, $ionicPopup) {

    var self = this ;
  
    this.initForm = function () {
          this.form = { } ;

          this.form.vehicleStatus = "Active" ;
          this.form.vehicleMake = "N/A" ;    
          this.form.vehicleType = "Semi-truck" ;
    }
   
    this.initForm();

    this.today = function() {
      console.log('today called');
      this.registrationDate = new Date();
      this.insuranceDate = new Date();
      this.secondInsuranceDate = new Date();
      this.cargoInsuranceDate = new Date();
      this.techInspectionDate = new Date();    
      this.maintenanceInspectionDate = new Date();
    };
    
    this.today();

    this.clear = function() {
      this.dt = null;
    };

    this.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    this.dateOptions = {
      dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(),
      startingDay: 1
    };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  this.toggleMin = function() {
    this.inlineOptions.minDate = this.inlineOptions.minDate ? null : new Date();
    this.dateOptions.minDate = this.inlineOptions.minDate;
  };

  this.toggleMin();

 this.openCalendar = function(target, popup) {
    this.dt = target ;
    popup.opened = true ;
   // this.popup1.opened = true;
  };

  this.setDate = function(year, month, day) {
    this.dt = new Date(year, month, day);
  };

  this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  this.format = this.formats[2];
  this.altInputFormats = ['d!/M!/yyyy'];

  this.insurancePopup = {
    opened: false
  };
   this.registrationPopup = {
    opened: false
  };
   this.secondInsurancePopup = {
    opened: false
  };
   this.cargoInsurancePopup = {
    opened: false
  };
   this.techInspectionPopup = {
    opened: false
  };
   this.maintenanceInspectionPopup = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  this.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < this.events.length; i++) {
        var currentDay = new Date(this.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return this.events[i].status;
        }
      }
    }
    return '';
  }

 this.makeVehicle = function(){

    console.log('makeVehicle');
    this.session = JSON.parse( window.localStorage['session']) ;
    console.log(this.session.username) ;

    $http.post("http://localhost:8100/addVehicle", { params:
              
              { 
                "username": this.session.username,
                "vehicleType": this.form.vehicleType,
                 "vehicleStatus": this.form.vehicleStatus,
                 "vehicleMake": this.form.vehicleMake,
                 "vehicleYear": this.form.vehicleYear,
                 "vehicleVIN": this.form.vehicleVIN,
                  
                 "registrationNumber": this.form.registrationNumber,
                 "registrationDate" : this.registrationDate,
                 "registrationMonths": this.form.registrationMonths,
                
                 "insuranceCompany": this.form.insuranceCompany,
                 "insuranceNumber": this.form.insuranceNumber,
                 "insuranceDate": this.insuranceDate,
                 "insuranceMonths": this.form.insuranceMonths,

                 "secondInsuranceCompany": this.form.secondInsuranceCompany,
                 "secondInsuranceNumber": this.form.secondInsuranceNumber,
                 "secondInsuranceDate": this.secondInsuranceDate,
                 "secondInsuranceMonths": this.form.secondInsuranceMonths,

                 "cargoInsuranceCompany": this.form.cargoInsuranceCompany,
                 "cargoInsuranceNumber": this.form.cargoInsuranceNumber,
                 "cargoInsuranceDate": this.cargoInsuranceDate,
                 "cargoInsuranceMonths": this.form.cargoInsuranceMonths,

                 "techInspectionDate": this.techInspectionDate,
                 "techInspectionMonths": this.form.techInspectionMonths,
               
                 "maintenanceInspectionDate": this.maintenanceInspectionDate,
                 "maintenanceInspectionMonths": this.form.maintenanceInspectionMonths 
                
              }
            })
        .success(function(data) {

              $ionicPopup.alert({
                title: 'Vehicle Added',
                template: 'Your Vehicle was added succesfully!'
              });

              self.form.vehicleVIN = "" ;
              self.form.registrationNumber = "" ;
               $ionicLoading.hide();
        })
        .error(function(data) {
            $ionicLoading.hide();
            alert('Uh oh. Looks like we screwed up. Unable to post right now.');
        });
    }

    this.clearForm = function(){
      this.initForm();
    }
    
});
