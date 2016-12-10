var Dashboard = {};
Dashboard.second = function(element){
    m.secondDiv = element;
    return element;
}
var Auth = require('modules/auth');

//CTRL
Dashboard.controller = function(){

	var that = this;
	if(document.URL.split(",")[0].split("=")[0].split("?")[1]=="token"){
		var token = document.URL.split(",")[0].split("=")[1]
		Auth.setSession(token)
	}

	if(!Auth.session_exists())
	{
			page.redirect('/login')
	}
	that.secondElem=m.prop(null)
	if(that.secondElem===m.prop(null)){
		that.secondElem=require('modules/dashboard/analytics')
	}
	that.changeTab = function(e){
		console.log(e)
	}
	// m.secondElem===m.prop(null)
	// if(m.secondElem()===null){
	// 	m.secondElem = m.prop(require('modules/dashboard/analytics'))
	// }
}

Dashboard.view = function(ctrl){
		return(
			<div class="dashboard">
				{require('modules/common/menu')}
				<div class="ui main container" config={Dashboard.second}>

					<div class="ui grid">
					  <div class="four wide column">
					  	
					  	<div class="ui vertical pink pointing menu">
						  <a class="active item">
						    Dashboard
						  </a>
						  <a class="item" id="network" style="cursor:pointer;" onclick={ctrl.changeTab}>
						    Network
						  </a>
						  <a class="item">
						    Account
						  </a>						  
						</div>

					  </div>
					  
					  <div class="twelve wide column" config={Dashboard.second}>
					  	{require('modules/dashboard/analytics')}
					  </div>
					</div>

					
                    
                </div>
                {require('modules/common/footer')}
			</div>
		)
}


module.exports = Dashboard;