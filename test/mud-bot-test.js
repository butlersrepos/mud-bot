import rewire from 'rewire';
import {expect, default as chai} from 'chai';
import spies from 'chai-spies';
chai.use(spies);

let underTest = rewire('../build/mud-bot');
underTest.__Rewire__('hud', chai.spy.object([`appendToTelnetPane`, `appendToBotPane`]));

describe('Mud Bot', () => {
	let memorySpy, socketSpy;

	beforeEach(() => {
		socketSpy = chai.spy.object([`write`]);
		memorySpy = chai.spy.object(['health', 'isFighting', 'giveMeATarget']);

		underTest.__set__('socket', socketSpy);
		underTest.__Rewire__('memory', memorySpy);
	});

	describe('#fightNinja', function() {
		it('should send a kill command if there was an enemy', function() {
			memorySpy.giveMeATarget = () => 'worker';

			underTest.__get__('fightNinja')();

			expect(socketSpy.write).to.have.been.called.with('kill worker\r');
		});

		it('should not send a command if there was no enemy', function() {
			memorySpy.giveMeATarget = () => null;

			underTest.__get__('fightNinja')();

			expect(socketSpy.write).to.not.have.been.called();
		});
	});

	describe('#readyToFight', function() {
		it('should return false if health is below threshold', function() {
			underTest.__set__('fightingFormHealth', 1.0);
			memorySpy.health = () => 0.0;

			let result = underTest.__get__('readyToFight')();

			expect(result).to.be.false;
		});

		it('should return false if bot is currently fighting', function() {
			memorySpy.isFighting = () => true;

			let result = underTest.__get__('readyToFight')();

			expect(result).to.be.false;
		});

		it('should return true if everything is fine', function() {
			underTest.__set__('fightingFormHealth', 0.0);
			memorySpy.health = () => 1.0;
			memorySpy.isFighting = () => false;

			let result = underTest.__get__('readyToFight')();

			expect(result).to.be.true;
		});
	});

	describe('#liveYoLifeNinja', function() {
		it('should fight when ready to fight', () => {
			let fightSpy = chai.spy();
			let revertFightSpy = underTest.__set__('fightNinja', fightSpy);

			let readySpy = () => true;
			let revertReadySpy = underTest.__set__('readyToFight', readySpy);

			underTest.__get__('liveYoLifeNinja')();

			expect(fightSpy).to.have.been.called();
			revertFightSpy();
			revertReadySpy();
		});
	});
});