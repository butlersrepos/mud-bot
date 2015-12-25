import readline from 'readline';
import Q from 'q';
import login from './bot-login';

let rl = readline.createInterface( {
	input : process.stdin,
	output: process.stdout
} );

let profile = {};

function getAccountName() {
	let defer = Q.defer();
	rl.question( 'Tsunami Account?', ( answer ) => {
		profile.accountName = answer;
		defer.resolve();
	} );
	return defer.promise;
}

function getAccountPass() {
	let defer = Q.defer();
	rl.question( "Tsunami account password?", ( answer ) => {
		profile.accountPass = answer;
		defer.resolve();
	} );
	return defer.promise;
}

function getCharacterSlot() {
	let defer = Q.defer();
	rl.question( "Tsunami character slot number?", ( answer ) => {
		profile.characterSlot = parseInt( answer );
		defer.resolve();
	} );
	return defer.promise;
}

getAccountName()
	.then( getAccountPass )
	.then( getCharacterSlot )
	.then( () => {
		login(profile).startConnection();
	} );
