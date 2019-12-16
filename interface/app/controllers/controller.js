function MonCont($scope, interface) {

  $scope.bandeauPrincipal = true;
  $scope.bandeauContact = false;
  $scope.bandeauRes = false;
  $scope.bandeauMessage = false;
  $scope.bandeauChargement = false;
  $scope.bandeauSearch = true;

  $scope.bandContact = function() {
    $scope.bandeauPrincipal = false;
    $scope.bandeauContact = true;
    $scope.bandeauRes = false;
    $scope.bandeauMessage = false;
    $scope.bandeauChargement = false;

  }
  $scope.bandPrincipal = function() {
    $scope.bandeauPrincipal = true;
    $scope.bandeauContact = false;
    $scope.bandeauRes = false;
    $scope.bandeauMessage = false;
    $scope.bandeauChargement = false;

  }

  /*
  -Titre fonction : $scope.searchCity = function()
  -Explication fonction : Fonction servant recuperer les coordonnées geographique d'une ville pour ensuite afficher la température locale.
  -Entrée : nom de la ville
  -Sortie: temperature
  */
  $scope.searchCity = function() {
    $scope.message = 'Chargement...';
    $scope.bandeauRes = false;
    $scope.bandeauChargement = true;
    $scope.bandeauSearch = false;
    interface.getCoordinates($scope.citySearched).then(function(data) {
      if (data.statusCode == '600') {
        $scope.bandeauChargement = false;
        $scope.bandeauMessage = true;
        $scope.message = "Aucune données dans cette ville, vérifiez l'orthographe.";
      }
      if (data.statusCode == '500') {

        $scope.bandeauChargement = false;
        $scope.bandeauMessage = true;
        $scope.message = "Erreur MongoDB, veuillez reessayer.";
      }
      if (data.statusCode == '403') {

        $scope.bandeauChargement = false;
        $scope.bandeauMessage = true;
        $scope.message = "Access Token experired.";
      }
      else if (data.statusCode == '200') {
        $scope.temperature = "Il fait actuellement " + data.body + " degrées à " +$scope.citySearched;
        $scope.bandeauChargement = false;
        $scope.bandeauMessage = false;
        $scope.bandeauRes = true;
      }

    });
  }

  $scope.newResearch = function() {
    $scope.bandeauPrincipal = true;
    $scope.bandeauContact = false;
    $scope.bandeauRes = false;
    $scope.bandeauMessage = false;
    $scope.bandeauChargement = false;
    $scope.bandeauSearch = true;
  }


} //FIN CONTROLLER
