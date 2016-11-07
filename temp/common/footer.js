var Footer = {};

//CTRL
Footer.controller = function(){
}

Footer.view = function(ctrl){
    return(
      {tag: "div", attrs: {class:"ui blue vertical footer segment"}, children: [
        {tag: "div", attrs: {class:"ui center aligned container"}, children: [
          {tag: "div", attrs: {class:"ui stackable pink divided grid"}, children: [
            {tag: "div", attrs: {class:"three wide column"}, children: [
              {tag: "h4", attrs: {class:"ui blue header"}, children: ["Helpful articles"]}, 
              {tag: "div", attrs: {class:"ui blue link list"}, children: [
                {tag: "a", attrs: {href:"#", class:"item"}, children: ["Link One"]}, 
                {tag: "a", attrs: {href:"#", class:"item"}, children: ["Link Two"]}, 
                {tag: "a", attrs: {href:"#", class:"item"}, children: ["Link Three"]}, 
                {tag: "a", attrs: {href:"#", class:"item"}, children: ["Link Four"]}
              ]}
            ]}, 
            {tag: "div", attrs: {class:"three wide column"}, children: [
              {tag: "h4", attrs: {class:"ui blue header"}, children: ["Group 2"]}, 
              {tag: "div", attrs: {class:"ui blue link list"}, children: [
                {tag: "a", attrs: {href:"#", class:"item"}, children: ["Link One"]}, 
                {tag: "a", attrs: {href:"#", class:"item"}, children: ["Link Two"]}, 
                {tag: "a", attrs: {href:"#", class:"item"}, children: ["Link Three"]}, 
                {tag: "a", attrs: {href:"#", class:"item"}, children: ["Link Four"]}
              ]}
            ]}, 
            {tag: "div", attrs: {class:"three wide column"}, children: [
              {tag: "h4", attrs: {class:"ui blue header"}, children: ["Group 3"]}, 
              {tag: "div", attrs: {class:"ui blue link list"}, children: [
                {tag: "a", attrs: {href:"#", class:"item"}, children: ["Link One"]}, 
                {tag: "a", attrs: {href:"#", class:"item"}, children: ["Link Two"]}, 
                {tag: "a", attrs: {href:"#", class:"item"}, children: ["Link Three"]}, 
                {tag: "a", attrs: {href:"#", class:"item"}, children: ["Link Four"]}
              ]}
            ]}, 
            {tag: "div", attrs: {class:"seven wide column"}, children: [
              {tag: "h4", attrs: {class:"ui blue header"}, children: ["Contact Info"]}, 
              {tag: "p", attrs: {}, children: ["Extra space for a call to action inside the footer that could help re-engage users."]}
            ]}
          ]}, 
          {tag: "div", attrs: {class:"ui blue section divider"}}, 
          {tag: "img", attrs: {src:"/assets/images/rightfit_logo.svg", class:"ui centered tiny image"}}, 
          {tag: "div", attrs: {class:"ui horizontal pink small divided link list"}, children: [
            {tag: "a", attrs: {class:"item", href:"#"}, children: ["Site Map"]}, 
            {tag: "a", attrs: {class:"item", href:"#"}, children: ["Contact Us"]}, 
            {tag: "a", attrs: {class:"item", href:"#"}, children: ["Terms and Conditions"]}, 
            {tag: "a", attrs: {class:"item", href:"#"}, children: ["Privacy Policy"]}
          ]}
        ]}
      ]}
    )
}


module.exports = Footer;
