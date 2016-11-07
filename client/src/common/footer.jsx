var Footer = {};

//CTRL
Footer.controller = function(){
}

Footer.view = function(ctrl){
    return(
      <div class="ui blue vertical footer segment">
        <div class="ui center aligned container">
          <div class="ui stackable pink divided grid">
            <div class="three wide column">
              <h4 class="ui blue header">Helpful articles</h4>
              <div class="ui blue link list">
                <a href="#" class="item">Link One</a>
                <a href="#" class="item">Link Two</a>
                <a href="#" class="item">Link Three</a>
                <a href="#" class="item">Link Four</a>
              </div>
            </div>
            <div class="three wide column">
              <h4 class="ui blue header">Group 2</h4>
              <div class="ui blue link list">
                <a href="#" class="item">Link One</a>
                <a href="#" class="item">Link Two</a>
                <a href="#" class="item">Link Three</a>
                <a href="#" class="item">Link Four</a>
              </div>
            </div>
            <div class="three wide column">
              <h4 class="ui blue header">Group 3</h4>
              <div class="ui blue link list">
                <a href="#" class="item">Link One</a>
                <a href="#" class="item">Link Two</a>
                <a href="#" class="item">Link Three</a>
                <a href="#" class="item">Link Four</a>
              </div>
            </div>
            <div class="seven wide column">
              <h4 class="ui blue header">Contact Info</h4>
              <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
            </div>
          </div>
          <div class="ui blue section divider"></div>
          <img src="/assets/images/rightfit_logo.svg" class="ui centered tiny image"/>
          <div class="ui horizontal pink small divided link list">
            <a class="item" href="#">Site Map</a>
            <a class="item" href="#">Contact Us</a>
            <a class="item" href="#">Terms and Conditions</a>
            <a class="item" href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    )
}


module.exports = Footer;
