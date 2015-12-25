import * as memory from './memory-organ';
import * as hud from './mud-hud';
import murder from './murder-organ';
import colors from 'colors';

let lookTimer = 1000;
let socket;
let log = (message)=> {
	hud.appendToBotPane("@===BOT===@ ".rainbow + message);
};

export default function begin(newSocket) {
	socket = newSocket;

	socket.on('data', memory.observe);
	socket.on('data', liveYoLifeNinja);

	setInterval(lookAround, lookTimer);
	findOutAboutSelf();
};

function liveYoLifeNinja(data) {
	hud.appendToTelnetPane(data);

	if( memory.health() > 0.9 && !memory.isFighting() ) {
		log("murder time!");
		murder(socket);
	}
}

function findOutAboutSelf() {
	socket.write('hp\r');
	socket.write('bio\r');
}

function lookAround() {
	socket.write('look\r');
}