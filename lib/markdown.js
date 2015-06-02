"use strict";
var format = require("util").format;
const H3 = "<h3>%s</h3>";
const H2 = "<h2>%s</h2>";
const H1 = "<h1>%s</h1>";
const P = "<p>%s</p>";
const STRONG = /(\*\*).*?(\*\*)/g;
const EM = /(\*).*?(\*)/g;
const LINK = /\[.*?\]\(.*?\)/g;
const LINK_TEXT = /\[.*?\]/g;
const LINK_URL = /\(.*?\)/g;
const wrappers = [
    {
        pattern: STRONG,
        reducer: strongReducer
    },
    {
        pattern: EM,
        reducer: emReducer
    },
    {
        pattern: LINK,
        reducer: linkReducer
    }
];
function strongReducer(acc, term) {
    var modifiedTerm = "<strong>" + term.replace(/\*\*/g, "") + "</strong>";
    return acc.replace(term, modifiedTerm);
}

function emReducer(acc, term) {
    var modifiedTerm = "<em>" + term.replace(/\*/g, "") + "</em>";
    return acc.replace(term, modifiedTerm);
}

function wrap(text) {
    return wrappers.filter((wrapper)=> {
        return wrapper.pattern.test(text);
    }).reduce((acc, wrapper)=> {
        return text.match(wrapper.pattern).reduce(wrapper.reducer, acc);
    }, text);
}
function linkReducer(acc, term) {
    var url = term.match(LINK_URL)[0] || "";
    var text = term.match(LINK_TEXT)[0] || "";

    if (url.length > 0) {
        url = url.slice(1, -1);
    }
    if (text.length > 0) {
        text = text.slice(1, -1);
    }
    var modifiedTerm = format("<a href=\"%s\">%s</a>", url, text);
    return acc.replace(term, modifiedTerm);
}

function toHtml(markdown) {
    var html = markdown.split("\n").map((line)=> {
        var res;
        if (line.indexOf("###") === 0) {
            res = format(H3, line.slice(3));
        } else if (line.indexOf("##") === 0) {
            res = format(H2, line.slice(2));
        } else if (line.indexOf("#") === 0) {
            res = format(H1, line.slice(1));
        } else {
            res = format(P, line);
        }
        return res;
    }).join("");

    return wrap(html);
}

exports.toHtml = toHtml;