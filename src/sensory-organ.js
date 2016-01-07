import * as hud from './mud-hud';
/**
 * I am the low level distiller of information from the Telnets.
 */
let enemyRegex = /\[(.)\]\s(.+)(\r|\n)/g;
export function readEnemies(data) {
	let extrapolate;
	let enemyData = [];

	hud.appendToBotPane(`data is ${data}`);
	extrapolate = enemyRegex.exec(data);
	hud.appendToBotPane(`extrap is ${extrapolate}`);

	while( extrapolate != null ) {
		hud.appendToBotPane(`extrapolated ${extrapolate}`);
		extrapolate[2] = extrapolate[2].replace('[0m', '');
		let enemy = {
			difficulty: extrapolate[1],
			name      : extrapolate[2]
		};
		enemyData.push(enemy);
		extrapolate = enemyRegex.exec(data);
	}

	return enemyData;
}

let hpRegex = /HP: (\d+)\/(\d+)/g;
export function readHP(data) {
	if( data.match(hpRegex) ) {
		let extrapolate = hpRegex.exec(data);
		let currentHitPoints = parseInt(extrapolate[1]);
		let maximumHitPoints = parseInt(extrapolate[2]);
		return {currentHitPoints, maximumHitPoints};
	}
}

let spRegex = /SP: (\d+)\/(\d+)/g;
export function readSP(data) {
	if( data.match(spRegex) ) {
		let extrapolate = spRegex.exec(data);
		let currentSpecialPoints = parseInt(extrapolate[1]);
		let maxSpecialPoints = parseInt(extrapolate[2]);
		return {currentSpecialPoints, maxSpecialPoints};
	}
}

let expRegex = /EXP: (\d+)/g;
export function readExp(data) {
	if( data.match(expRegex) ) {
		let extrapolate = expRegex.exec(data);
		return parseInt(extrapolate[1]);
	}
}

let damageRegex = /DAM: (\d+)/g;
export function readDamage(data) {
	if( data.match(damageRegex) ) {
		let extrapolate = damageRegex.exec(data);
		return parseInt(extrapolate[1]);
	}
}

let nameRegex = /Statistics for (\w+)/;
export function readMyName(data) {
	if( data.match(nameRegex) ) {
		let extrapolate = nameRegex.exec(data);
		return extrapolate[1];
	}
}

export function isFighting(data, name) {
	let fightRegex = new RegExp(`is fighting ${name}`);
	return fightRegex.test(data);
}

let killedRegex = /You killed (.+)\./;
export function justKilledSomeone(data) {
	return killedRegex.test(data);
}