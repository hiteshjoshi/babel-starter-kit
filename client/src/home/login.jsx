var Login = {};
Login.showCountry = m.prop(false);
var Auth = require('modules/auth');
// email validation
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function validateNumber(number){
	var re = /^\d+$/;
	return re.test(number);
}
// jQuery.fn.form.settings.rules.inputPassword = function(value,length){
// 	if(Login.showCountry()) return true;
	
// 	if(value.length === 0) return true; //hack to not show message when its selected and moved on

// 	return Login.showCountry() || value.length>6;
// }
// //custom validation fields
// jQuery.fn.form.settings.rules.inputLogin = function(value){
	
// 		if(Login.showCountry()) return true;

// 		var isNumber = validateNumber(value);
// 		//console.log("I am calleds",value,parsedValue,isNaN(parsedValue));
// 		if(!isNumber){//this is email probably
// 			if(validateEmail(value)){
// 				return true
// 			}
// 			else 
// 				return false			
			
// 		} else { // this is a number, perhaps a mobile?
// 			if(value.length!= 10){
// 				return false;
// 			} else {
// 				return true;
// 			}
// 		}
// };

Login.loaded = m.prop(false);
//CTRL
Login.controller = function(){

	var that = this;
	Bullet.on('auth_done', function() {
		if(Auth.session_exists())
		{
			page.redirect('/dashboard')
		}
	})
	m.startComputation();

	require.ensure(["js/country_code"], function(require) {
		
		//----variables for country----
		Login.countries = require("js/country_code");

		that.selected_country = m.prop("");

		that.change_country = function(e){
			that.selected_country = m.prop(e.target.value);
		}.bind(that);

		that.dropdown = function(e){
			jQuery(e).dropdown({
				useLabels: true,
				//onChange:that.change_Country
			});

		};
		//----variables end for coutry----

		//to hold all jquery elements required.
		that.elements = {}

		that.segmentLoading = function(e){
			that.elements.formSegment = jQuery(e);
		}

		that.errors = function(e){
			that.elements.errors = jQuery(e);
		}

		//the login string to validate
		that.loginString = that.loginString?that.loginString():m.prop("");
		//alert(that.loginString());
		that.inputLogin = function(e){
			
			that.loginString = m.prop(e.target.value);
			
			var isNumber = validateNumber(that.loginString());
			
			if(!isNumber)
				//this is email probably
				Login.showCountry= m.prop(false);
			else // this is a number, perhaps a mobile?
				Login.showCountry= m.prop(true);

			m.withAttr("value", that.loginString())
		}.bind(that)

		//the main login after form validation
		that.login = function(event, fields){
			
			var loginparam = (Login.showCountry()?m.api.login : m.api.emailLogin);

			event.preventDefault();
			//jQuery(that.elements.form).form('remove prompt', 'email');
			//console.log(m.api.users.create('login',fields))

			
			loginparam.post(fields)
			.then(function(response,success,xhr) {
				
							if(response.error==true)
				{
					jQuery(that.elements.form).removeClass('success').addClass('error')
					Object.keys(response.errors).forEach(function(error,i){
					
						Login.show_msg = m.prop(true);
						Login.errors=m.prop([response.errors[error]]);						
						
						jQuery(that.elements.form).find("[name='"+error+"']").parent().addClass('error');
						
					});
					that.elements.formSegment.removeClass("loading");
					
				} else {
					Auth.setSession(response.data.token);
					page.redirect("/dashboard")

				}
				m.api.release('login');
				m.redraw();

					})
					.error(function(xhr,error){
						//console.log("HERE",xhr.responseJSON)
							var response = xhr.responseJSON;
							jQuery(that.elements.form).removeClass('success').addClass('error')

							if(xhr.status == 401 || xhr.status == 403){
								Object.keys(response.errors).forEach(function(error,i){
						
						Login.show_msg = m.prop(true);
						Login.errors=m.prop([response.errors[error]]);						
						jQuery(that.elements.form).find("[name='"+error+"']").parent().addClass('error');
						
					});
					
							} else {
								Login.show_msg = m.prop(true);
								Login.errors=m.prop([{msg:response.userMessage || "Server error, please try again."}]);									
								jQuery(that.elements.form).find("[name='"+error+"']").parent().addClass('error');
							}
							that.elements.formSegment.removeClass("loading");
				m.api.release('login');
				m.redraw();
					})

					m.api.wait('login')
			
			
			//loading
			that.elements.formSegment.addClass("loading");
		}

		that.Twitter = function(e){
			m.request({method: "GET", url: "/user"}).then(users).then(doSomething)
		}
		
		//when form loads, this will validate fields
		that.onLoad = function(e){

			that.elements.form = jQuery(e)

			jQuery(e)
				.form({
					fields : {
						email:{
							identifier : 'email',
							rules: [
									{
										type   : 'inputLogin',
										prompt : "A valid email address or 10 digits phone number is required"
									}
								]
						},
						password:{
							identifier : 'password',
							rules: [
									{
										type   : 'inputPassword[6]',
										prompt : 'Please enter a valid password. Minimum 6 digits'
									}
								]
						},

					},
					inline : true,
					on     : 'blur',
					onSuccess : that.login
				})
			;
		}

		Login.loaded = m.prop(true);
		m.endComputation();

	});


}





Login.ErrorList = function(errors){
	
	return this.show_msg()?(
		<ul class="list">
			{
				errors.map(function(error,i){
					return (<li> {error.msg} </li>);
				})
			}
		</ul>
	):null;
}
Login.show_msg = m.prop(false);
Login.errors = m.prop([]);

Login.form = function(ctrl){

	var that = this;

		return(

				  	<div class="ui raised segments">
							<div class="ui center aligned segment">
								<h3 class="ui header">
								Login to your account
							</h3>
							</div>
							<div class="ui segment" config={ctrl.segmentLoading}>
							<div class="ui center aligned basic segment">
								<form action="http://45.55.233.252/:8080/api/v1/users/session">
									<input type="hidden" name="provider" value="twitter" />
									<button class="ui twitter button">
										<i class="twitter icon"></i> 
										Sign In with Twitter 
									</button> 
								</form>
							</div>
							<div class="ui horizontal divider"> 
								Or 
							</div>
							<div class="ui center aligned basic segment">
								<form class="ui form" config={ctrl.onLoad} method="POST">
								
								<div class="field">
										<label>Email address / Phone number</label> 
										<div class="ui left icon input">
											<input type="text" onkeyup={ctrl.inputLogin} value={ctrl.loginString()} name="email" placeholder="Your registered email" />
											<i class="user icon"></i>
										</div>
									</div>

								{
									!this.showCountry()?(<div class="field">
									<label>Password</label>
									<div class="ui left icon input">
											<input type="password" name="password" placeholder="Password you remember" />
											<i class="lock icon"></i>
										</div>
								</div>):(
										<div class="field">
											<label>Your country</label>
											<div class="ui fluid search selection dropdown" config={ctrl.dropdown}>
												<input onchange={ctrl.change_country} value={ctrl.selected_country()} type="hidden" name="country" />
											
												<i class="dropdown icon"></i>
												<div class="default text">Select Country</div>
												<div class="menu">
													{
														this.countries.map(function(c){
															return(
																<div class="item" data-value={c.dial_code}><i class={c.code.toLowerCase()+" flag"}></i>{c.name} ({c.dial_code})</div>
															);
														})
													}
												</div>
											</div>
										</div>
								)
								}
								<div class="ui divider"></div>
								<button class="fluid ui blue button" type="submit">Submit</button>
								<div class="ui error message">
									{ this.ErrorList(this.errors()) }
								</div>
							</form>
							</div>
							</div>
							<div class="ui segment">
								
								<div class="ui">

								
								<a class="ui right floated text" href="/signup">
									Signup
								</a>
								<a class="left floated" href="/signup">
									Signup
								</a>

							</div>
							</div>
						</div>
			  
			
		)
}


Login.view = function(ctrl){

	var that = this;
		
		return(

				<div class="ui centered grid">
				  <div class="sixteen wide mobile ten wide tablet six wide computer column ">
						
						{this.loaded()?this.form(ctrl):''}

				  </div>
				</div>
			  
			  
			
		)
}


module.exports = Login;