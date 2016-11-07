var Login = {};
Login.showCountry = m.prop(false);

// email validation
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function validateNumber(number){
	var re = /^\d+$/;
	return re.test(number);
}
jQuery.fn.form.settings.rules.inputPassword = function(value,length){
	if(Login.showCountry()) return true;
	
	if(value.length === 0) return true; //hack to not show message when its selected and moved on

	return Login.showCountry() || value.length>6;
}
//custom validation fields
jQuery.fn.form.settings.rules.inputLogin = function(value){
	
		if(Login.showCountry()) return true;

		var isNumber = validateNumber(value);
		//console.log("I am calleds",value,parsedValue,isNaN(parsedValue));
		if(!isNumber){//this is email probably
			if(validateEmail(value)){
				return true
			}
			else 
				return false			
			
		} else { // this is a number, perhaps a mobile?
			if(value.length!= 10){
				return false;
			} else {
				return true;
			}
		}
};

Login.loaded = m.prop(false);
//CTRL
Login.controller = function(){

	var that = this;

	if(Auth.session_exists())
	{
		page.redirect('/dashboard')
	}
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
		{tag: "ul", attrs: {class:"list"}, children: [
			
				errors.map(function(error,i){
					return ({tag: "li", attrs: {}, children: [" ", error.msg, " "]});
				})
			
		]}
	):null;
}
Login.show_msg = m.prop(false);
Login.errors = m.prop([]);

Login.form = function(ctrl){

	var that = this;

		return(

				  	{tag: "div", attrs: {class:"ui raised segments"}, children: [
							{tag: "div", attrs: {class:"ui center aligned segment"}, children: [
								{tag: "h3", attrs: {class:"ui header"}, children: [
								"Login to your account"
							]}
							]}, 
							{tag: "div", attrs: {class:"ui segment", config:ctrl.segmentLoading}, children: [
								{tag: "form", attrs: {class:"ui form", config:ctrl.onLoad, method:"POST"}, children: [
								
								{tag: "div", attrs: {class:"field"}, children: [
										{tag: "label", attrs: {}, children: ["Email address / Phone number"]}, 
										{tag: "div", attrs: {class:"ui left icon input"}, children: [
											{tag: "input", attrs: {type:"text", onkeyup:ctrl.inputLogin, value:ctrl.loginString(), name:"email", placeholder:"Your registered email"}}, 
											{tag: "i", attrs: {class:"user icon"}}
										]}
									]}, 

								
									!this.showCountry()?({tag: "div", attrs: {class:"field"}, children: [
									{tag: "label", attrs: {}, children: ["Password"]}, 
									{tag: "div", attrs: {class:"ui left icon input"}, children: [
											{tag: "input", attrs: {type:"password", name:"password", placeholder:"Password you remember"}}, 
											{tag: "i", attrs: {class:"lock icon"}}
										]}
								]}):(
										{tag: "div", attrs: {class:"field"}, children: [
											{tag: "label", attrs: {}, children: ["Your country"]}, 
											{tag: "div", attrs: {class:"ui fluid search selection dropdown", config:ctrl.dropdown}, children: [
												{tag: "input", attrs: {onchange:ctrl.change_country, value:ctrl.selected_country(), type:"hidden", name:"country"}}, 
											
												{tag: "i", attrs: {class:"dropdown icon"}}, 
												{tag: "div", attrs: {class:"default text"}, children: ["Select Country"]}, 
												{tag: "div", attrs: {class:"menu"}, children: [
													
														this.countries.map(function(c){
															return(
																{tag: "div", attrs: {class:"item", "data-value":c.dial_code}, children: [{tag: "i", attrs: {class:c.code.toLowerCase()+" flag"}}, c.name, " (", c.dial_code, ")"]}
															);
														})
													
												]}
											]}
										]}
								), 
								
								{tag: "div", attrs: {class:"ui divider"}}, 
								{tag: "button", attrs: {class:"fluid ui blue button", type:"submit"}, children: ["Submit"]}, 
								{tag: "div", attrs: {class:"ui error message"}, children: [
									 this.ErrorList(this.errors()) 
								]}
							]}
							]}, 
							{tag: "div", attrs: {class:"ui segment"}, children: [
								
								{tag: "div", attrs: {class:"ui"}, children: [

								
								{tag: "a", attrs: {class:"ui right floated text", href:"/signup"}, children: [
									"Signup"
								]}, 
								{tag: "a", attrs: {class:"left floated", href:"/signup"}, children: [
									"Signup"
								]}

							]}
							]}
						]}
			  
			
		)
}


Login.view = function(ctrl){

	var that = this;
		
		return(

				{tag: "div", attrs: {class:"ui centered grid"}, children: [
				  {tag: "div", attrs: {class:"sixteen wide mobile ten wide tablet six wide computer column "}, children: [
						
						this.loaded()?this.form(ctrl):''

				  ]}
				]}
			  
			  
			
		)
}


module.exports = Login;