var Dashboard = {};
Dashboard.second = function(element){
    m.secondDiv = element;
    return element;
}
//CTRL
Dashboard.controller = function(){




	if(Auth.session_exists() === false)
	{
		page.redirect('/login')
	}
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
						  <a class="item" href="/network">
						    Network
						  </a>
						  <a class="item">
						    Account
						  </a>						  
						</div>

					  </div>
					  
					  <div class="twelve wide column">
					  	{m.secondElem()}
					  </div>
					</div>

					
                    
                </div>
                {require('modules/common/footer')}
			</div>
		)
}


module.exports = Dashboard;