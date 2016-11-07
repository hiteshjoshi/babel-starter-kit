var Auth = {};

Auth.session_exists = m.prop(false);
Auth.token_set = m.prop(false);

Auth.token = m.cookie.get("rf_session");

Auth.user = function(data){
    console.log(data)
    this.xmpp = {
        username : data.xmpp_username,
        password : data.xmpp_password
    }
    this.user = {
        _id : data._id
    }
    this.iscompany = data.iscompany;
}

Auth.setSession = function(token){
    m.cookie.set("rf_session",token);
    
    m.api.token(token)

    this.session_exists=m.prop(true);
}

Auth.clearSession = function(){
    m.cookie.remove("rf_session");
    this.session_exists=m.prop(false);
    this.token = null;
    m.redraw();
}
Auth.PingServer = function(){
    
    var that = this;

    m.api
    .ping.read('')
    .then(function(response,success,xhr){
        //successful!
        if(success){
            
            that.session_exists = m.prop(true);
            
            user = new that.user(response.data);
            m.api.release('ping');
            Bullet.trigger('auth_done');
        }
    })
    .error(function(xhr,error){
        Auth.clearSession();
        m.api.release('ping');
        Bullet.trigger('auth_done');         
    })
}

Auth.DoLogin = function(){
    
    if(!this.token){

        this.session_exists = m.prop(false);
        //no session exists, nothing to do
        Bullet.trigger('auth_done');
    } else {
        m.api.token(this.token);
        Auth.PingServer();
    }

    
}
module.exports = Auth;