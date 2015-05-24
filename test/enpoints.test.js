"use strict";

var request = require("superagent");
var Hapi = require('hapi');
var rewire = require("rewire");
var markdown = rewire("../lib");
var boom = require("boom");

describe("#endpoint-test", ()=> {
    var server = new Hapi.Server();
    var text = "text";
    var item = {
        __v: 0,
        _id: "id",
        html: "<p>" + text + "</p>",
        markdown: text
    };
    before((done)=> {
        var Model = {
            find: (opts, cb)=> {
                cb(null, [item]);
            },
            findById: (id, cb)=> {
                cb(null, item);
            },
            create: (obj, cb)=> {
                obj.html.should.be.equal(item.html);
                obj.markdown.should.be.equal(item.markdown);
                cb(null, item)
            }
        };
        markdown.__set__("mongoose", require("./stub/mongoose-stub")(Model));

        server.connection({port: 3002});
        server.register({
            register: markdown
        }, () => {
            server.start(()=> {
                done();
            })
        });
    });


    after((done) => {
        server.stop(()=> {
            done();
        });
    });


    describe("#save", () => {
        it("should save data and return id", (done) => {
            request
                .put("http://localhost:3002/v1/save")
                .type("text/plain")
                .send(text)
                .end((err, res)=> {
                    res.text.should.equal("id");
                    done();
                });
        });
        it("should return an error", (done) => {
            request
                .put("http://localhost:3002/v1/save")
                .type("text/plain")
                .end((err, res)=> {
                    res.text.should.equal(JSON.stringify(boom.badData("The passed data is incorrect").output.payload));
                    done();
                });
        });

    });
    describe("#getById", () => {
        it("should save data and return id", (done) => {
            request
                .get("http://localhost:3002/v1/id")
                .end((err, res)=> {
                    res.text.should.equal(JSON.stringify(item));
                    done();
                });
        });
    });
    describe("#getAll", () => {
        it("should save data and return id", (done) => {
            request
                .get("http://localhost:3002/v1/")
                .end((err, res)=> {
                    res.text.should.equal(JSON.stringify([item]));
                    done();
                });
        });
    });

});
