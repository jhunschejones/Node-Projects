var newrelic = require('newrelic');
var Hapi = require('hapi');
var Fitbit = require('fitbit-node')
var mongoose = require('mongoose')
var Q = require('q');

mongoose.connect(/*MongDB connect string*/);
var db = mongoose.connection;

var userSchema = mongoose.Schema({
    userid: String,
    accessToken: String,
    refreshToken: String
})

// here I am saying what collection to use
var User = mongoose.model('hapi-fitbit', userSchema);

var client = new Fitbit({clientId: '', clientSecret: ''});
var redirect_uri = "https://hapi-fitbit.herokuapp.com/fitbit_oauth_callback";
var scope = "activity profile";

var server = new Hapi.Server();
var port = parseInt(process.env.PORT, 10) || '3000'

    server.connection({ 
        host: '0.0.0.0', 
        port: port
});

server.route([
    {
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
            reply('This is a web API connecting Fitbit with a MongoDB database using Hapi and Node.js. Navigate to "/fitbit" to authenticate, then "/api/v1/users" to check out the endpoints you can hit with a tool like curl or Postman. Give it a spin and enjoy!');
        }
    },
    {
        method: 'GET',
        path: '/fitbit',
        handler: function(request, reply) {
            reply().redirect(client.getAuthorizeUrl(scope, redirect_uri));
        }
    },
    {
        method: 'GET',
        path: '/fitbit_oauth_callback',
        handler: function(request, reply) {
            client.getAccessToken(request.query.code, redirect_uri).then(function(result) {
                updateUser(result.user_id, result.access_token, result.refresh_token);
                reply().redirect("/api/v1/users/" + result.user_id);
            })
        }
    },
    {
        method: 'GET',
        // tells it to format json nicely in response
        config: { json: {space: 2 } },
        path: '/api/v1/users',
        handler: function(request, reply) {
            var result = User.find();
            result.exec(function(err, users) {
                userlist = [];
                users.forEach(function(userDoc){
                    // converts immutable mongo doc to a javascript object so it can be modified
                    user = userDoc.toObject();
                    user._links = [
                        {
                            "rel": "self",
                            "href": "https://hapi-fitbit.herokuapp.com/api/v1/users/" + user.userid,
                            "method": "GET"
                        },
                        {
                            "rel": "self",
                            "href": "https://hapi-fitbit.herokuapp.com/api/v1/users/" + user.userid,
                            "method": "DELETE"
                        },
                        {
                            "rel": "summary",
                            "href": "https://hapi-fitbit.herokuapp.com/api/v1/users/" + user.userid + "/activities/summary",
                            "method": "GET"
                        },
                        {
                            "rel": "activities",
                            "href": "https://hapi-fitbit.herokuapp.com/api/v1/users/" + user.userid + "/activities",
                            "method": "GET"
                        },
                        {
                            "rel": "activities",
                            "href": "https://hapi-fitbit.herokuapp.com/api/v1/users/" + user.userid + "/activities",
                            "method": "POST"
                        }
                    ]
                    userlist.push(user)
                })
                reply(userlist);
            })
        }
    },
    {
        method: 'GET',
        path: '/api/v1/users/{fitbitid}',
        handler: function(request, reply) {
            var result = User.findOne({"userid": request.params.fitbitid});
            result.exec(function(err, user) {
                client.get("/profile.json", user.accessToken).then(function(profile){
                    reply(profile);
                })
            })
        }
    },
    {
        method: 'DELETE',
        path: '/api/v1/users/{fitbitid}',
        handler: function(request, reply) {
            User.findOneAndRemove({userid: request.params.fitbitid}, function(err, response) {
                reply().code(204);
            })
        }
    },
    {
        method: 'GET',
        config: { json: {space: 2 } },
        path: '/api/v1/users/{fitbitid}/activities/summary',
        handler: function(request, reply) {
            var result = User.findOne({"userid": request.params.fitbitid});
            result.exec(function(err, user) {
                // if there is no user redirect to /fitbit endpoint
                if (!user) { reply().redirect("/fitbit") };
                var requestDate = getFitbitDate(request.query.date);
                var requestUrl = "/activities/date/" + requestDate + ".json";
                client.get(requestUrl, user.accessToken).then(function(results) {
                    reply(results[0]["summary"]);
                    // reply(results)
                })
            })
        }
    },
    {
        method: 'GET',
        config: { json: {space: 2 } },
        path: '/api/v1/users/{fitbitid}/activities',
        handler: function(request, reply) {
            var result = User.findOne({"userid": request.params.fitbitid});
            result.exec(function(err, user) {
                // if there is no user redirect to /fitbit endpoint
                if (!user) { reply().redirect("/fitbit") };
                var requestDate = getFitbitDate(request.query.date);
                var queryString = "?afterDate=" + requestDate + "&sort=asc&offset=0&limit=50";
                var requestUrl = "/activities/list.json" + queryString;
                client.get(requestUrl, user.accessToken).then(function(results) {
                    reply(results[0]["activities"]);
                })
            })
        }
    },
    {
        method: 'POST',
        config: { json: {space: 2 } },
        path: '/api/v1/users/{fitbitid}/activities',
        handler: function(request, reply) {
            var result = User.findOne({"userid": request.params.fitbitid});
            result.exec(function(err, user) {
                var requestDate = getFitbitDate(request.query.date);
                // hard coded example activity
                var activity = {
                    "activityName": "Cycling",
                    "manualCalories": 300,
                    "startTime": "09:00:00",
                    "durationMillis": 1000*60*30,
                    "date": requestDate
                }
                var requestUrl = "/activities.json"
                client.post(requestUrl, user.accessToken, activity).then(function(results) {
                    reply(results);
                })
            })
        }
    },
    {
        method: 'DELETE',
        config: { json: {space: 2 } },
        // 'activityId' is called 'logId' in the activity object
        path: '/api/v1/users/{fitbitid}/activities/{activityId}',
        handler: function(request, reply) {
            var result = User.findOne({"userid": request.params.fitbitid});
            result.exec(function(err, user) {
                var requestUrl = "/activities/" + request.params.actiityId + ".json";
                client.delete(requestUrl, user.accessToken).then(function(results, response) {
                    console.log(response);
                    reply().code(204);
                })
            })
        }
    }
]);

function updateUser(userid, accessToken, refreshToken) {
    var deferred = Q.defer();
    var newUserInfo = {
        'userid': userid,
        'accessToken': accessToken,
        'refreshToken': refreshToken
    };
    var newUser = new User(newUserInfo);
    // upsert makes a new one if it does not exist
    User.update({"userid": userid}, newUser, {upsert: true}, function(err) {
        deferred.resolve(newUserInfo);
    });
    return deferred.promise;
}

function getFitbitDate(requestDate) {
    if (requestDate) {
        var returnDate = requestDate;
    } else {
        // building yyyy-mm-dd
        var d = new Date();
        var dateArray = [d.getFullYear(), d.getMonth() + 1, d.getDay()];
        var returnDate = dateArray.join('-');
    }
    return returnDate;
}

// Can use this to replace current code with promises
//
// function getFitbit(requestUrl, user) {
//     var deferred = Q.defer();

//     client.get(requestUrl, user.accessToken).then(function(results) {
//         if (results[0]["errors"]) {
//             deferred.reject(results[0]["errors"]);
//         } else {
//             deferred.resolve(results)
//         }
//     }).catch(function(error) {
//         deferred.reject(error);
//     })
//     return deferred.promise;
// }

server.start(function(err) {
    console.log('Hapi is listening on port 3000')
})