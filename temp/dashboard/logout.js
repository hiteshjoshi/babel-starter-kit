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
		m.api.logout.post('')
		.then(function(){
			clearSession()
		})
		.error(function(){
			clearSession()
		})
	} else {
		clearSession()
	}

	
}

Logout.view = function(ctrl){
		return(
			{tag: "div", attrs: {class:"dashboard"}, children: [
				require('modules/common/menu'), 
				{tag: "div", attrs: {class:"ui main container", config:Logout.second}, children: [
                    {tag: "div", attrs: {class:"ui segment", style:"min-height:200px;"}, children: [

					  {tag: "div", attrs: {class:"ui active inverted dimmer"}, children: [
					    {tag: "div", attrs: {class:"ui text loader"}, children: ["Closing your session..."]}
					  ]}

					]}
                ]}, 
                require('modules/common/footer')
			]}
		)
}


module.exports = Logout;