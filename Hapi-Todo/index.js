var Hapi = require('hapi');
var mongoose = require('mongoose');

mongoose.connect('mongodb://user:password1@ds119702.mlab.com:19702/hapi-practice');
var db = mongoose.connection;

var taskSchema = mongoose.Schema({
        task: String,
        owner: String,
        index: Number
});

var Task = mongoose.model('Task', taskSchema)

var server = new Hapi.Server();
server.connection({ port: 3000 });

// routs are indicated by objects in an array
server.route([
    // ======= home path ========
    {
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
            reply('Hello world from Hapi.')
        }
    },
    // ======== todolist path ============
    {
        method: 'GET',
        path: '/api/v1/todolist',
        handler: function(request, reply) {
            // reverse sort, newest item first
            var result = Task.find().sort({'index': -1}).limit(10);
            // important note, 'tasks' below is the  
            // name of the collection in mlab
            result.exec(function(err,tasks) {
                reply(tasks);
            });
        }
    },
    {
        method: 'POST',
        path: '/api/v1/todolist',
        handler: function(request, reply) {
            var newTask = { "task": request.payload.task, "owner": request.payload.owner};
            todolist.push(newTask);
            // sends updated todolist along with code 201 'created'
            reply(todolist).code(201)
        }
    },
    // ======= path for each item ========
    {
        method: 'GET',
        // this indicates a URI paramenter
        path: '/api/v1/todolist/{index}',
        handler: function(request, reply) {
            reply(todolist[request.params.index -1])
        }
    },
    {
        method: 'PUT',
        // this indicates a URI paramenter
        path: '/api/v1/todolist/{index}',
        handler: function(request, reply) {
            var newTask = { "task": request.payload.task, "owner": request.payload.owner};
            todolist[request.params.index -1] = newTask
            reply(todolist[request.params.index -1])
        }
    },
    {
        method: 'DELETE',
        // this indicates a URI paramenter
        path: '/api/v1/todolist/{index}',
        handler: function(request, reply) {
            delete todolist[request.params.index -1]
            // empty reply with code 204 'no content'
            reply().code(204)
        }
    }
]);

server.start(function(err) {
    console.log("Hapi is listening on port:3000");
})