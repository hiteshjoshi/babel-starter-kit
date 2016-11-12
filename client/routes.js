//Router
// A function that can merge routes.
// we want if router has parent, then mount parent first, if parent has parent, moutn that first.

import { primary, temp } from "modules/template"

class Router {

    constructor(data) {
        console.log(data)
    }

    add() {

    }
}

export default Router;

var nr = new Router({
    state: "home",
    url: "/",
    template: new temp(),
    primary: new primary(),
})

nr.add({
    url
})

console.log(nr)

var Merge = function(obj1, obj2) {

    for (var p in obj2) {
        try {
            // Property in destination object set; update its value.
            if (obj2[p].constructor == Object) {
                obj1[p] = Merge(obj1[p], obj2[p]);

            } else {
                obj1[p] = obj2[p];

            }

        } catch (e) {
            // Property in destination object not set; create it and set its value.
            obj1[p] = obj2[p];

        }
    }

    return obj1;
}
var routing = function(data, options) {

    //add routing prefix from states.
    this.addPrefix = function(route) {

        return route;
    }

    this._state = data.state;
    //state of parent
    this._parent = data.parent ? (typeof(data.parent) === "undefined" ? false : data.parent) : false;
    this._ctrl = data.ctrl;
    this._url = this.addPrefix(data.url);
    this._options = options;
    this.States = {};
    this._id = data.id || 0;




    this.load = function(element, ctrl, parent) {

        var that = this;
        console.log(that._url, that._state)
        page(that._url, function(ctx) {


            for (var i = 0; i < that._id; i++) {
                console.log(i);
            }
            if (parent) {
                //mountParent here
                that
                    .mount(parent._options.mainElement, parent._ctrl, ctx)
                    .then(function() {
                        parent._ctrl.child = ctrl; //make it secondary controller
                        m.redraw();
                    });

            } else {

                that.mount(element, ctrl, ctx)
            }
        });
    }

    this.mount = function(element, ctrl, ctx) {
        var deferred = m.deferred();
        ctrl.routeParams = ctx;
        m.mount(element, ctrl);
        deferred.resolve();
        return deferred.promise;
    }

    //update states and div sections records
    this.mountedRecords = function(state, url, id) {
        this.States[state] = url;

    }

    //execute this route and all its child routes
    this.exec = function() {

        if (this._options.loaded) {
            throw "CANNOT RUN ONCE EXEC IS PERFORMED";
        } else {
            this.run();
        }

    };

    this.run = function() {
        this.load(this._options.mainElement, this._ctrl);
        this._options.loaded = true;
        this.mountedRecords(this._state, this._url);
        page();
    }


    this.addNew = function(data) {
        return this.add(data, true);
    };

    this.add = function(data, newRoute) {
        var parent = this;

        data.id = parent._id + 1;

        var child = new routing(data, {});



        //carry forward initial options & states
        parent._options = child._options = Merge(parent._options, child._options);
        parent.States = child.States = Merge(parent.States, child.States)

        parent.mountedRecords(child._state, child._url);

        child.load(parent._options.mainElement, child._ctrl, parent);



        return newRoute ? child : parent;
    };

    return this;
}
var r = new routing({
    ctrl: require('modules/home'),
    state: "home",
    url: "/"
}, {
    mainElement: document.body,
    secondElement: null
});

r.add({
        ctrl: require('modules/home/signup'),
        parentState: "home", //this will be bound to parent url
        url: "/signup",
        state: "signup" //name of state + url after slash /
    }).add({
        ctrl: require('modules/home/login'),
        parentState: "home", //this will be bound to parent url
        url: "/login",
        state: "login" //name of state + url after slash /
    })
    .exec();

//console.log(r.States);
//custom animations
m.mainElement = document.body;

m.fadesOutPage = function(element, isInitialized, context) {

    if (!isInitialized) {
        element.onclick = function(e) {
            e.preventDefault()


            jQuery(element).siblings('.active').removeClass('active');
            jQuery(element).addClass('active');


            page(element.getAttribute("href"))
        }
    }
}

//ask Auth.js to do auth
var Auth = require('modules/auth');

Bullet.on('auth_done', function() {
    //page();
    m.redraw();
})

Auth.DoLogin();
//page()