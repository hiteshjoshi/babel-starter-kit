var Auth = require('modules/auth');
//console.log(Auth.isLoggedIn());
var Menu = {};

//CTRL
Menu.controller = function(){
	var ctrl = {};
	ctrl.scale="huge";
	ctrl.menuItems = [
		{
			title:"Contact us",
			link:"/contact"
		}
	]

	ctrl.socialItems = [
		{
			link:"https://facebook.com/rightfit.io",
			icon:"facebook f"
		}
	]
	ctrl.nonMemberMenu = [
		{
			type:"item",
			title:"Signup",
			href:"/signup"
		},
		{
			type:"item",
			title:"Dashboard",
			href:"/dashboard"
		},
		{
			type:"item",
			title:"Settings",
			href:"/dashboard/settings"
		},
	];
	
	ctrl.memberMenu = [
		{
			type:"item",
			title:"Dashboard",
			href:"/dashboard"
		},
		{
			type:"item",
			title:"Settings",
			href:"/dashboard/settings"
		},
		{
			type:"item",
			title:"Logout",
			href:"/logout"
		},

	];

	ctrl.userMenuTitle = Auth.session_exists()?"Dashboard":"Login";
	ctrl.userMenuHref = Auth.session_exists()?"/dashboard":"/login";
	ctrl.userMenu = Auth.session_exists()?ctrl.memberMenu:ctrl.nonMemberMenu;

	if(Auth.session_exists()){ //add admin menu
		ctrl.memberMenu.push({type:"divider"})
		ctrl.memberMenu.push({type:"item",title:"Administrator",href:"/admin"})
	}
	// m.redraw(true)
	return ctrl;
}

Menu.view = function(ctrl){
		return(
					
		  <div class="ui fixed menu">
		    <div class="ui container">
		    	<div class="right menu">
		    		
		    		{
		    			ctrl.socialItems.map(function(item){

		    				return (<a class="ui item" href={item.link}> <i class={item.icon+" icon"}></i> </a>);
		    				
		    			})
		    		}
				    

				    <div class="ui simple dropdown item">

				    	<a href={ctrl.userMenuHref} class="item">{ctrl.userMenuTitle} <i class="dropdown icon"></i></a>
				    	

				    	<div class="menu">
					    	{
					    		ctrl.userMenu.map(function(item){
					    			
					    			var currentItem = null;

					    			switch(item.type) {
					    				case "item":
					    					currentItem = (<a href={item.href} config={m.fadesOutPage} class="item">{item.title}</a>)
					    				break;
					    				case "header":
					    					currentItem = (<div class="header">{item.title}</div>)
					    				break;
					    				case "divider":
					    					currentItem = (<div class="divider"></div>)
					    				break;
					    			}
					    			return currentItem;
					    		})
					    	}
				    	</div>
				    	
				    </div>

				    {
		    			ctrl.menuItems.map(function(item){

		    				var currentItem = (<a class="ui item" href={item.link}> {item.title}</a>);

		    				if(item.icon){
		    					currentItem = (<a class="ui item" href={item.link}> {item.title} <i class={item.icon+" icon"}></i> </a>);
		    				}
		    				
	    					return currentItem
		    				
		    			})
		    		}

				</div>

		    </div>
		  </div>
			
		)
}


module.exports = Menu;