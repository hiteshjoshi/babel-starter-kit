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
			{tag: "div", attrs: {class:"dashboard"}, children: [
				require('modules/common/menu'), 
				{tag: "div", attrs: {class:"ui main container", config:Dashboard.second}, children: [

					{tag: "div", attrs: {class:"ui grid"}, children: [
					  {tag: "div", attrs: {class:"four wide column"}, children: [
					  	
					  	{tag: "div", attrs: {class:"ui vertical pink pointing menu"}, children: [
						  {tag: "a", attrs: {class:"active item"}, children: [
						    "Dashboard"
						  ]}, 
						  {tag: "a", attrs: {class:"item", href:"/network"}, children: [
						    "Network"
						  ]}, 
						  {tag: "a", attrs: {class:"item"}, children: [
						    "Account"
						  ]}						  
						]}

					  ]}, 
					  
					  {tag: "div", attrs: {class:"twelve wide column"}, children: [
					  	m.secondElem()
					  ]}
					]}

					
                    
                ]}, 
                require('modules/common/footer')
			]}
		)
}


module.exports = Dashboard;