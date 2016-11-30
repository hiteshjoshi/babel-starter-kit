var HomePage = {};

HomePage.onload = function(element){
    
    return element;
}
HomePage.routeParams = null;
HomePage.child = null;
//CTRL
HomePage.controller = function(){
	// console.log("Home called",HomePage.routeParams)
}

HomePage.view = function(ctrl){
		return(
			<div class="home">
				{require('modules/common/menu')}
				<div class="ui main container" config={HomePage.onload}>
                    {
						HomePage.child
						}
                </div>
                {require('modules/common/footer')}
			</div>
		)
}

HomePage.elements = function(){

}

module.exports = HomePage;