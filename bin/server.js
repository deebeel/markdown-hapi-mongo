"use strict";

var Hapi = require('hapi');
var markdown = require("../index");
var server = new Hapi.Server();
server.connection({port: 3000});

server.register({
    register: markdown,
    options:{
        collection:"democol",
        database:"demodb",
        host:"localhost",
        port:27017
    }
}, (err) => {
    if (err) {
        console.error('Failed to load plugin:', err);
    } else {
        server.start(()=> {
            console.info("server started at ", server.info.uri);
        })
    }
});
