"use strict";

var rewire = require("rewire");
var markdown = rewire("../lib/markdown");

describe("#markdown", ()=> {
    describe("#toHtml", ()=> {

        it("should map the line to the <h3> tag", ()=> {
            markdown.toHtml("###sometext").should.be.eql("<h3>sometext</h3>");
        });
        it("should map the line to the <h2> tag", ()=> {
            markdown.toHtml("##sometext").should.be.eql("<h2>sometext</h2>");
        });
        it("should map the line to the <h1> tag", ()=> {
            markdown.toHtml("#sometext").should.be.eql("<h1>sometext</h1>");
        });
        it("should map the line to the <p> tag", ()=> {
            markdown.toHtml("sometext").should.be.eql("<p>sometext</p>");
        });
        it("should map lines to correct tags", ()=> {
            markdown.toHtml("[a_text](http://p_text)\n###**h3_text**\n##*h2_text*\n#h1_text").should.be.eql("<p><a href=\"http://p_text\">a_text</a></p>\n<h3><strong>h3_text</strong></h3>\n<h2><em>h2_text</em></h2>\n<h1>h1_text</h1>");
        });
    });

    describe("#strongReducer",()=>{
        var strongReducer = markdown.__get__("strongReducer");
        it("should wrap the marked text to the <strong>",()=>{
            strongReducer("text **wrapped text** text","**wrapped text**").should.be.eql("text <strong>wrapped text</strong> text");
        });
    });


    describe("#emReducer",()=>{
        var emReducer = markdown.__get__("emReducer");
        it("should wrap the marked text to the <em>",()=>{
            emReducer("text *wrapped text* text","*wrapped text*").should.be.eql("text <em>wrapped text</em> text");
        });
    });


    describe("#linkReducer",()=>{
        var linkReducer = markdown.__get__("linkReducer");
        it("should wrap the marked text to the <a href>",()=>{
            linkReducer("text [example link](http://www.google.com) text","[example link](http://www.google.com)").should.be.eql("text <a href=\"http://www.google.com\">example link</a> text");
        });
    });

    describe("#lineWrapper",()=>{
        var lineWrapper = markdown.__get__("lineWrapper");
        it("should wrap the marked text to the <em>",()=>{
            lineWrapper("text *wrapped text* text *wrapped text*").should.be.eql("text <em>wrapped text</em> text <em>wrapped text</em>");
        });

        it("should wrap the marked text to the <a href>",()=>{
            lineWrapper("text [example link](http://www.google.com) text").should.be.eql("text <a href=\"http://www.google.com\">example link</a> text");
        });
    });
});

