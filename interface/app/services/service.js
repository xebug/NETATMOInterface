function Interface($http, session) {

  this.getCoordinates = function(city) {
    return $http
      .get('/getCoordinates?city='+city)
      .then(function(response) { 
        var data = response.data;
        return (response.data);
      });
  }


}
// ******************** FIN SERVICE ******************** //

/*
-Titre Service : accessDataService
Fonction du service:
-getInfo = function(url)
*/
function accessDataService($http) {
  /**
   * getInfo : la fonction getInfo retourne une promesse provenant du service http
   * @param url
   * @returns {*|Promise}
   */
  this.getInfo = function(url) {
    // Appel Ajax
    return $http
      .get(url)
      .then(function(response) { //First function handles success
          return (response.data);
        },
        function(response) {
          //Second function handles error
          return ("Something went wrong");
        });
  }
}
// ******************** FIN SERVICE ******************** //




/*
-Titre Service : sessionService
Fonction du service:
-getUser = function()
-setUser = function(user)
-setInfo = function(key, value)
-getInfo = function(key)
*/
function sessionService($log, $window) {
  this._user = JSON.parse($window.localStorage.getItem('session.user'));
  this.getUser = function() {
    return this._user;
  };
  this.setUser = function(user) {
    this._user = user;
    $window.localStorage.setItem('session.user', JSON.stringify(user));
    return this;
  };
  this.setInfo = function(key, value) {
    $window.localStorage.setItem('session.' + key, JSON.stringify(value));
  };
  this.getInfo = function(key) {
    return JSON.parse($window.localStorage.getItem('session.' + key));
  }

}
// ******************** FIN SERVICE ******************** //
