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
      {tag: "div", attrs: {class:"ui segment", config:ctrl.onload}, children: [
        {tag: "div", attrs: {class:"ui active inverted pink dimmer"}, children: [
          {tag: "div", attrs: {class:"ui large text loader"}, children: ["Loading"]}
        ]}
      ]}
    )
}

Loader.spinner = function(e){
  return(
      {tag: "div", attrs: {class:"ui segment", style:"min-height:400px;"}, children: [
        {tag: "div", attrs: {class:"ui active inverted pink dimmer"}, children: [
          {tag: "div", attrs: {class:"ui loader"}}
        ]}
      ]}
    )
}


module.exports = Loader;
