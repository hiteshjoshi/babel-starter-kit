
var Analytics = {};


Analytics.events = {
	1:1,
	3:1,
	20:1
};

Analytics.calender = function(next){

	this.selected = moment(this.selected || moment());

	this.selected.add(next, 'months');

	moment.fn.isISO = true;

	moment.fn.dayISO = function () {
	    var self = this.clone();
	    return self.day() == 0 ? 6 : self.day()-1;
	}

	moment.fn.weekISO = function () {
	    var self = this.clone();
	    return self.day() == 0 ? self.format('w')-1 : self.format('w');
	}

	moment.fn.week = function () {
	    var self = this.clone(),
	        day = self.isISO ? self.dayISO() : self.day();
	    return {
	        begin: self.subtract('days', day).clone(),
	        end:   self.add('days', 6).clone()
	    }
	}
		

	moment.fn.monthWeeks = function () {
	    var self = this.clone(),
	        first = self.startOf('month');
	    first = self.isISO ? self.dayISO() : self.day();
	    
	    var day = 7-first,
	        last = self.daysInMonth(),
	        count = (last-day)/7;

	        

	    var weeks = [];
	    var first_week = [];
	    var currentDate = 0;//start from 0
	    
	    for (var i = 0; i < 7; i++) {
	    	var start = self.date(1).day();

	    	
	    	if(i >= start){
	    		currentDate++;
	    	}
	    	first_week[i] = i >= start ? {date:currentDate,event:true,data:[]} : {date:'',empty:true};
	    }
	    weeks[0] = first_week;
	    
	    for (var i=0; i < count; i++) {
	    	
	    	var this_week = [];

	    	for (var j = 0; j < 7; j++) {

	    		var start = self.date(day+1).day() - 1 ;
	    		
	    		
	    		if(currentDate!='' && j >= start){

	    			//have reached the last day
	    			if(currentDate == last){
	    				currentDate='';
	    			} else {
	    				currentDate++;
	    			}
		    	}
		    	var obj = {date:currentDate}
		    	if(j==0 && currentDate==''){
		    		obj.empty=true;
		    	}

		    	this_week[j] = j >= start ? obj : '';
	    	}


	        weeks[i+1] = this_week;
	    }

	    //ui hack for table

	    if(weeks.length<6){
	    	weeks.push([{empty:true},{empty:true},{empty:true},{empty:true},{empty:true},{empty:true},{empty:true}]);
	    }
	    console.log(weeks.length,count,weeks,first,last)
	    return weeks;
	}

	
	this.weeks = this.selected.monthWeeks();
	this.now = this.selected.format('MMMM YYYY');
//	if(arguments.length)
//		m.redraw();

};

Analytics.calenderView = function(ctrl){

	var that = this;

	return ({tag: "table", attrs: {class:"ui celled table"}, children: [
			  {tag: "thead", attrs: {}, children: [
			    {tag: "tr", attrs: {}, children: [{tag: "th", attrs: {}, children: ["Sun"]}, 
			    {tag: "th", attrs: {}, children: ["Mon"]}, 
			    {tag: "th", attrs: {}, children: ["Tue"]}, 
			    {tag: "th", attrs: {}, children: ["Wed"]}, 
			    {tag: "th", attrs: {}, children: ["Thu"]}, 
			    {tag: "th", attrs: {}, children: ["Fri"]}, 
			    {tag: "th", attrs: {}, children: ["Sat"]}
			  ]}]}, 
			  
	    		{tag: "tbody", attrs: {}, children: [
	    		
	    		
	    			this.weeks.map(function(week){
	    				return (
	    						
	    							{tag: "tr", attrs: {}, children: [
						    	
						    		
						    			week.map(function (day) {
						    				
						    				var elment = "";

						    				if(day.date == "" || day.empty){
						    					elment = ({tag: "td", attrs: {}, children: [" "]})
						    				} else{
						    					elment = ({tag: "td", attrs: {}, children: [
						    						{tag: "div", attrs: {class:"ui null circular large label"}, children: [
			    									day.date
			    									]}
						    					]})
						    				}
						    				
						    					if(that.events[day.date]){
							    					return ({tag: "td", attrs: {}, children: [
							    								{tag: "div", attrs: {class:"ui blue circular large label", config:ctrl.hover, style:"cursor:pointer;"}, children: [
							    									day.date
							    								]}, 
								    							
								    							{tag: "div", attrs: {class:"ui fluid popup transition hidden"}, children: [
																  {tag: "div", attrs: {class:"ui grid"}, children: [
																    {tag: "div", attrs: {class:"column"}, children: [
																		  
																		    {tag: "div", attrs: {class:"ui feed"}, children: [
																		      {tag: "div", attrs: {class:"event"}, children: [
																		        {tag: "div", attrs: {class:"content"}, children: [
																		          {tag: "div", attrs: {class:"summary"}, children: [
																		             {tag: "a", attrs: {}, children: ["Visit lake for some festival"]}
																		          ]}, 
																		          {tag: "div", attrs: {class:"date"}, children: [
																			          "20th Oct at 6:00pm"
																			        ]}
																		        ]}
																		      ]}, 
																		      {tag: "div", attrs: {class:"event"}, children: [
																		        {tag: "div", attrs: {class:"content"}, children: [
																		          {tag: "div", attrs: {class:"summary"}, children: [
																		             {tag: "a", attrs: {}, children: ["Call investors for funding"]}
																		             
																		          ]}, 
																		          {tag: "div", attrs: {class:"date"}, children: [
																			          "20th Oct at 4:50pm"
																			        ]}
																		        ]}
																		      ]}
																		    ]}
																		
																    ]}																    
																  ]}
																]}
							    						]})
							    				} else {
							    					return elment;
							    				}
						    			})
						    		
						    	]}
						    	
							)
	    			})

	    		
	    		]}, 
	    		{tag: "tfoot", attrs: {class:"full-width"}, children: [
				    {tag: "tr", attrs: {}, children: [
				    {tag: "th", attrs: {colspan:"7"}, children: [
				      	{tag: "h3", attrs: {class:"ui left floated header"}, children: [this.now]}, 
				        {tag: "div", attrs: {class:"ui right floated buttons"}, children: [
						  	{tag: "button", attrs: {class:"mini ui button", onclick:ctrl.prevMonth}, children: [" ", {tag: "i", attrs: {class:"angle left icon"}}, " "]}, 
						  	{tag: "button", attrs: {class:"mini ui button", onclick:ctrl.nextMonth}, children: [" ", {tag: "i", attrs: {class:"angle right icon"}}, " "]}
						]}
				    ]}
				  ]}
				]}
	    	]})
}

Analytics.loaded = m.prop(false);

//CTRL
Analytics.controller = function(){
	var that = this;

	require.ensure(["popup", "moment"], function(require) {
        
        require("popup");

        moment = require("moment");

        Analytics.calender();


        that.friend = m.prop("");


        that.hover = function(e){
        	jQuery(e).popup({on    : 'click',prefer:'opposite',setFluidWidth:false,closable:true});
        }
		
		that.bind = function(e){
			that[jQuery(e.target).attr('data-name')] = m.prop(e.target.value);
			m.withAttr("value", that[jQuery(e.target).attr('data-name')]())
		}.bind(that);

		that.nextMonth = function(){
			Analytics.calender(1);
		}.bind(that);

		that.prevMonth = function(){
			Analytics.calender(-1);
		}.bind(that);


        Analytics.loaded = m.prop(true);
        m.redraw();

	});

	

}

Analytics.view = function(ctrl){
	
		return(
			{tag: "div", attrs: {class:"ui grid"}, children: [

				{tag: "div", attrs: {class:"eight wide column"}, children: [
					{tag: "div", attrs: {class:"ui feed"}, children: [

						{tag: "div", attrs: {class:"ui fluid card"}, children: [
						  {tag: "div", attrs: {class:"content"}, children: [
						    {tag: "div", attrs: {class:"header"}, children: ["Android developer"]}
						  ]}, 
						  {tag: "div", attrs: {class:"content"}, children: [
						    {tag: "h4", attrs: {class:"ui sub header dash_header"}, children: ["2-4 years of experience required."]}, 
						    {tag: "div", attrs: {class:"ui small feed"}, children: [
						      {tag: "div", attrs: {class:"event"}, children: [
						        {tag: "div", attrs: {class:"content"}, children: [
						          {tag: "div", attrs: {class:"summary"}, children: [
						             {tag: "div", attrs: {class:"ui tiny label"}, children: ["Java"]}, 
						             {tag: "div", attrs: {class:"ui tiny label"}, children: ["XML"]}, 
						             {tag: "div", attrs: {class:"ui tiny label"}, children: ["JSON"]}, 
						             {tag: "div", attrs: {class:"ui tiny label"}, children: ["Google Auth"]}
						          ]}
						        ]}
						      ]}, 
						      {tag: "div", attrs: {class:"event"}, children: [
						        {tag: "div", attrs: {class:"content"}, children: [
						          {tag: "div", attrs: {class:"summary"}, children: [
						             "Good pay. Amazing people. Cool company. Blah blah and more blah. Some more blah blah blah."
						          ]}, 
						          {tag: "div", attrs: {class:"ui divider"}}
						        ]}
						      ]}, 
						      {tag: "div", attrs: {class:"event"}, children: [

						        {tag: "div", attrs: {class:"content"}, children: [
						          {tag: "div", attrs: {class:"summary"}, children: [
						             {tag: "a", attrs: {}, children: ["Some awesomeness"]}, " regarding dates and facts ", {tag: "br", attrs: {}}, 
						             "12th-23th Dec" 
						          ]}
						        ]}
						      ]}
						    ]}
						  ]}, 
						  {tag: "div", attrs: {class:"extra content"}, children: [
						  	{tag: "div", attrs: {class:"ui two buttons"}, children: [
						  		{tag: "div", attrs: {class:"ui primary button"}, children: ["Get connected"]}, 
						  		{tag: "div", attrs: {class:"ui button"}, children: ["Never show"]}
						  	]}
						  ]}
						]}, 

						
						{tag: "div", attrs: {class:"ui fluid card"}, children: [
						  {tag: "div", attrs: {class:"content"}, children: [
						    {tag: "div", attrs: {class:"header"}, children: ["Javascript UI developer"]}
						  ]}, 
						  {tag: "div", attrs: {class:"content"}, children: [
						    {tag: "h4", attrs: {class:"ui sub header dash_header"}, children: ["1-4 years of experience required."]}, 
						    {tag: "div", attrs: {class:"ui small feed"}, children: [
						      {tag: "div", attrs: {class:"event"}, children: [
						        {tag: "div", attrs: {class:"content"}, children: [
						          {tag: "div", attrs: {class:"summary"}, children: [
						             {tag: "div", attrs: {class:"ui tiny label"}, children: ["Javascript"]}, 
						             {tag: "div", attrs: {class:"ui tiny label"}, children: ["Design sense"]}, 
						             {tag: "div", attrs: {class:"ui tiny label"}, children: ["UI/UX"]}, 
						             {tag: "div", attrs: {class:"ui tiny label"}, children: ["CSS3"]}
						          ]}
						        ]}
						      ]}, 
						      {tag: "div", attrs: {class:"event"}, children: [
						        {tag: "div", attrs: {class:"content"}, children: [
						          {tag: "div", attrs: {class:"summary"}, children: [
						             "We are excited to launch our new company and product Ooooh. After being featured in too many magazines to mention and having created an online stir, we know that Ooooh is going to be big. You may have seen us in the Dinosaurs’ Den where we were we told that we didn’t need them because we were already doing it so well ourselves, so that’s what we have continued to do. We also hope to win Startup Fictional Business of the Year this Year."
						          ]}, 
						          {tag: "div", attrs: {class:"ui divider"}}
						        ]}
						      ]}, 
						      {tag: "div", attrs: {class:"event"}, children: [

						        {tag: "div", attrs: {class:"content"}, children: [
						          {tag: "div", attrs: {class:"summary"}, children: [
						             {tag: "a", attrs: {}, children: ["Some awesomeness"]}, " regarding dates and facts ", {tag: "br", attrs: {}}, 
						             "12th-23th Dec" 
						          ]}
						        ]}
						      ]}
						    ]}
						  ]}, 
						  {tag: "div", attrs: {class:"extra content"}, children: [
						  	{tag: "div", attrs: {class:"ui two buttons"}, children: [
						  		{tag: "div", attrs: {class:"ui primary button"}, children: ["Get connected"]}, 
						  		{tag: "div", attrs: {class:"ui button"}, children: ["Never show"]}
						  	]}
						  ]}
						]}, 

						
						{tag: "div", attrs: {class:"ui fluid card"}, children: [
						  {tag: "div", attrs: {class:"content"}, children: [
						    {tag: "div", attrs: {class:"header"}, children: ["Android developer"]}
						  ]}, 
						  {tag: "div", attrs: {class:"content"}, children: [
						    {tag: "h4", attrs: {class:"ui sub header dash_header"}, children: ["2-4 years of experience required."]}, 
						    {tag: "div", attrs: {class:"ui small feed"}, children: [
						      {tag: "div", attrs: {class:"event"}, children: [
						        {tag: "div", attrs: {class:"content"}, children: [
						          {tag: "div", attrs: {class:"summary"}, children: [
						             {tag: "div", attrs: {class:"ui tiny label"}, children: ["Java"]}, 
						             {tag: "div", attrs: {class:"ui tiny label"}, children: ["XML"]}, 
						             {tag: "div", attrs: {class:"ui tiny label"}, children: ["JSON"]}, 
						             {tag: "div", attrs: {class:"ui tiny label"}, children: ["Google Auth"]}
						          ]}
						        ]}
						      ]}, 
						      {tag: "div", attrs: {class:"event"}, children: [
						        {tag: "div", attrs: {class:"content"}, children: [
						          {tag: "div", attrs: {class:"summary"}, children: [
						             "Good pay. Amazing people. Cool company. Blah blah and more blah. Some more blah blah blah."
						          ]}, 
						          {tag: "div", attrs: {class:"ui divider"}}
						        ]}
						      ]}, 
						      {tag: "div", attrs: {class:"event"}, children: [

						        {tag: "div", attrs: {class:"content"}, children: [
						          {tag: "div", attrs: {class:"summary"}, children: [
						             {tag: "a", attrs: {}, children: ["Some awesomeness"]}, " regarding dates and facts ", {tag: "br", attrs: {}}, 
						             "12th-23th Dec" 
						          ]}
						        ]}
						      ]}
						    ]}
						  ]}, 
						  {tag: "div", attrs: {class:"extra content"}, children: [
						  	{tag: "div", attrs: {class:"ui two buttons"}, children: [
						  		{tag: "div", attrs: {class:"ui primary button"}, children: ["Get connected"]}, 
						  		{tag: "div", attrs: {class:"ui button"}, children: ["Never show"]}
						  	]}
						  ]}
						]}

						
					  
					 
					  


					]}, 
					{tag: "button", attrs: {class:"fluid ui button"}, children: ["Load more jobs"]}
				]}, 

				{tag: "div", attrs: {class:"eight wide column"}, children: [
					{tag: "h2", attrs: {class:"ui header dash_header"}, children: ["Appointments"]}, 
					{tag: "div", attrs: {class:"ui divider"}}, 
					this.loaded()?this.calenderView(ctrl):''
				]}
				
			]}
		)
}


module.exports = Analytics;