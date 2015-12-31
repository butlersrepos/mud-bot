import * as memory from './memory-organ';
import * as hud from './mud-hud';
import colors from 'colors';

let lookTimer = 1000;
let fightingFormHealth = 0.9;
let socket;
let botLog = (message)=> {
	hud.appendToBotPane("@===BOT===@ ".rainbow + message);
};

export default function begin(newSocket) {
	socket = newSocket;

	socket.on('data', memory.observe);
	socket.on('data', liveYoLifeNinja);

	setInterval(lookAround, lookTimer);
	findOutAboutSelf();
};

function fightNinja() {
	botLog("murder time!");
	let target = memory.giveMeATarget();
	if( target === null ) {
		return;
	}

	botLog("Murdering...");
	socket.write(`kill ${target}\r`);
}

function liveYoLifeNinja(data) {
	hud.appendToTelnetPane(data);

	if( readyToFight() ) {
		fightNinja();
	}
}

function readyToFight() {
	if( memory.health() < fightingFormHealth ) return false;
	if( memory.isFighting() ) return false;
	return true;
}

function findOutAboutSelf() {
	socket.write('hp\r');
	socket.write('bio\r');
}

function lookAround() {
	socket.write('look\r');
}