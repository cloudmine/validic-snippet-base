var cloudmine = require('cloudmine');

function generateWS(creds) {
  return new cloudmine.WebService(creds);
}

function generateWSFromRequest(requestObject) {
  var session = requestObject.payload.session;

  var creds = {
    'appid': session['app_id'],
    'apikey': session['api_key']
  }

  return generateWS(creds);

}

module.exports = {
  "generateWS": generateWS,
  "generateWSFromRequest": generateWSFromRequest
}
