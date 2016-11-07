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
		{
			type:"item",
			title:"Logout",
			href:"/logout"
		},

	];

	ctrl.userMenu = ctrl.nonMemberMenu;
	ctrl.userMenuTitle = Auth.session_exists()?"Dashboard":"Login";
	ctrl.userMenuHref = Auth.session_exists()?"/dashboard":"/login";
	ctrl.userMenu = Auth.session_exists()?ctrl.memberMenu:ctrl.nonMemberMenu;

	if(Auth.session_exists()){ //add admin menu
		ctrl.memberMenu.push({type:"divider"})
		ctrl.memberMenu.push({type:"item",title:"Administrator",href:"/admin"})
	}

	

	return ctrl;
}

Menu.view = function(ctrl){
		return(
					
		  {tag: "div", attrs: {class:"ui fixed menu"}, children: [
		    {tag: "div", attrs: {class:"ui container"}, children: [
		    	{tag: "div", attrs: {class:"right menu"}, children: [
		    		
		    		
		    			ctrl.socialItems.map(function(item){

		    				return ({tag: "a", attrs: {class:"ui item", href:item.link}, children: [" ", {tag: "i", attrs: {class:item.icon+" icon"}}, " "]});
		    				
		    			}), 
		    		
				    

				    {tag: "div", attrs: {class:"ui simple dropdown item"}, children: [

				    	{tag: "a", attrs: {href:ctrl.userMenuHref, class:"item"}, children: [ctrl.userMenuTitle, " ", {tag: "i", attrs: {class:"dropdown icon"}}]}, 
				    	

				    	{tag: "div", attrs: {class:"menu"}, children: [
					    	
					    		ctrl.userMenu.map(function(item){
					    			
					    			var currentItem = null;

					    			switch(item.type) {
					    				case "item":
					    					currentItem = ({tag: "a", attrs: {href:item.href, config:m.fadesOutPage, class:"item"}, children: [item.title]})
					    				break;
					    				case "header":
					    					currentItem = ({tag: "div", attrs: {class:"header"}, children: [item.title]})
					    				break;
					    				case "divider":
					    					currentItem = ({tag: "div", attrs: {class:"divider"}})
					    				break;
					    			}
					    			return currentItem;
					    		})
					    	
				    	]}
				    	
				    ]}, 

				    
		    			ctrl.menuItems.map(function(item){

		    				var currentItem = ({tag: "a", attrs: {class:"ui item", href:item.link}, children: [" ", item.title]});

		    				if(item.icon){
		    					currentItem = ({tag: "a", attrs: {class:"ui item", href:item.link}, children: [" ", item.title, " ", {tag: "i", attrs: {class:item.icon+" icon"}}, " "]});
		    				}
		    				
	    					return currentItem
		    				
		    			})
		    		

				]}

		    ]}
		  ]}
			
		)
}


module.exports = Menu;