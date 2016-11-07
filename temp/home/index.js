var HomePage = {};

HomePage.onload = function(element){
    
    return element;
}
HomePage.routeParams = null;
HomePage.child = null;
//CTRL
HomePage.controller = function(){
	console.log("Home called",HomePage.routeParams)
}

HomePage.view = function(ctrl){
		return(
			{tag: "div", attrs: {class:"home"}, children: [
				require('modules/common/menu'), 
				{tag: "div", attrs: {class:"ui main container", config:HomePage.onload}, children: [
                    
						HomePage.child
						
                ]}, 
                require('modules/common/footer')
			]}
		)
}

HomePage.elements = function(){

}

module.exports = HomePage;