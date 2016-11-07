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

//am I inside parent route or child?
//m.whereAmI = m.prop("parent");

//if parent page is mounted?
//m.parentMounted = m.prop(false);

// var HomeRoutes = {
//     "/": {
//         noAnimate: true,
//         state: 'home',
//         gotChild: true,
//         defaultChild: require('modules/home/splash'),
//         ctrl: require('modules/home')
//     },
//     "/404": {
//         noAnimate: true,
//         state: 'home',
//         gotChild: true,
//         defaultChild: require('modules/home/404'),
//         ctrl: require('modules/home')
//     },
//     "/login": {
//         noAnimate: false,
//         state: 'login',
//         gotChild: false,
//         parent: "/",
//         ctrl: require('modules/home/login')
//     },
//     "/signup": {
//         noAnimate: false,
//         state: 'signup',
//         gotChild: false,
//         parent: "/",
//         ctrl: require('modules/home/signup')
//     }
// }

// Object.keys(HomeRoutes).map(function(route) {

//     var r = HomeRoutes[route]



//     page(route, function(ctx) {

//         m.params = ctx.params;

//         //need to update child element only.
//         if (r.gotChild) {
//             m.whereAmI = m.prop("child");
//         }


//         m.secondElem = m.prop((r.defaultChild || null));

//         //if got child is true, this probably be a parent
//         if (!r.gotChild && r.parent) {

//             //initialise child
//             m.secondElem = m.prop(r.ctrl)

//             //mount parent
//             m.mount(m.mainElement, HomeRoutes[r.parent].ctrl);

//             r.ctrl.loaded() ? (console.log("LOADED")) : (console.log("DIDNT LOAD"));

//         } else {
//             m.mount(m.mainElement, r.ctrl);
//         }

//         // if (!r.noAnimate)
//         // //animate primary div
//         //     jQuery(m.secondDiv)
//         //     .transition({
//         //         animation: 'fade top',
//         //         onComplete: function() {
//         //             //page(element.getAttribute("href"))
//         //             jQuery(m.secondDiv).transition('fade top')
//         //         }
//         //     })
//     });
// });


// var DashboardRoutes = {
//     "/dashboard": {
//         noAnimate: false,
//         state: 'dashboard',
//         gotChild: true,
//         defaultChild: require('modules/dashboard/analytics'),
//         ctrl: require('modules/dashboard')
//     },
//     "/settings": {
//         state: "settings",
//         parent: "/dashboard",
//         ctrl: require('modules/dashboard/settings')
//     },
//     "/network": {
//         state: "network",
//         noParentUrl: true,
//         parent: "/dashboard",
//         ctrl: require('modules/dashboard/network')
//     },
//     "/new": {
//         state: "new",
//         noParentUrl: true,
//         parent: "/dashboard",
//         ctrl: require('modules/dashboard/new')
//     },

//     "/logout": {
//         state: "logout",
//         noParentUrl: true,
//         parent: "/logout",
//         ctrl: require('modules/dashboard/logout')
//     }
// }

// Object.keys(DashboardRoutes).map(function(route) {

//     var r = DashboardRoutes[route]

//     if (r.parent && !r.noParentUrl) {
//         route = r.parent + route // 
//     }

//     page(route, function(ctx) {

//         m.params = ctx.params;

//         //need to update child element only.
//         if (r.gotChild) {
//             m.whereAmI = m.prop("child");
//         }

//         //only mount parent if this has got child
//         m.parentMounted = m.prop(r.gotChild);

//         m.secondElem = m.prop(r.defaultChild || null);

//         if (!m.parentMounted() && r.parent) {

//             //initialise child
//             m.secondElem = m.prop(r.ctrl)

//             //mount parent
//             m.mount(m.mainElement, DashboardRoutes[r.parent].ctrl);

//             m.parentMounted = m.prop(true);

//         } else {
//             m.mount(m.mainElement, r.ctrl);
//         }

//     });
// });


// page('*', function() {
//     page.redirect("/404")
// })



//create full screen animation here.
//
//m.mount(m.mainElement, require('modules/common/loader'));

//ask Auth.js to do auth
var Auth = require('modules/auth');

Bullet.on('auth_done', function() {
    //page();
    m.redraw();
})

Auth.DoLogin();
//page()