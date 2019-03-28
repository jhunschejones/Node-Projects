var Hapi = require('hapi');
var mongoose = require('mongoose');

mongoose.connect(/*MongoDB connect string*/);
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
            // find the item in the database with the highest index
            var latest_task = Task.find().sort({'index': -1}).limit(1);
            latest_task.exec(function(err, task) {
                // add one to the highest index to create new index
                new_index = task[0]["index"] + 1;
                // build new task
                newTask = new Task({
                    'task': request.payload.task,
                    'owner': request.payload.owner,
                    'index': new_index 
                })
                newTask.save(function(err, newTask) {
                    // code 201 'created'
                    reply(newTask).code(201);
                })
            })
        }
    },
    // ======= path for each item ========
    {
        method: 'GET',
        // this indicates a URI paramenter
        path: '/api/v1/todolist/{index}',
        handler: function(request, reply) {
            var result = Task.findOne({"index": request.params.index});
            result.exec(function(err,task) {
                if (task) {
                    reply(task);
                } else {
                    // send 404 if this index does not exist
                    reply().code(404)
                }
            })
        }
    },
    {
        method: 'PUT',
        // this indicates a URI paramenter
        path: '/api/v1/todolist/{index}',
        handler: function(request, reply) {
            // payload comes from post body
            // params takes uri parameter
            var updateData = {
                'task': request.payload.task,
                'owner': request.payload.owner,
                'index': request.params.index
            }
            Task.findOneAndUpdate({'index':request.params.index},updateData, {new: true}, function(err, doc) {
                reply(doc);
            })
        }
    },
    {
        method: 'DELETE',
        // this indicates a URI paramenter
        path: '/api/v1/todolist/{index}',
        handler: function(request, reply) {
            Task.findOneAndRemove({index: request.params.index}, function(err, response) {
                // empty reply with code 204 'no content'
                reply().code(204)
            })
        }
    }
]);

server.start(function(err) {
    console.log("Hapi is listening on port:3000");
})