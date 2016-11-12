import dropdown from 'dropdown';
import popup from 'popup';
import form from 'form';

import transition from 'transition';
import restful, { fetchBackend } from 'restful.js';


window.ws = null; //default null xmpp connection

m.cookie = require('js-cookie');

//for semantic ui colors
m.seriesColors = ['blue', 'orange', 'teal', 'green', 'red', 'violet', 'purple', 'pink', 'brown', 'grey'];
m.colors = ['red', 'blue', 'orange', 'teal', 'olive', 'pink', 'green', 'violet', 'yellow', 'purple', 'brown', 'grey'];

const api = restful(API, fetchBackend(fetch));

const usersCollection = api.all('users'); // /users
const session = api.all('session'); // /session
const mobileSession = session.custom('mobile'); // /session/mobile
const emailsSession = session.custom('email'); // /session/email


//start the routings
m.route = require('./routes');