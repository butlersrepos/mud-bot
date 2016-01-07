import rewire from 'rewire';
import {expect,default as chai} from 'chai';
import spies from 'chai-spies';
let underTest = rewire('../build/sensory-organ');
underTest.__Rewire__('hud', chai.spy.object([`appendToTelnetPane`, `appendToBotPane`]));

describe('Sensory Organ', () => {
	let exampleData = 'HP: 1/2 SP: 3/4 EXP: 567 DAM: 89';
	let exampleDescription = `It is bright, but you can still see.
			[Damp Cavern]
			For the most part, the cavern remains unchanged while traversing it. Fungus cows
			continue to graze up the 'bad' moss and lichen present in the room. However,
			there has been a noticeable increase in the number of, odd-looking Mycoid
			herdsmen tending to the fungus and roaming animals.

			There are three obvious exits: east, south and west.
			[=] A fungus cow
			[=] A fungus cow
			[^] An ugly, pockmarked man
			[=] A mycoid worker
			[=] A mycoid worker
			[=] A mycoid worker
			`;
	let exampleBio = ` Statistics for Grundelmann

			On for : 0 hours, 4 minutes, 24 seconds

			Damage Statistics                         Kills Information

			Damage Done          : 85                 Best Kill    : Shrieker (level 3)
			Combat Rounds        : 23 (17%)           Last Kill    : Mycoid work (level 2)
			Damage Taken         : 0                  Last Killer  : No one
			SP Spent             : 0                  Last PK      : No one
			Total Life Kills     : 58
			Total Life Deaths    : 0
			Average Damage per Round: 3
			Average Taken per Round: 0

			Experience Statistics
			Total     : 145
			Last Kill : 30
			EXP/Hour  : 1,977
			EXP/Min   : 32


			Favorite kills:
			  28: mycoid worker   21: fungus cow       3: fungal zombie    2: shrieker
			   2: skeleton         2: Ugly, pockmar`;

	describe('#readHP', () => {
		let result = underTest.readHP(exampleData);

		it('should parse hit points out of valid strings', () => {
			expect(result.currentHitPoints).to.equal(1);
			expect(result.maximumHitPoints).to.equal(2);
		});
	});

	describe('#readSP', () => {
		let result = underTest.readSP(exampleData);

		it('should parse the special points out of a valid string', () => {
			expect(result.currentSpecialPoints).to.equal(3);
			expect(result.maxSpecialPoints).to.equal(4);
		});
	});

	describe('#readExp', ()=> {
		let result = underTest.readExp(exampleData);

		it('should parse the experience points out of a valid string', () => {
			expect(result).to.equal(567);
		});
	});

	describe('#readDamage', () => {
		let result = underTest.readDamage(exampleData);

		it('should parse the damage out of a valid string', () => {
			expect(result).to.equal(89);
		});
	});

	describe('#readEnemies', () => {
		let result = underTest.readEnemies(exampleDescription);

		it('should find the correct number of enemies', () => {
			expect(result.length).to.equal(6);
		});

		it('should have the correct difficulties', () => {
			expect(result[0].difficulty).to.equal('=');
			expect(result[1].difficulty).to.equal('=');
			expect(result[2].difficulty).to.equal('^');
			expect(result[3].difficulty).to.equal('=');
			expect(result[4].difficulty).to.equal('=');
			expect(result[5].difficulty).to.equal('=');
		});

		it('should register names', () => {
			expect(result[0].name).to.equal('A fungus cow');

			expect(result[2].name).to.equal('An ugly, pockmarked man');

			expect(result[5].name).to.equal('A mycoid worker');
		});
	});

	describe('#readMyName', () => {
		let result = underTest.readMyName(exampleBio);

		it('should get a name', ()=> {
			expect(result).to.equal('Grundelmann');
		});
	});

	describe('#isFighting', () => {
		let name = `TestName`;

		it('should return true if description shows us fighting', ()=> {
			let exampleFightingDescription = `
				There are three obvious exits: east, south and west.
				[=] A fungus cow is fighting ${name}
				`;

			let result = underTest.isFighting(exampleFightingDescription, name);
			expect(result).to.be.true;
		});

		it('should return false if description does not show us fighting', () => {
			let result = underTest.isFighting(exampleDescription, name);
			expect(result).to.be.false;
		});
	});

	describe('#justKilledSomeone', () => {
		it('should return true if we just killed someone', () => {
			let exampleDeath = `
				You killed a mycoid worker.
				`;

			let result = underTest.justKilledSomeone(exampleDeath);
			expect(result).to.be.true;
		});

		it('should return false if we have not killed anyone', () => {
			let result = underTest.justKilledSomeone(exampleDescription);
			expect(result).to.be.false;
		});
	});
});