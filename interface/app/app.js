var app = angular.module('MonAppli', []); // on charge le module mon appli qui se trouve dans index
app.controller('MonCont', MonCont);
app.service('interface', Interface);
app.service("accessDataService", accessDataService);
app.service('session', sessionService);
