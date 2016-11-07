
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

	return (<table class="ui celled table">
			  <thead>
			    <tr><th>Sun</th>
			    <th>Mon</th>
			    <th>Tue</th>
			    <th>Wed</th>
			    <th>Thu</th>
			    <th>Fri</th>
			    <th>Sat</th>
			  </tr></thead>
			  
	    		<tbody>
	    		
	    		{
	    			this.weeks.map(function(week){
	    				return (
	    						
	    							<tr>
						    	
						    		{
						    			week.map(function (day) {
						    				
						    				var elment = "";

						    				if(day.date == "" || day.empty){
						    					elment = (<td>&nbsp;</td>)
						    				} else{
						    					elment = (<td>
						    						<div class="ui null circular large label">
			    									{day.date}
			    									</div>
						    					</td>)
						    				}
						    				
						    					if(that.events[day.date]){
							    					return (<td>
							    								<div class="ui blue circular large label" config={ctrl.hover} style="cursor:pointer;">
							    									{day.date}
							    								</div>
								    							
								    							<div class="ui fluid popup transition hidden">
																  <div class="ui grid">
																    <div class="column">
																		  
																		    <div class="ui feed">
																		      <div class="event">
																		        <div class="content">
																		          <div class="summary">
																		             <a>Visit lake for some festival</a>
																		          </div>
																		          <div class="date">
																			          20th Oct at 6:00pm
																			        </div>
																		        </div>
																		      </div>
																		      <div class="event">
																		        <div class="content">
																		          <div class="summary">
																		             <a>Call investors for funding</a> 
																		             
																		          </div>
																		          <div class="date">
																			          20th Oct at 4:50pm
																			        </div>
																		        </div>
																		      </div>
																		    </div>
																		
																    </div>																    
																  </div>
																</div>
							    						</td>)
							    				} else {
							    					return elment;
							    				}
						    			})
						    		}
						    	</tr>
						    	
							)
	    			})

	    		}
	    		</tbody>
	    		<tfoot class="full-width">
				    <tr>
				    <th colspan="7">
				      	<h3 class="ui left floated header">{this.now}</h3>
				        <div class="ui right floated buttons">
						  	<button class="mini ui button" onclick={ctrl.prevMonth}> <i class="angle left icon"></i> </button>
						  	<button class="mini ui button" onclick={ctrl.nextMonth}> <i class="angle right icon"></i> </button>
						</div>
				    </th>
				  </tr>
				</tfoot>
	    	</table>)
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
			<div class="ui grid">

				<div class="eight wide column">
					<div class="ui feed">

						<div class="ui fluid card">
						  <div class="content">
						    <div class="header">Android developer</div>
						  </div>
						  <div class="content">
						    <h4 class="ui sub header dash_header">2-4 years of experience required.</h4>
						    <div class="ui small feed">
						      <div class="event">
						        <div class="content">
						          <div class="summary">
						             <div class="ui tiny label">Java</div>
						             <div class="ui tiny label">XML</div>
						             <div class="ui tiny label">JSON</div>
						             <div class="ui tiny label">Google Auth</div>
						          </div>
						        </div>
						      </div>
						      <div class="event">
						        <div class="content">
						          <div class="summary">
						             Good pay. Amazing people. Cool company. Blah blah and more blah. Some more blah blah blah.
						          </div>
						          <div class="ui divider"></div>
						        </div>
						      </div>
						      <div class="event">

						        <div class="content">
						          <div class="summary">
						             <a>Some awesomeness</a> regarding dates and facts <br/>
						             12th-23th Dec 
						          </div>
						        </div>
						      </div>
						    </div>
						  </div>
						  <div class="extra content">
						  	<div class="ui two buttons">
						  		<div class="ui primary button">Get connected</div>
						  		<div class="ui button">Never show</div>
						  	</div>
						  </div>
						</div>

						
						<div class="ui fluid card">
						  <div class="content">
						    <div class="header">Javascript UI developer</div>
						  </div>
						  <div class="content">
						    <h4 class="ui sub header dash_header">1-4 years of experience required.</h4>
						    <div class="ui small feed">
						      <div class="event">
						        <div class="content">
						          <div class="summary">
						             <div class="ui tiny label">Javascript</div>
						             <div class="ui tiny label">Design sense</div>
						             <div class="ui tiny label">UI/UX</div>
						             <div class="ui tiny label">CSS3</div>
						          </div>
						        </div>
						      </div>
						      <div class="event">
						        <div class="content">
						          <div class="summary">
						             We are excited to launch our new company and product Ooooh. After being featured in too many magazines to mention and having created an online stir, we know that Ooooh is going to be big. You may have seen us in the Dinosaurs’ Den where we were we told that we didn’t need them because we were already doing it so well ourselves, so that’s what we have continued to do. We also hope to win Startup Fictional Business of the Year this Year.
						          </div>
						          <div class="ui divider"></div>
						        </div>
						      </div>
						      <div class="event">

						        <div class="content">
						          <div class="summary">
						             <a>Some awesomeness</a> regarding dates and facts <br/>
						             12th-23th Dec 
						          </div>
						        </div>
						      </div>
						    </div>
						  </div>
						  <div class="extra content">
						  	<div class="ui two buttons">
						  		<div class="ui primary button">Get connected</div>
						  		<div class="ui button">Never show</div>
						  	</div>
						  </div>
						</div>

						
						<div class="ui fluid card">
						  <div class="content">
						    <div class="header">Android developer</div>
						  </div>
						  <div class="content">
						    <h4 class="ui sub header dash_header">2-4 years of experience required.</h4>
						    <div class="ui small feed">
						      <div class="event">
						        <div class="content">
						          <div class="summary">
						             <div class="ui tiny label">Java</div>
						             <div class="ui tiny label">XML</div>
						             <div class="ui tiny label">JSON</div>
						             <div class="ui tiny label">Google Auth</div>
						          </div>
						        </div>
						      </div>
						      <div class="event">
						        <div class="content">
						          <div class="summary">
						             Good pay. Amazing people. Cool company. Blah blah and more blah. Some more blah blah blah.
						          </div>
						          <div class="ui divider"></div>
						        </div>
						      </div>
						      <div class="event">

						        <div class="content">
						          <div class="summary">
						             <a>Some awesomeness</a> regarding dates and facts <br/>
						             12th-23th Dec 
						          </div>
						        </div>
						      </div>
						    </div>
						  </div>
						  <div class="extra content">
						  	<div class="ui two buttons">
						  		<div class="ui primary button">Get connected</div>
						  		<div class="ui button">Never show</div>
						  	</div>
						  </div>
						</div>

						
					  
					 
					  


					</div>
					<button class="fluid ui button">Load more jobs</button>
				</div>

				<div class="eight wide column">
					<h2 class="ui header dash_header">Appointments</h2>
					<div class="ui divider"></div>
					{this.loaded()?this.calenderView(ctrl):''}
				</div>
				
			</div>
		)
}


module.exports = Analytics;