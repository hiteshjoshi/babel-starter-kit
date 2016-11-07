var Signup = {};

Signup.loaded = m.prop(false);
Signup.show_otp = m.prop(false);
Signup.countries = null;
Signup.token = m.prop("");

Signup.model = function(data){
	
	this.user = {
		email : data.email,
		phone : data.phone,
		country : data.country.substring(1),
		code : null
	}
	return this;
};
Signup.model.prototype.updateOtp = function(otp){
	this.user.code = otp;
	return this.user;
};

Signup.User = null;

//CTRL
Signup.controller = function(){

	var that = this;

	that.selected_country = m.prop("");

	if(Auth.session_exists())
	{
		return page.redirect('/dashboard');
	}

	that.change_country = function(e){
		that.selected_country = m.prop(e.target.value);
	}.bind(that);


	that.dropdown = function(e){
		jQuery(e).dropdown({
			useLabels: true,
			//onChange:that.change_Country
		});

	};

	m.startComputation();

	require.ensure(["js/country_code"], function(require) {
		Signup.countries = require("js/country_code");
		
		
		
		
		that.elements = {};


		that.focus = function(e){
        	jQuery(e).popup({on    : 'focus',prefer:'opposite',setFluidWidth:true});
        };

		that.segmentLoading = function(e){
			that.elements.formSegment = jQuery(e);
		};

		that.errors = function(e){
			that.elements.errors = jQuery(e);
		};

		//after signup is done.
		that.confirmOtp = function(event,fields){
			
			event.preventDefault();
			//loading
			that.elements.formSegment.addClass("loading");
			Signup.User.updateOtp(fields.otp);
			

			m.api.users.headers({"Authorization":"Bearer "+Signup.token()});
			

			m.api.users.update(Signup.User.user)
			.then(function(response,success,xhr){
				m.startComputation();


				if(response.error===true){

					jQuery(that.elements.form).removeClass('success').addClass('error')
					Object.keys(response.errors).forEach(function(error,i){
					
						Signup.show_msg = true;
						Signup.errors=m.prop([response.errors[error]]);
						
						
						
						jQuery(that.elements.form).find("[name='"+error+"']").parent().addClass('error');
						
					});					
				} else {
					Auth.setSession(response.data.token);
					page.redirect("/dashboard")

				}
				m.api.release('users');
				
				Signup.show_otp = m.prop(false);
				m.endComputation();

			})
			.error(function(xhr,error){
				m.startComputation();

			
				//console.log("HERE",xhr.responseJSON)
				var response = xhr.responseJSON;
				jQuery(that.elements.form).removeClass('success').addClass('error');

				if(xhr.status == 401 || xhr.status == 403){
					Object.keys(response.errors).forEach(function(error,i){
			
							Signup.show_msg = m.prop(true);
							Signup.errors=m.prop([response.errors[error]]);
							
							
							jQuery(that.elements.form).find("[name='"+error+"']").parent().addClass('error');
							
						});
		
				} else {
					Signup.show_msg = m.prop(true);
					Signup.errors = m.prop([{msg:response.userMessage || "Server error, please try again"}]);
					jQuery(that.elements.form).find("[name='"+error+"']").parent().addClass('error');
				}
				
				that.elements.formSegment.removeClass("loading");
				m.api.release('users');
				Signup.show_otp = m.prop(false);

				m.endComputation();

			});

		};

		that.signup = function(event, fields){
			
			event.preventDefault();
			//loading
			that.elements.formSegment.addClass("loading");

			//jQuery(that.elements.form).form('remove prompt', 'email');
			//console.log(m.api.users.create('signup',fields))
			
			Signup.User = new Signup.model(fields);
			
			
			m.api.users.post(Signup.User.user)
			.then(function(response,success,xhr) {

				m.startComputation();
				that.elements.formSegment.removeClass("loading");

				if(response.error===true){

					jQuery(that.elements.form).removeClass('success').addClass('error')
					Object.keys(response.errors).forEach(function(error,i){
					
						Signup.show_msg = true;
						Signup.errors=m.prop([response.errors[error]]);
						
						
						
						jQuery(that.elements.form).find("[name='"+error+"']").parent().addClass('error');
						
					});					
				} else {
					Signup.token = m.prop(response.data.token);
					
					//Auth.setSession(response.data.token);
					Signup.show_otp = m.prop(true);
					
					
					//page.redirect("/dashboard")

				}
				m.api.release('users');
				//m.redraw();
				m.endComputation();

	        })
	        .error(function(xhr,error){
						
						m.startComputation();
	        	//console.log("HERE",xhr.responseJSON)
						var response = xhr.responseJSON;
						jQuery(that.elements.form).removeClass('success').addClass('error')

						if(xhr.status == 401 || xhr.status == 403){
							Object.keys(response.errors).forEach(function(error,i){
					
									Signup.show_msg = m.prop(true);
									Signup.errors=m.prop([response.errors[error]]);
									
									
									jQuery(that.elements.form).find("[name='"+error+"']").parent().addClass('error');
									
								});
				
						} else {
							Signup.show_msg = m.prop(true);
							Signup.errors = m.prop([{msg:response.userMessage || "Server error, please try again"}]);
							jQuery(that.elements.form).find("[name='"+error+"']").parent().addClass('error');
						}
						
						that.elements.formSegment.removeClass("loading");
						m.api.release('users');
						m.endComputation();
						
	        });

	        m.api.wait('users');
			
			
			
		};

		that.onOTPLoad = function(e){

			that.elements.otpform = jQuery(e);

			jQuery(e)
			  .form({
			    fields : {
			    	otp:{
			    		identifier : 'otp',
			    		rules: [
				          {
				            type   : 'number',
				            prompt : 'Please enter valid otp.'
				          },
									{
										type   : 'minLength[4]',
										prompt : 'A valid 4 digit otp code is required.'
									},
									{
										type   : 'maxLength[4]',
										prompt : 'A valid 4 digit otp code is required.'
									}
									
				        ]
			    	}

			    },
			    inline : true,
			    on     : 'blur',
			    onSuccess : that.confirmOtp
			  })
			;
		};
		
		that.onLoad = function(e){

			that.elements.form = jQuery(e);

			jQuery(e)
			  .form({
			    fields : {
			    	email:{
			    		identifier : 'email',
			    		rules: [
				          {
				            type   : 'email',
				            prompt : 'Please enter a valid e-mail.'
				          }
				        ]
			    	},
						country:{
			    		identifier : 'country',
			    		rules: [
				          {
				            type   : 'empty',
				            prompt : 'Please select your country.'
				          }
				        ]
			    	},
			    	phone:{
			    		identifier : 'phone',
			    		rules: [
				          {
				            type   : 'empty',
				            prompt : 'We really need your number here. You will receive a password on this.'
				          },
				          {
				            type   : 'minLength[10]',
				            prompt : 'A valid 10 digit mobile number is required. You will receive a password on this.'
				          }
				        ]
			    	},

			    },
			    inline : true,
			    on     : 'blur',
			    onSuccess : that.signup
			  })
			;
		};


		Signup.loaded = m.prop(true);
    
		
		m.endComputation();
		

	},"country_code");
}


Signup.ErrorList = function(errors){
	
	return this.show_msg()?(
		{tag: "ul", attrs: {class:"list"}, children: [
			
				errors.map(function(error,i){
					console.log(error);
					return ({tag: "li", attrs: {}, children: [" ", error.msg, " "]});
				})
			
		]}
	):null;
}
Signup.show_msg = m.prop(false);
Signup.errors = m.prop([]);

Signup.signupForm = function(ctrl){
	return (
		{tag: "div", attrs: {class:"ui raised segments"}, children: [
		  {tag: "div", attrs: {class:"ui center aligned segment"}, children: [
		    {tag: "h3", attrs: {class:"ui header"}, children: [
			  "Create a new account"
			]}
		  ]}, 
		  {tag: "div", attrs: {class:"ui segment", config:ctrl.segmentLoading}, children: [
		    {tag: "form", attrs: {class:"ui form", config:ctrl.onLoad, method:"POST"}, children: [
			  
				{tag: "div", attrs: {class:"required field"}, children: [
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
				]}, 
				
			  {tag: "div", attrs: {class:"required field"}, children: [
		        {tag: "label", attrs: {}, children: ["Email address"]}, 
		        {tag: "div", attrs: {class:"ui left icon input"}, children: [
		          {tag: "input", attrs: {type:"text", name:"email", config:ctrl.focus, "data-content":"You will never receive spam! This is private.", placeholder:"Your primary email."}}, 
		          {tag: "i", attrs: {class:"mail icon"}}
		        ]}
		      ]}, 

			  {tag: "div", attrs: {class:"required field"}, children: [
			    {tag: "label", attrs: {}, children: ["Mobile ", ctrl.selected_country()?String("(")+ ctrl.selected_country()+ String(")") : ""]}, 
			    {tag: "div", attrs: {class:"ui left icon input"}, children: [
		          {tag: "input", attrs: {type:"phone", name:"phone", config:ctrl.focus, "data-content":"You will receive a password on this number. We won't share your number with anyone until you accept interviews.", placeholder:"Required for interviews."}}, 
		          {tag: "i", attrs: {class:"phone icon"}}
		        ]}
			    
			  ]}, 
			  {tag: "div", attrs: {class:"ui divider"}}, 
			  {tag: "button", attrs: {class:"fluid ui blue button", type:"submit"}, children: ["Signup"]}, 
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


Signup.otpForm = function(ctrl){
	return (
		{tag: "div", attrs: {class:"ui raised segments"}, children: [
		  {tag: "div", attrs: {class:"ui center aligned segment"}, children: [
		    {tag: "h3", attrs: {class:"ui header"}, children: [
			  "Thanks! Check your phone for an OTP code."
			]}
		  ]}, 
		  {tag: "div", attrs: {class:"ui segment", config:ctrl.segmentLoading}, children: [
		    {tag: "form", attrs: {class:"ui form", config:ctrl.onOTPLoad, method:"POST"}, children: [
			  
			  {tag: "div", attrs: {class:"required field"}, children: [
		        {tag: "label", attrs: {}, children: ["OTP"]}, 
		        {tag: "div", attrs: {class:"ui left icon input"}, children: [
		          {tag: "input", attrs: {type:"number", name:"otp", config:ctrl.focus, "data-content":"The OTP you received on your mobile number.", placeholder:"OTP code."}}, 
		          {tag: "i", attrs: {class:"phone icon"}}
		        ]}
		      ]}, 

			  {tag: "div", attrs: {class:"ui divider"}}, 
			  {tag: "button", attrs: {class:"fluid ui blue button", type:"submit"}, children: ["Confirm"]}, 
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

Signup.view = function(ctrl){

	var that = this;
		
		return(

				{tag: "div", attrs: {class:"ui centered grid"}, children: [
				  {tag: "div", attrs: {class:"sixteen wide mobile ten wide tablet six wide computer column "}, children: [
						
						this.loaded()?(this.show_otp()?this.otpForm(ctrl):this.signupForm(ctrl)):''

				  ]}
				]}
			  
			  
			
		)
}


module.exports = Signup;