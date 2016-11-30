
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
		that.schedules = m.prop([]);

		that.getAgendas = function(id,today){
		    var j = id % 10;
		    var k = id % 100;
		    if (j == 1 && k != 11) {
		        that.dateToday = m.prop(id+ "st "+today)
		        that.todayDate = m.prop(id+" "+today)
		    } else if (j == 2 && k != 12) {
		        that.dateToday = m.prop(id+ "nd "+today)
		        that.todayDate = m.prop(id+" "+today)
		    } else if (j == 3 && k != 13) {
		       that.dateToday = m.prop(id+ "rd "+today)
		       that.todayDate = m.prop(id+" "+today)
		    } else{
		    	that.dateToday = m.prop(id+ "th "+today)
		    	that.todayDate = m.prop(id+" "+today)
		    }
		    var todayDate = that.todayDate().split(" ")
			switch(todayDate[1]) {
			    case "January":
			        todayDate = (Number(todayDate[0])*1000000) +(1*10000)+ Number(todayDate[2])
			        break;
				case "February":
			        todayDate = (Number(todayDate[0])*1000000) +(2*10000)+ Number(todayDate[2])
			        break;
			    case "March":
			        todayDate = (Number(todayDate[0])*1000000) +(3*10000)+ Number(todayDate[2])
			        break;
			    case "April":
			        todayDate = (Number(todayDate[0])*1000000) +(4*10000)+ Number(todayDate[2])
			        break;
			    case "May":
			        todayDate = (Number(todayDate[0])*1000000) +(5*10000)+ Number(todayDate[2])
			        break;
			    case "June":
			        todayDate = (Number(todayDate[0])*1000000) +(6*10000)+ Number(todayDate[2])
			        break;
			    case "July":
			       todayDate = (Number(todayDate[0])*1000000) +(7*10000)+ Number(todayDate[2])
			        break;
			    case "August":
			        todayDate = (Number(todayDate[0])*1000000) +(8*10000)+ Number(todayDate[2])
			        break;
			    case "September":
			        todayDate = (Number(todayDate[0])*1000000) +(9*10000)+ Number(todayDate[2])
			        break;
			    case "October":
			        todayDate = (Number(todayDate[0])*1000000) +(10*10000)+ Number(todayDate[2])
			        break;
			    case "November":
			        todayDate = (Number(todayDate[0])*1000000) +(11*10000)+ Number(todayDate[2])
			        break;
			    default:
			        todayDate = (Number(todayDate[0])*1000000) +(12*10000)+ Number(todayDate[2])
			}
		    m.api.one("schedule",todayDate).get().then(function(response){
		    	that.schedules = m.prop(response.body(false).data)
		    	Analytics.showSchedule = m.prop(true)
		    	m.redraw(true)
		    },function(error){
		    	console.log("error",error)
		    })
			m.redraw(true);
		}


		that.verifyAgenda = function(event){
			if(that.va==1){
				$.fn.form.settings.rules.checkMinutes = function(value) {
				  if((value%100)<=59){
				  	return true;
				  }
				  else
				  	return false;
				};
				$.fn.form.settings.rules.checkHours = function(value) {
				  if((value/100)<=23){
				  	return true;
				  }
				  else
				  	return false;
				};
				// $.fn.form.settings.rules.checkOfficeHours = function(value) {
				//   	if((value/100<9)||(value/100>19))
				//   		return false
				//   	else
				//   		return true;
				// };
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
			                        type: 'checkMinutes',
			                    	prompt: 'minutes hould be less than or equals to 59'
			                    },
			                    {
			                        type: 'checkHours',
			                    	prompt: 'hours should be less than or equals to 23'
			                    }//,
			                    // {
			                    //     type: 'checkOfficeHours',
			                    // 	prompt: 'Please select office hours only'
			                    // }
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
			                        type: 'checkMinutes',
			                    	prompt: 'minutes hould be less than or equals to 59 and hours should be less than or equals to 23'
			                    },
			                    {
			                        type: 'checkHours',
			                    	prompt: 'hours should be less than or equals to 23'
			                    }//,
			                    // {
			                    //     type: 'checkOfficeHours',
			                    // 	prompt: 'Please select office hours only'
			                    // }
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
						console.log("onSuccess")
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
			var todayDate = that.todayDate().split(" ")
			switch(todayDate[1]) {
			    case "January":
			    	console.log("jan")
			        todayDate = (Number(todayDate[0])*1000000) +(1*10000)+ Number(todayDate[2])
			        break;
				case "February":
					console.log("feb")
			        todayDate = (Number(todayDate[0])*1000000) +(2*10000)+ Number(todayDate[2])
			        break;
			    case "March":
			    	console.log("mar")
			        todayDate = (Number(todayDate[0])*1000000) +(3*10000)+ Number(todayDate[2])
			        break;
			    case "April":
			    	console.log("apr")
			        todayDate = (Number(todayDate[0])*1000000) +(4*10000)+ Number(todayDate[2])
			        break;
			    case "May":
			    	console.log("may")
			        todayDate = (Number(todayDate[0])*1000000) +(5*10000)+ Number(todayDate[2])
			        break;
			    case "June":
			    	console.log("june")
			        todayDate = (Number(todayDate[0])*1000000) +(6*10000)+ Number(todayDate[2])
			        break;
			    case "July":
			    	console.log("July")
			        todayDate = (Number(todayDate[0])*1000000) +(7*10000)+ Number(todayDate[2])
			        break;
			    case "August":
			    	console.log("aug")
			        todayDate = (Number(todayDate[0])*1000000) +(8*10000)+ Number(todayDate[2])
			        break;
			    case "September":
			    	console.log("sept")
			        todayDate = (Number(todayDate[0])*1000000) +(9*10000)+ Number(todayDate[2])
			        break;
			    case "October":
			    	console.log("oct")
			        todayDate = (Number(todayDate[0])*1000000) +(10*10000)+ Number(todayDate[2])
			        break;
			    case "November":
			    	console.log("nov")
			        todayDate = (Number(todayDate[0])*1000000) +(11*10000)+ Number(todayDate[2])
			        break;
			    default:
			    	console.log("dec")
			        todayDate = (Number(todayDate[0])*1000000) +(12*10000)+ Number(todayDate[2])
			}
			console.log(that.startTime(),that.endTime(),that.description(),todayDate)
			m.schedule.post({
                startTime: Number(that.startTime()),
                endTime: Number(that.endTime()),
                date: todayDate,
                task: that.description(),
            }).then(function(response){
		        console.log("reponse",response.body(false).data)
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

		that.addBackground = function(e,isInit){
			if (!isInit){
				e.style.background = m.seriesColors[Math.floor(Math.random() * (m.seriesColors.length-1)) + 0 ];
			}
		}

		
        Analytics.loaded = m.prop(true);
        m.redraw();

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
					    <input type="text" name="startTime" placeholder="HHMM" oninput={m.withAttr("value",ctrl.startTime)} value={ctrl.startTime()}/>
				    </div>
    				<div class="field">
      					<label>End Time</label>
					    <input type="text" name="endTime" placeholder="HHMM" oninput={m.withAttr("value",ctrl.endTime)} value={ctrl.endTime()}/>
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
					<table class="ui celled table" style="width:100.35%;">
					{
						ctrl.schedules().map(function(schedule,i){
							return(
								<tr config={ctrl.addBackground}>
									<td height="100" align="center" style="width:15%;">{schedule.StartTime}<br/><br/><br/>{schedule.EndTime}</td>
									<td height="100" style="width:85%;">{schedule.Task}</td>
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