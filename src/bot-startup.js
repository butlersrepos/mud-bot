import readline from 'readline';
import Q from 'q';
import login from './bot-login';
import stream from 'stream';
import * as hud from './mud-hud';

let profile = {};
let rl;

function getAccountName() {
	let defer = Q.defer();
	rl.question('Tsunami Account?', (answer) => {
		profile.accountName = answer;
		defer.resolve();
	});
	return defer.promise;
}

function getAccountPass() {
	let defer = Q.defer();
	rl.question("Tsunami account password?", (answer) => {
		profile.accountPass = answer;
		defer.resolve();
	});
	return defer.promise;
}

function getCharacterSlot() {
	let defer = Q.defer();
	rl.question("Tsunami character slot number?", (answer) => {
		profile.characterSlot = parseInt(answer);
		defer.resolve();
	});
	return defer.promise;
}

export default function startup() {
	let telnetStream = new stream.Writable({
		write: function(chunk, encoding, next) {
			hud.appendToTelnetPane(chunk);
			next();
		}
	});

	rl = readline.createInterface({
		input : process.stdin,
		output: telnetStream
	});

	getAccountName()
		.then(getAccountPass)
		.then(getCharacterSlot)
		.then(() => {
			login(profile).startConnection();
		});

}
