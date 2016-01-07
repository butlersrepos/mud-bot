import net from 'net';
import colors from 'colors';
import * as hud from './mud-hud';
import botBegin from './mud-bot';
import {TelnetInput, TelnetOutput} from 'telnet-stream';
import loginActions from './definitions/login-actions.json';

let socket = null;
let reconnecting = /Reconnecting\.\.\./;
let startPlaying = /Time of last login:/;

export default function credentials({accountName, accountPass, characterSlot} = {}) {
	setLoginAction("Entering username.", accountName);
	setLoginAction("Entering password.", accountPass);
	setLoginAction("Selecting character.", characterSlot);

	return {startConnection};
};

function setLoginAction(eventName, value) {
	loginActions.forEach((action) => {
		if( action.eventName == eventName ) {
			action.command = value;
		}
	})
}

function startConnection() {
	hud.appendToBotPane("Connecting to Tsunami MUD");
	socket = net.createConnection(23, 'tsunami.thebigwave.net', function() {
		var telnetInput = new TelnetInput();
		var telnetOutput = new TelnetOutput();

		socket.setEncoding("utf8").pipe(telnetInput).on("data", parser);
		process.stdin.pipe(telnetOutput).pipe(socket);
	});
}

function parser(data) {
	hud.appendToTelnetPane(data);

	if( startPlaying.test(data) || reconnecting.test(data) ) {
		socket.removeListener('data', parser);
		botBegin(socket);
	}

	checkLoginActions(data);
}

function checkLoginActions(data) {
	loginActions.forEach(function(action) {
		let foundCues = action.cues.filter((cue) => {
			return data.indexOf(cue) != -1;
		});

		if( foundCues.length > 0 ) {
			hud.appendToBotPane("@===BOT===@ ".rainbow + action.eventName);
			socket.write(action.command + '\r');
		}
	});
}