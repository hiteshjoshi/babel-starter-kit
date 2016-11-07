var New = {};

New.model = function(){
	var self = this;

	
	self.notify_emails={
		uid:null,
		value:m.prop(true)		
	}
	self.notify_voice={
		uid:null,
		value:m.prop(false)		
	}
	self.notify_texts={
		uid:null,
		value:m.prop(true)		
	}
	

	return self;	

}

New.loaded = m.prop(false);
//CTRL
New.controller = function(){
	var that = this;
	
	that.model = new New.model();
	that.assignedKeys = [];
	that.assignKey = function(e){
		
		
	}

	require.ensure(["checkbox"], function(require) {
		require("checkbox");

		that.checkbox = function(e){

			//do nothing is already assigned 
			if (typeof(jQuery(e).attr('uid')) != 'undefined'){
				return;
			}
			
			var id = new Date().valueOf();
			that.model[jQuery(e).attr('name')].uid = id;
			console.log(that.model[jQuery(e).attr('name')])
			jQuery(e).attr('uid',id)
			that.assignedKeys.push(id);
			window.keys = that.assignedKeys;

			jQuery(e).checkbox({
				onChecked:function(){
					
					var checkbox = _.find(that.model,jQuery(e).attr('uid'))
					console.log('Checked',checkbox,jQuery(e).attr('uid'))
					checkbox.value = m.prop(true)
					m.redraw();
				},
				onUnchecked:function(){
					
					var checkbox = _.find(that.model,jQuery(e).attr('uid'))
					console.log('Unchecked',checkbox)
					checkbox.value = m.prop(false)
					m.redraw();
				}
			})
		}

		New.loaded = m.prop(true);
		m.redraw();
	})
	
}

New.view = function(ctrl){
	
	return (
		<div>
			<h2 class="ui header dash_header">Create a new job</h2>
			<div class="ui divider"></div>
			{this.loaded()?this.newForm(ctrl):require('modules/common/loader').spinner()}			
		</div>
	)
}
New.newForm = function(ctrl){
		return(
			
			<div class="ui form">
			  
			  
			</div>
		
		)
}


module.exports = New;