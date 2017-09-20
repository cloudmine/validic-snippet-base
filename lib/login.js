var cloudmine = require('cloudmine');
var q = require('q');

var constants = require('./constants');
var createUser = require('./createUser');
var factory = require('./factory');

var login = function(profile, ws){
  // Get the credentials from the request

  // Does the user exist? Try to login to see if they do

  // If the user doesn't exist, create a new one
  // This process should be a separate snippet, createUser, that creates a CM
  //  user, and also provisions a Validic User
  // The Validic user information should be stored within a user-level profile object
  // The createUser snippet should return a CM Session Token and Validic Auth Token
  // These values can then be returned directly

  // If the user exists, login
  // store the session token to the return object

  // Check the user level profile object for a validic access token
  // if the access token exists and is less than a day old, use it
  // otherwise, get a new access token

  var deferred = q.defer();

  // try to login with the input profile and webService
  ws.login(profile).on('success', function(data){
    // the login was successful
    // get the validic user data if it's there
    // console.log(ws);

    console.log("\n\n\n\n");
    console.log(data);
    console.log("\n\n\n\n");
    console.log(ws);

/* "result": {
        "cm_session_token": "af341cc049484632aa2985d8f8a46c5d",
        "cm_user_id": "793557662a98469aa741012c9174f4b2",
        "validic_access_token": "4PYJRz3kxFBPdgMEd1Co",
        "validic_user_id": "59c1c48ffe35fda5a8067e66"
    }
}*/

    var response = {
      "cm_session_token": data["session_token"],
      "cm_user_id": data['profile']['__id__']
    }

    ws.search('[type = "validic_profile_data"]').on('success', function(data){

      if (Object.keys(data).length > 0){
        // there was something returned in the search
        var validicData = data[Object.keys(data)[0]]["data"]
        var access_token = validicData["access_token"];
        var validic_user_id = validicData["_id"];

        console.log(response);

        response["validic_access_token"] = access_token;
        response["validic_user_id"] = validic_user_id;
      }

      deferred.resolve(response);
    }).on('error', function(error){
      // there was no validic profile data, just return the CM Session Token
      deferred.resolve(response);
    })

    // deferred.resolve("hello");

  }).on('error', function(error){
    deferred.reject({"loginUnsuccessful": error});
  });

  return deferred.promise;

}

var snippet = function(req, res) {
  var body = req.payload.request.body;
  var profile = body['profile'];

  var ws = factory.generateWSFromRequest(req);

  login(profile, ws)
  .then(function(data){
    res(data);
  })
  .catch(function(error){
    res(error);
  })
}

module.exports = {
  "snippet": snippet
}
