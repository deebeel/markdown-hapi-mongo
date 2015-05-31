"use strict";

var mongooseStub = require("./stub/mongoose-stub");
var Model = {
    find: (opts, cb)=> {
        cb([]);
    },
    findById: (id, cb)=> {
        cb({id: id});
    },
    create: (obj,cb)=> {
        cb(null, {
            _id: "id"
        })
    }
};
var rewire = require("rewire");
var plugin = rewire("../lib");
plugin.__set__("mongoose",mongooseStub(Model));


describe("#plugin-unit", ()=> {
    describe("#handlers", ()=> {
        describe("#getAllHandler", ()=> {
            it("should load nothing", (done)=> {
                var getAllHandler = plugin.__get__("getAllHandler");
                getAllHandler(Model)({}, (res)=> {
                    res.should.be.eql([]);
                    done();
                });
            });
        });
        describe("getByIdHandler", ()=> {
            it("should get one res", (done)=> {
                var getByIdHandler = plugin.__get__("getByIdHandler");
                getByIdHandler(Model)({
                    params: {
                        id:"id"
                    }
                }, (res)=> {
                    res.should.be.eql({"id":"id"});
                    done();
                });
            });
        });


        describe("saveHandler", ()=> {
            it("should save data and return id", (done)=> {
                var saveHandler = plugin.__get__("saveHandler");
                saveHandler(Model)({payload: "markdown"}, (res)=> {
                    res.should.be.equal("id");
                    done();
                });
            });
        });
    });

    describe("#private functions", ()=> {
        describe("#markdownToHtml", ()=> {
            var markdownToHtml = plugin.__get__("markdownToHtml");
            it("should wrap markdown text with h1 tag", ()=> {
                markdownToHtml("#hello, markdown!").should.be.eql("<h1>hello, markdown!</h1>")
            });
            it("should wrap markdown text with h2 tag", ()=> {
                markdownToHtml("##hello, markdown!").should.be.eql("<h2>hello, markdown!</h2>")
            });
            it("should wrap markdown text with h3 tag", ()=> {
                markdownToHtml("###hello, markdown!").should.be.eql("<h3>hello, markdown!</h3>")
            });
            it("should wrap markdown text with p tag", ()=> {
                markdownToHtml("hello, markdown!").should.be.eql("<p>hello, markdown!</p>")
            });
            it("should wrap markdown text with em tag", ()=> {
                markdownToHtml("*hello, markdown!*").should.be.eql("<p><em>hello, markdown!</em></p>")
            });
            it("should wrap markdown text with strong tag", ()=> {
                markdownToHtml("**hello, markdown!**").should.be.eql("<p><strong>hello, markdown!</strong></p>")
            });
            it("should wrap markdown text with href tag", ()=> {
                markdownToHtml("[sometext](http://localhost)").should.be.eql("<p><a href=\"http://localhost\">sometext</a></p>")
            });
        });

        describe("#makeDataForModel", ()=> {
            var makeDataForModel = plugin.__get__("makeDataForModel");
            it("should convert a markdown to a html", ()=> {
                var markdown = "#hello, markdown!";
                makeDataForModel(markdown).should.be.eql({
                    html: "<h1>hello, markdown!</h1>",
                    markdown: markdown
                })
            });
        });
    });

});

