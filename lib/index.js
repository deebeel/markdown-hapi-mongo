"use strict";
var mongoose = require('mongoose');
var toHtml = require("./markdown").toHtml;
var format = require("util").format;
var Boom = require("boom");
function markdownToHtml(markdown) {
    return toHtml(markdown);
}


function makeDataForModel(markdown) {
    return {html: markdownToHtml(markdown), markdown: markdown};
}

function getByIdHandler(Model) {
    return (request, reply) => {
        Model.findById(request.params.id, reply);
    };
}
function getAllHandler(Model) {
    return (request, reply) => {
        Model.find({}, reply);
    };
}
function saveHandler(Model) {
    return (request, reply) => {
        var markdown = request.payload;
        if(typeof markdown !== "string" || markdown.length === 0){
            reply(Boom.badData("The passed data is incorrect"))
        }else{
            Model.create(makeDataForModel(markdown), (err, res)=> {
                reply(err || res["_id"]);
            });
        }

    };
}

exports.register = function (server, opts, next) {
    var port = opts.port || 27017;
    var host = opts.host || "localhost";
    var database = opts.database || "test_db";
    var collection = opts.collection || "test_collection";
    mongoose.connect(format("mongodb://%s:%s/%s", host, port, database));
    var Model = mongoose.model(collection, {html: String, markdown: String});
    server.route({
        method: 'GET',
        path: '/v1/{id}',
        handler: getByIdHandler(Model)
    });
    server.route({
        method: 'GET',
        path: '/v1/',
        handler: getAllHandler(Model)
    });


    server.route({
        method: 'PUT',
        path: '/v1/save',
        config: {
            payload:{
                parse:true,
                allow:["text/plain"]
            }
        },
        handler: saveHandler(Model)
    });

    next();
};

exports.register.attributes = {
    name: 'markdownPlugin',
    version: '1.0.0'
};



