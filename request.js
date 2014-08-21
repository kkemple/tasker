var request = require('request');

request.get('https://util01.303net.net/jira/rest/api/2/search?jql=assignee=kurtis', function(error, response, body) {
    console.log(body);
})
.auth('kurtis', 'Winter2014', true);
