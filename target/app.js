'use strict';

require('transition');
require('form');
require("popup");
require("dropdown");

//require('dimmer');
//require('modal');
//require('visibility');
//require('tab');
//require('dropdown');
m.dropdown = function (elem) {
    jQuery(elem).dropdown();
};
m.checkbox = function (elem) {};

window.ws = null; //default null xmpp connection
m.scale = "medium"; //default scale to medium

//m.addGlobalHeader('Content-Type', 'application/json');
m.cookie = require('js-cookie');
//for semantic ui colors
m.seriesColors = ['blue', 'orange', 'teal', 'green', 'red', 'violet', 'purple', 'pink', 'brown', 'grey'];
m.colors = ['red', 'blue', 'orange', 'teal', 'olive', 'pink', 'green', 'violet', 'yellow', 'purple', 'brown', 'grey'];

var api = API;

var user = m.prop();

require('jquery.rest');

m.api = new jQuery.RestClient(API);

m.api.defaultHeaders({
    "Content-Type": "application/json; charset=UTF-8;"
});

m.api.add('users', 'users');
m.api.add('login', 'login');
m.api.add('emailLogin', 'login/email');
m.api.add('logout', 'users/logout');
m.api.add('ping');

m.urls = function (theClass, theObject, action) {
    var url = '';

    if (action) {
        url = api + '/' + theClass + '/' + theObject + '/' + action;
    } else {
        if (theObject) {
            url = api + '/' + theClass + '/' + theObject;
        } else {
            url = api + '/' + theClass;
        }
    }

    return url;
};

//start the routings
m.route = require('./routes');

// setTimeout(function(){
//     jQuery(".ui").addClass(m.scale);
// },5000)