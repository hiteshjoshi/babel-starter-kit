
var Analytics = {};
var moment = require('moment')

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
	    // console.log(weeks.length,count,weeks,first,last)
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
						    						<div class="ui null circular large label" style="cursor:pointer;" id={day.date} onclick={function(e){ctrl.getAgendas(e.currentTarget.id,that.now)}}>
			    									{day.date}
			    									</div>
						    					</td>)
						    				}
						    				return elment
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

Analytics.loaded = m.prop(true);

Analytics.showSchedule = m.prop(false);

//CTRL
Analytics.controller = function(){
	var that = this;

	require.ensure(["popup", "moment"], function(require) {
        that.va=1;
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

		that.dateToday = m.prop("");
		that.startTime = m.prop(0);
		that.endTime = m.prop(0);
		that.todayDate = m.prop(0);
		that.description = m.prop("");
		that.schedules = m.prop([])

		that.getAgendas = function(id,today){
		    var j = id % 10;
		    var k = id % 100;
		    that.todayDate = m.prop(id+ " "+today)
		    if (j == 1 && k != 11) {
		        that.dateToday = m.prop(id+ "st "+today)
		    } else if (j == 2 && k != 12) {
		        that.dateToday = m.prop(id+ "nd "+today)
		    } else if (j == 3 && k != 13) {
		       that.dateToday = m.prop(id+ "rd "+today)
		    } else{
		    	that.dateToday = m.prop(id+ "th "+today)
		    }
		    var currentDate = new Date(that.todayDate())
		    var date = String((currentDate.getDate()*1000000)+((currentDate.getMonth()+1)*10000)+(currentDate.getFullYear()))
		    m.api.one("schedule/date",date).get().then(function(response){
		    	var officehour = 9
		    	that.schedules=m.prop([])
		    	for(var i=0;i<response.body(false).data.length;i++){
		    		var time = []
		    		var t;
		    		if(officehour<response.body(false).data[i].StartTime){
			    		for(var k=officehour;k<=response.body(false).data[i].StartTime;k++){
			    			officehour=k
			    			time.push(moment((String(officehour)+"00"),"hmm").format("hh:mm a"))
			    		}
			    		that.schedules().push({
			    			time:time,
			    			task:"Unassigned"
			    		})	    			
			    	}
			    	time = []
			    	var t;
		    		for(var j=response.body(false).data[i].StartTime;j<=response.body(false).data[i].EndTime;j++){
		    			officehour=j
		    			time.push(moment((String(officehour)+"00"),"hmm").format("hh:mm a"))
		    		}
		    		that.schedules().push({
		    			time:time,
		    			task:response.body(false).data[i].Task
		    		})
		    	}
		    	if(officehour<19){
		    		var time = []
		    		var t;
	    			for(var k=officehour;k<=19;k++){
	    				// console.log("Unassigned",officehour)
	    				officehour = k
		    			time.push(moment((String(officehour)+"00"),"hmm").format("hh:mm a"))
		    		}
		    		that.schedules().push({
		    			time:time,
		    			task:"Unassigned"
		    		})	  
	    		}
	    		// console.log(that.schedules())
		    	Analytics.showSchedule = m.prop(true)
		    	m.redraw(true)
		    },function(error){
		    	console.log("error",error)
		    })
			// m.redraw(true);
		}


		that.verifyAgenda = function(event){
			if(that.va==1){
				$.fn.form.settings.rules.checkOfficeHours = function(value) {
				  	if((value<9)||(value>19))
				  		return false
				  	else
				  		return true;
				};
				$('#agendaForm').form({
					fields:{
						startTime:{
							identifier:'startTime',
							rules: [
								{
			                        type: 'empty',
			                        prompt: 'Please enter start time to continue'
			                    },
								{
			                        type: 'integer',
			                        prompt: 'startTime should be integer'
			                    },
			                    {
			                        type: 'checkOfficeHours',
			                    	prompt: 'Please select office hours only,i.e., 9-17 hrs'
			                    }
			                ]
						},
						endTime:{
							identifier:'endTime',
							rules: [
								{
			                        type: 'empty',
			                        prompt: 'Please enter end time to continue'
			                    },
								{
			                        type: 'integer',
			                        prompt: 'endTime should be integer'
			                    },
			                    {
			                        type: 'checkOfficeHours',
			                    	prompt: 'Please select office hours only,i.e., 9-17 hrs'
			                    }
		                    ]
						},
						description:{
							identifier:'description',
							rules: [
								{
			                        type: 'empty',
			                        prompt: 'Please enter description to continue'
			                    }
		                    ]
						}
					},
					onSuccess: function(e,f) {
						// console.log("onSuccess")
						that.va=0;
		            	that.addAgenda();
		            	event.preventDefault();
		            	return;
		            },
		            onFailure: function(err,f){
		            	return false;
		            }
				});
			}
		}

		//add user agenda
		that.addAgenda = function(e){
			 var currentDate = new Date(that.todayDate())
		    var date = String((currentDate.getDate()*1000000)+((currentDate.getMonth()+1)*10000)+(currentDate.getFullYear()))
			m.schedule.post({
                startTime: Number(that.startTime()),
                endTime: Number(that.endTime()),
                date: Number(date),
                task: that.description(),
            }).then(function(response){
		        // console.log("reponse",response.body(false).data)
		        // m.redraw(true);
		    }, function(response){
		        // The reponse code is not >= 200 and < 400
		        console.log("error",response)
		    });
			that.startTime = m.prop("")
			that.endTime = m.prop("")
			that.description = m.prop("")
		}

		that.popForm = function(){
			$('.ui.modal').modal('show');
		}
		that.colors = m.prop(["#adb5bd","#ff6b6b","#f06595","#cc5de8","#845ef7","#5c7cfa","#329af0","#22b8cf","#20c997","#51cf66","#94d82d","#ff922b"])
		that.addBackground = function(e,isInit){
			if (!isInit){
				e.style.background = that.colors()[Math.floor(Math.random() * (that.colors().length-1)) + 0 ];
			}
		}

		
        Analytics.loaded = m.prop(true);
        // m.redraw();

	});

	

}


Analytics.scheduleForm = function(ctrl){
	return(
		<div class="ui modal">
		  <i class="close icon"></i>
		  <div class="header">
		    Add Agenda
		  </div>
		  <div class="image content">
		    <div class="description">
		    	<form class="ui form" id="agendaForm" config={ctrl.verifyAgenda}>
		    	  <div class="two fields">
    				<div class="field">
      					<label>Start Time</label>
					    <input type="text" name="startTime" placeholder="HH" oninput={m.withAttr("value",ctrl.startTime)} value={ctrl.startTime()}/>
				    </div>
    				<div class="field">
      					<label>End Time</label>
					    <input type="text" name="endTime" placeholder="HH" oninput={m.withAttr("value",ctrl.endTime)} value={ctrl.endTime()}/>
				    </div>
				  </div>
				  <div class="field">
				  	<label>Description</label>
				  	<input type="text" name="description" placeholder="Your description" onchange={function(e){ctrl.description = m.prop(e.target["value"]) }} value={ctrl.description()}/>
				  </div>
				  <button class="ui button" type="submit">Submit</button>
				  <div class="ui error message" id="errmsg"></div>
		    	</form>
		    </div>
		  </div>
		</div>
	)
}



Analytics.scheduleDetails = function(ctrl){
	var that = this;

	return(
		<div class="eight wide column">
			<div class = "ui segments" style="border-radius:30px 30px 30px 30px;">
				<div class="ui center aligned yellow inverted verticle segment" style="border-radius:30px 30px 0px 0px;color:black !important;">
					Agenda for {ctrl.dateToday()}
				</div>
				<div class = "ui verticle segment" style="padding:0%"> 
					<table class="ui celled padded table">
					{
						ctrl.schedules().map(function(schedule,i){
								return(
									<tr config={ctrl.addBackground}>
										<td style="width:25%;">
											{
												schedule.time.map(function(time,i){
													if(i==(schedule.time.length-1)){
														return(
															<div>{time}</div>
														)
													} else{
														return(
															<div>{time}<br/><br/></div>
														)
													}
												})
											}
										</td>
										<td style="verticle-align:center;">
											{schedule.task}
										</td>
									</tr>
								)
						})
					}
					</table>
				</div>
				<div class="ui right aligned yellow inverted verticle segment" style="border-radius:0px 0px 30px 30px;margin:0%;">
					<button class="ui primary button" style="border-radius:50px 50px 50px 50px;color:black !important;" onclick={ctrl.popForm}>
						+ Add Task
						{this.scheduleForm(ctrl)}
					</button>
				</div>
			</div>
		</div>
	)
}

Analytics.view = function(ctrl){
	
		return(
			<div class="ui grid">
				<div class="eight wide column">
					<h2 class="ui header dash_header">Appointments</h2>
					<div class="ui divider"></div>
					{this.loaded()?this.calenderView(ctrl):''}
				</div>
				{this.showSchedule()?this.scheduleDetails(ctrl):''}
				
			</div>
		)
}


module.exports = Analytics;