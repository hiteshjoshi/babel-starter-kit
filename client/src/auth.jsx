var Auth = {};

Auth.session_exists = m.prop(false);
Auth.token_set = m.prop(false);

Auth.token = m.cookie.get("haip_session");

// Auth.user = function(data){
//     console.log(data)
//     this.xmpp = {
//         username : data.xmpp_username,
//         password : data.xmpp_password
//     }
//     this.user = {
//         _id : data._id
//     }
//     this.iscompany = data.iscompany;
// }

Auth.setSession = function(token){
    m.cookie.set("haip_session",token);
    // console.log("cookie",m.cookie.get("haip_session"))
    this.session_exists=m.prop(true);
    this.PingServer()
}

Auth.clearSession = function(){
    m.cookie.remove("haip_session");
    this.session_exists=m.prop(false);
    this.token = null;
    m.redraw();
}
Auth.PingServer = function(){
    
    var that = this;
    m.api.header('Authorization', 'Bearer '+this.token);
    //send ping request to server
    m.ping.get().then(function(response){
        m.user = m.prop(response.body(false).data);
        Auth.session_exists=m.prop(true);
        m.redraw(true);
    }, function(response){
        // The reponse code is not >= 200 and < 400
        Auth.clearSession();
        page.redirect('/login')
    });
}

Auth.DoLogin = function(){
    
    if(!this.token){

        this.session_exists = m.prop(false);
        //no session exists, nothing to do
        // Bullet.trigger('auth_done');
    } else {
        Auth.PingServer();
    }

    
}
Auth.IsLoggedIn = function(){
    // console.log("token",this.token)
    return this.token? Auth.PingServer() : null;
}
module.exports = Auth;