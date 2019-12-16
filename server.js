/******** Chargement des Middleware *******/
const express = require('express'); // définit expressJS
const session = require('express-session'); //Gestionnaire de session



/******** Declaration des variables ********/
const app = express(); // appel à expressJS

var path = require('path');
var request = require('request');

app.use(express.static(__dirname + '/interface/')); // Chemin du projet





/******** Configuration du serveur NodeJS - Port : 8080 ********/
var server = app.listen(8080, function() { //Spécification du port d’écoute de Node pour les requêtes HTTP
  console.log('Port 8080; Demo Netatmo');
});






/******** Chargerment de la page index à l'acces au site ********/
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/interface/index.html'));
});



app.get('/getCoordinates', function(req, res) {
  var city = req.query.city;
  var responseData = {}; // creation de la reponse
  var lat = 0;
  var lon = 0;
  var headers = {
    'accept': 'application/json',
  };

  var options = {
    url: 'https://api.opencagedata.com/geocode/v1/json?key=b2655059bc0b4f90897f9622a5b2b23c&q=' + city,
    headers: headers
  };

  function callbackOpenCageData(error, responseData, body) {
    json = JSON.parse(body);
    if (!error && responseData.statusCode == 200 && Object.values(json)[3][0] != null) {
      coord = Object.values(json)[3][0].geometry; // recupération des coordonnées du premier resultat, pour plus de simplicité, car plusieurs villes peuvent avoir le même nom.
      lat = Object.values(coord)[0];
      lon = Object.values(coord)[1];
      var headers2 = {
        'accept': 'application/json',
        'Authorization': 'Bearer 5df3a39de0c2b1000d15d712|619ada4c2871dcc7ab52ac647dc0e139'
      };
      var options2 = {
        url: 'https://api.netatmo.com/api/getpublicdata?lat_ne=' + lat + '&lon_ne=' + lon + '&lat_sw=' + lat + '&lon_sw=' + lon + '&filter=true',
        headers: headers2
      };

      function callbackNetatmo(error, responseData, body) {
        if (!error && responseData.statusCode == 200) {
          json = JSON.parse(body).body;
          if (JSON.parse(body).body.length == 0) // aucune données ou vérifier le nom de la ville.
          {
            responseData.statusCode = 600;
            res.send(responseData);
          } else {
            var resultTemp = []; // Pour stocker les temperatures obtenus de tous les capteurs et faire la moyenne plus tard.
            for (var z = 0; z < JSON.parse(body).body.length; z++) { // pour tous les devices
              for (var i = 0; i < Object.keys(JSON.parse(body).body[z].measures).length; i++) { // pour tous les modules de chaque devices
                if (JSON.parse(body).body[z].measures[Object.keys(JSON.parse(body).body[z].measures)[i]] != null && JSON.parse(body).body[z].measures[Object.keys(JSON.parse(body).body[z].measures)[i]].hasOwnProperty('type')) {
                  if (JSON.parse(body).body[z].measures[Object.keys(JSON.parse(body).body[z].measures)[i]].type.indexOf("temperature") > -1) { // Si le module mesure la température
                    indexTemp = JSON.parse(body).body[z].measures[Object.keys(JSON.parse(body).body[z].measures)[i]].type.indexOf("temperature");
                    inModuleID = Object.keys(JSON.parse(body).body[z].measures[Object.keys(JSON.parse(body).body[z].measures)[i]].res)[0]; // id du module
                    resultTemp.push(JSON.parse(body).body[z].measures[Object.keys(JSON.parse(body).body[z].measures)[i]].res[inModuleID][indexTemp]); // on ajoute la température au tableau
                  }
                }
              }
            }

            // Moyenne du tableau de température.
            var total = 0;
            for (var i = 0; i < resultTemp.length; i++) {
              total += resultTemp[i];
            }
            var avg = total / resultTemp.length;
            responseData.body = avg.toFixed(1);
            res.send(responseData);


          }
        } else {
          //Erreur requête vers l'API Netatmo
          res.send(responseData);
        }
      }
      request(options2, callbackNetatmo);

    } else {
      //ville inexistante
      responseData.statusCode = 600;
      res.send(responseData);
    }


  }

  request(options, callbackOpenCageData);


});
