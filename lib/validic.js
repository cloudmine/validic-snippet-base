var q = require('q');
var rp = require('request-promise');

var constants = require('./constants');

var base_opts = {
  method: "GET",
  uri: constants.VDC_BASE_URL,
  headers: {
    "content-type": "application/json"
  }
}


function api(opts) {
  return rp(opts);
}


function createValidicUser(externalId) {
  var opts = base_opts;
  opts['uri'] += '/v1/organizations/' + constants.VDC_ORG_ID + '/users.json';
  opts['method'] = "POST";
  opts['json'] = true;

  opts['body'] = {
    "user": {
  		"uid": externalId
  	},
  	"access_token": constants.VDC_ACCESS_TOKEN
  };

  return api(opts);

}


function getFitnessAll(){
  var opts = base_opts;
  opts['uri'] += '/v1/organizations/' + constants.VDC_ORG_ID + '/fitness/latest.json';
  opts['json'] = true;

  opts['qs'] = {
    access_token: constants.VDC_ACCESS_TOKEN
  };

  return api(opts);

}


function getUserFitness(vdcUserId){
  var opts = base_opts;
  opts['uri'] += '/v1/organizations/' + constants.VDC_ORG_ID + '/users/' + vdcUserId + '/fitness';
  opts['json'] = true;

  opts['qs'] = {
    access_token: constants.VDC_ACCESS_TOKEN
  };

  return api(opts);

}

module.exports = {
  "createValidicUser": createValidicUser,
  "getFitnessAll": getFitnessAll,
  "getUserFitness": getUserFitness
};
