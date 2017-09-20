var cloudmine = require('cloudmine');
var q = require('q');
var _ = require('lodash');

var validic = require('./validic');
var factory = require('./factory');

// Snippet takes in q request body that should have a session token, and a validic access token.
// If either of these are missing, for now we'll just exit out of the snippet with an error.
// take the validic access token and make a request to Validic for latest fitness activity

var getAll = function(req, res){

  validic.getFitnessAll()
  .then(function(data){
    res(data);
  })
  .catch(function(error){
    res(error);
  })

}

var getUser = function(req, res){

  var ws = factory.generateWSFromRequest(req);
  var body = req.payload.request.body;

  if (Object.keys(body).includes('cm_session_token') && Object.keys(body).includes('validic_user_id')){
    // we have a cm session token and a validic access token
    var cm_session_token = body['cm_session_token'];
    var validic_user_id = body['validic_user_id'];

    validic.getUserFitness(validic_user_id)
    .then(function(data){
      res(data);
    })
    .catch(function(error){
      res(error);
    })


  } else {
    res("either no session token or no validic ID included")
  }
}

module.exports = {
  "getAll": getAll,
  "getUser": getUser
}
