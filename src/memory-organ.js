/**
 * I am the composer of stateful information and logical groupings of higher level concepts.
 */
import * as senses from './sensory-organ';

let name;
let currentHitPoints, maximumHitPoints;
let currentSpecialPoints, maximumSpecialPoints;
let experiencePoints;
let damage;
let lastSeenEnemies;
let currentState = {
	fighting: false
};
let reportStatus = () => {
	console.log(`STATUS! HEALTH: ${currentHitPoints}/${maximumHitPoints} - SPECIAL: ${currentSpecialPoints}/${maxSpecialPoints}`);
};

export function observe(data) {
	checkMyStats(data);
	checkMySurroundings(data);
}

function checkMyStats(data) {
	let hp = senses.readHP(data);
	({currentHitPoints, maximumHitPoints} = hp ? hp : {currentHitPoints, maximumHitPoints});

	let sp = senses.readSP(data);
	({currentSpecialPoints, maximumSpecialPoints} = sp ? sp : {currentSpecialPoints, maximumSpecialPoints});

	let exp = senses.readExp(data);
	experiencePoints = exp ? exp : experiencePoints;

	let dmg = senses.readDamage(data);
	damage = dmg ? dmg : damage;

	if( !name ) {
		let seenName = senses.readMyName(data);
		name = seenName ? seenName : null;
	}
}

export function giveMeATarget() {
	if( !lastSeenEnemies ) return null;
	let difficultyOrder = ['v', '=', '^'];

	lastSeenEnemies.sort((a, b) => {
		return difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);
	});

	return lastSeenEnemies[0];
}

function checkMySurroundings(data) {
	let enemies = senses.readEnemies(data);
	lastSeenEnemies = enemies ? enemies : lastSeenEnemies;

	let justFinishedFight = senses.justKilledSomeone(data);
	currentState.fighting = justFinishedFight ? false : currentState.fighting;

	let isInFight = senses.isFighting(data, name);
	currentState.fighting = isInFight ? true : currentState.fighting;
}

export function health() {
	return currentHitPoints / maximumHitPoints;
}

export function isFighting() {
	return currentState.fighting;
}