var Logout = {};

Logout.second = function(element){
    m.secondDiv = element;
    return element;
}
//CTRL
Logout.controller = function(){

	var clearSession = function(){
		Auth.clearSession();
		page.redirect('/login')
	}
	if(Auth.session_exists())
	{
		m.users.all('session').delete().then(function(response){
	        console.log("reponse",response.body(false).data)
	        // m.redraw(true);
	    }, function(response){
	        // The reponse code is not >= 200 and < 400
	        console.log("error",response)
	    });
	} else {
		clearSession()
	}

	
}

Logout.view = function(ctrl){
		return(
			<div class="dashboard">
				{require('modules/common/menu')}
				<div class="ui main container" config={Logout.second}>
                    <div class="ui segment" style="min-height:200px;">

					  <div class="ui active inverted dimmer">
					    <div class="ui text loader">Closing your session...</div>
					  </div>

					</div>
                </div>
                {require('modules/common/footer')}
			</div>
		)
}


module.exports = Logout;