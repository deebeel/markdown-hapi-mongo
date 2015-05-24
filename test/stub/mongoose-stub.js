"use strict";

module.exports = (Model)=>{
    return{
        connect: ()=> {
        },
        model: ()=> {
            return Model;
        }
    };
};