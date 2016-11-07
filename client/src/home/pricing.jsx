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
		

				<div class="ui centered grid">

				  <div class="sixteen wide mobile eight wide tablet five wide computer column">
				  	

				  	        <div class="ui card">
					          <div class="content">
					            <div class="ui header center aligned">Free</div>
					            <div class="ui meta center aligned">30 days trial</div>
					            <div class="ui divider horizontal">$2 / month</div>
					            <div class="ui list">
					              <div class="item"><i class="icon checkmark"></i> <div class="content">
					                3 Members
					              </div></div>
					              
					              <div class="item"><i class="icon checkmark"></i> <div class="content">
					                <b>31</b> Something
					              </div></div>
					              <div class="item"><i class="icon checkmark"></i> <div class="content">
					                <b>31</b> Better Something
					              </div></div>
					              <div class="item"><i class="icon checkmark"></i> <div class="content">
					                <b>31</b> Best something?
					              </div></div>

					            </div>
					          </div>
					          <div class="extra content">
					            <button class="ui button fluid lightgrey">Choose this</button>
					          </div>
					        </div>
				  </div>
				  

				  <div class="sixteen wide mobile eight wide tablet five wide computer column">

				  	        <div class="ui card raised">
					          <div class="content">
					            <a class="ui label left corner pink">
					              <i class="icon plus"></i>
					            </a>
					            <div class="header center aligned">Classic Plan</div>
					            <div class="meta center aligned">The most popular plan</div>
					            <div class="ui divider horizontal">$27 / month</div>
					            <div class="ui list">
					              <div class="item"><i class="icon checkmark pink"></i> <div class="content">
					                3 Members
					              </div></div>
					              
					              <div class="item"><i class="icon checkmark pink"></i> <div class="content">
					                <b>31</b> Something
					              </div></div>
					              <div class="item"><i class="icon checkmark pink"></i> <div class="content">
					                <b>31</b> Better Something
					              </div></div>
					              <div class="item"><i class="icon checkmark pink"></i> <div class="content">
					                <b>31</b> Best something?
					              </div></div>
					              
					            </div>
					          </div>
					          <div class="extra content">
					            <button class="ui button fluid pink">Choose this</button>
					          </div>
					        </div>

				  </div>
				  


				  <div class="sixteen wide mobile ten wide tablet five wide computer column">

					  	<div class="ui card">
				          <div class="content">
				            <div class="header center aligned">Preferred Plan</div>
				            <div class="meta center aligned">Best for big companies</div>
				            <div class="ui divider horizontal">$37 / month</div>
				            <div class="ui list">
					              <div class="item"><i class="icon checkmark pink"></i> <div class="content">
					                10 Members
					              </div></div>
					              
					              <div class="item"><i class="icon checkmark pink"></i> <div class="content">
					                <b>90</b> Something
					              </div></div>
					              <div class="item"><i class="icon checkmark pink"></i> <div class="content">
					                <b>90</b> Better Something
					              </div></div>
					              <div class="item"><i class="icon checkmark pink"></i> <div class="content">
					                <b>90</b> Best something?
					              </div></div>
					              
					            </div>
				          </div>
				          <div class="extra content">
				            <button class="ui button fluid lightgrey">Choose this</button>
				          </div>
				        </div>

				  </div>
				  

				</div>
			  
			  
			
		)
}


module.exports = Pricing;