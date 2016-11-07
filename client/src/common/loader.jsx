var Loader = {};

//CTRL
Loader.controller = function(){
  
  var ctrl = {};

  ctrl.onload = function(e){
    jQuery(e).height(jQuery(window).height()).width(jQuery(window).width());
  }

  return ctrl;
}

Loader.view = function(ctrl){
    return(
      <div class="ui segment" config={ctrl.onload}>
        <div class="ui active inverted pink dimmer">
          <div class="ui large text loader">Loading</div>
        </div>
      </div>
    )
}

Loader.spinner = function(e){
  return(
      <div class="ui segment" style="min-height:400px;">
        <div class="ui active inverted pink dimmer">
          <div class="ui loader"></div>
        </div>
      </div>
    )
}


module.exports = Loader;
