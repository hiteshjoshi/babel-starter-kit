import dropdown from 'dropdown';
import popup from 'popup';
import form from 'form';
import modal from 'modal';
import dimmer from 'dimmer';

import transition from 'transition';
import restful, {
	fetchBackend
} from 'restful.js';


window.ws = null; //default null xmpp connection

m.cookie = require('js-cookie');

//for semantic ui colors
m.seriesColors = ['blue', 'orange', 'teal', 'green', 'red', 'violet', 'purple', 'pink', 'brown', 'grey'];
m.colors = ['red', 'blue', 'orange', 'teal', 'olive', 'pink', 'green', 'violet', 'yellow', 'purple', 'brown', 'grey'];

m.api = restful(API, fetchBackend(fetch));
// m.api = m.prop(api)

m.usersCollection = m.api.all('users'); // /users
m.schedule = m.api.all('schedule'); // /schedule
m.ping = m.api.custom('ping');; // /ping

//start the routings
m.route = require('./routes');