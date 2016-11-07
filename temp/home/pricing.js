var Pricing = {};


//CTRL
Pricing.controller = function(){
	if(Auth.session_exists())
	{
		page.redirect('/dashboard')
	}
}

Pricing.view = function(ctrl){
		return(
		

				{tag: "div", attrs: {class:"ui centered grid"}, children: [

				  {tag: "div", attrs: {class:"sixteen wide mobile eight wide tablet five wide computer column"}, children: [
				  	

				  	        {tag: "div", attrs: {class:"ui card"}, children: [
					          {tag: "div", attrs: {class:"content"}, children: [
					            {tag: "div", attrs: {class:"ui header center aligned"}, children: ["Free"]}, 
					            {tag: "div", attrs: {class:"ui meta center aligned"}, children: ["30 days trial"]}, 
					            {tag: "div", attrs: {class:"ui divider horizontal"}, children: ["$2 / month"]}, 
					            {tag: "div", attrs: {class:"ui list"}, children: [
					              {tag: "div", attrs: {class:"item"}, children: [{tag: "i", attrs: {class:"icon checkmark"}}, " ", {tag: "div", attrs: {class:"content"}, children: [
					                "3 Members"
					              ]}]}, 
					              
					              {tag: "div", attrs: {class:"item"}, children: [{tag: "i", attrs: {class:"icon checkmark"}}, " ", {tag: "div", attrs: {class:"content"}, children: [
					                {tag: "b", attrs: {}, children: ["31"]}, " Something"
					              ]}]}, 
					              {tag: "div", attrs: {class:"item"}, children: [{tag: "i", attrs: {class:"icon checkmark"}}, " ", {tag: "div", attrs: {class:"content"}, children: [
					                {tag: "b", attrs: {}, children: ["31"]}, " Better Something"
					              ]}]}, 
					              {tag: "div", attrs: {class:"item"}, children: [{tag: "i", attrs: {class:"icon checkmark"}}, " ", {tag: "div", attrs: {class:"content"}, children: [
					                {tag: "b", attrs: {}, children: ["31"]}, " Best something?"
					              ]}]}

					            ]}
					          ]}, 
					          {tag: "div", attrs: {class:"extra content"}, children: [
					            {tag: "button", attrs: {class:"ui button fluid lightgrey"}, children: ["Choose this"]}
					          ]}
					        ]}
				  ]}, 
				  

				  {tag: "div", attrs: {class:"sixteen wide mobile eight wide tablet five wide computer column"}, children: [

				  	        {tag: "div", attrs: {class:"ui card raised"}, children: [
					          {tag: "div", attrs: {class:"content"}, children: [
					            {tag: "a", attrs: {class:"ui label left corner pink"}, children: [
					              {tag: "i", attrs: {class:"icon plus"}}
					            ]}, 
					            {tag: "div", attrs: {class:"header center aligned"}, children: ["Classic Plan"]}, 
					            {tag: "div", attrs: {class:"meta center aligned"}, children: ["The most popular plan"]}, 
					            {tag: "div", attrs: {class:"ui divider horizontal"}, children: ["$27 / month"]}, 
					            {tag: "div", attrs: {class:"ui list"}, children: [
					              {tag: "div", attrs: {class:"item"}, children: [{tag: "i", attrs: {class:"icon checkmark pink"}}, " ", {tag: "div", attrs: {class:"content"}, children: [
					                "3 Members"
					              ]}]}, 
					              
					              {tag: "div", attrs: {class:"item"}, children: [{tag: "i", attrs: {class:"icon checkmark pink"}}, " ", {tag: "div", attrs: {class:"content"}, children: [
					                {tag: "b", attrs: {}, children: ["31"]}, " Something"
					              ]}]}, 
					              {tag: "div", attrs: {class:"item"}, children: [{tag: "i", attrs: {class:"icon checkmark pink"}}, " ", {tag: "div", attrs: {class:"content"}, children: [
					                {tag: "b", attrs: {}, children: ["31"]}, " Better Something"
					              ]}]}, 
					              {tag: "div", attrs: {class:"item"}, children: [{tag: "i", attrs: {class:"icon checkmark pink"}}, " ", {tag: "div", attrs: {class:"content"}, children: [
					                {tag: "b", attrs: {}, children: ["31"]}, " Best something?"
					              ]}]}
					              
					            ]}
					          ]}, 
					          {tag: "div", attrs: {class:"extra content"}, children: [
					            {tag: "button", attrs: {class:"ui button fluid pink"}, children: ["Choose this"]}
					          ]}
					        ]}

				  ]}, 
				  


				  {tag: "div", attrs: {class:"sixteen wide mobile ten wide tablet five wide computer column"}, children: [

					  	{tag: "div", attrs: {class:"ui card"}, children: [
				          {tag: "div", attrs: {class:"content"}, children: [
				            {tag: "div", attrs: {class:"header center aligned"}, children: ["Preferred Plan"]}, 
				            {tag: "div", attrs: {class:"meta center aligned"}, children: ["Best for big companies"]}, 
				            {tag: "div", attrs: {class:"ui divider horizontal"}, children: ["$37 / month"]}, 
				            {tag: "div", attrs: {class:"ui list"}, children: [
					              {tag: "div", attrs: {class:"item"}, children: [{tag: "i", attrs: {class:"icon checkmark pink"}}, " ", {tag: "div", attrs: {class:"content"}, children: [
					                "10 Members"
					              ]}]}, 
					              
					              {tag: "div", attrs: {class:"item"}, children: [{tag: "i", attrs: {class:"icon checkmark pink"}}, " ", {tag: "div", attrs: {class:"content"}, children: [
					                {tag: "b", attrs: {}, children: ["90"]}, " Something"
					              ]}]}, 
					              {tag: "div", attrs: {class:"item"}, children: [{tag: "i", attrs: {class:"icon checkmark pink"}}, " ", {tag: "div", attrs: {class:"content"}, children: [
					                {tag: "b", attrs: {}, children: ["90"]}, " Better Something"
					              ]}]}, 
					              {tag: "div", attrs: {class:"item"}, children: [{tag: "i", attrs: {class:"icon checkmark pink"}}, " ", {tag: "div", attrs: {class:"content"}, children: [
					                {tag: "b", attrs: {}, children: ["90"]}, " Best something?"
					              ]}]}
					              
					            ]}
				          ]}, 
				          {tag: "div", attrs: {class:"extra content"}, children: [
				            {tag: "button", attrs: {class:"ui button fluid lightgrey"}, children: ["Choose this"]}
				          ]}
				        ]}

				  ]}
				  

				]}
			  
			  
			
		)
}


module.exports = Pricing;