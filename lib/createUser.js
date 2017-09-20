var cloudmine = require('cloudmine');
var q = require('q');
var _ = require('lodash');

var factory = require('./factory');
var validic = require('./validic');

var createUser = function(profile, ws) {
  // create the user
  // login as the user
  //  store the session token in the return object
  // provision a validic user
  //  store the validic access token in the return object
  //  create a user-level profile object, and store the validic access token and user_id on it

  var deferred = q.defer();

  ws.createUser(profile).on('success', function(data){
    deferred.resolve(data);
  }).on('error', function(error){
    deferred.reject(error);
  });

  return deferred.promise;
}

var createUserAndLogin = function(profile, ws) {

  var deferred = q.defer();

  createUser(profile, ws)
  .then(function(value){
    ws.login(profile).on('success', function(successData){
      deferred.resolve(_.extend(value, successData));
    }).on('error', function(failureData){
      deferred.reject(failureData);
    });
  })
  .catch(function(error){
    deferred.reject(error);
  });

  return deferred.promise;
}

var updateCMUserProfile = function(profileData, loggedInWS){

  var deferred = q.defer();

  loggedInWS.set('', {
    "type" : "validic_profile_data",
    "data": profileData
  }).on('success', function(successData){
    var successResponse = {"userUpdateSuccess": successData};
    deferred.resolve(successResponse);
  }).on('error', function(errorData){
    var errorResponse = {"userUpdateError": errorData};
    deferred.reject(errorResponse);
  });

  return deferred.promise;
}

// var createUserProfileData =

/*
This is going to be the actual snippet that is exposed from this piece of code
*/
var snippet = function(req, res) {
  var ws = factory.generateWSFromRequest(req);

  var body = req.payload.request.body;
  var profile = body['profile'];

  createUserAndLogin(profile, ws)
  .then(function(cmResponse) {

    var externalId = cmResponse["__id__"];

    validic.createValidicUser(externalId)
    .then(function(validicResponse){

      var profileData = validicResponse['user'];

      updateCMUserProfile(profileData, ws)
      .then(function(cmUpdateResponse){
        // everything has been successful - return a CM Session token and a Validic access token.

        var finalResponse = {
          "cm_session_token": cmResponse['session_token'],
          "cm_user_id": cmResponse['__id__'],
          "validic_access_token": profileData['access_token'],
          "validic_user_id": profileData['_id']
        };

        res(finalResponse);
      })
      .catch(function(error){
        res(error);
      })

    })
    .catch(function(error){
      res({'validicCreateUserError': error});
    })

  })
  .catch(function(error){
    res(error);
  })

}

module.exports = {
  "snippet": snippet,
  "createUser": createUser
}
