import {expect, default as chai} from 'chai';
import rewire from 'rewire';
import spies from 'chai-spies';
chai.use(spies);

let underTest = rewire('../build/memory-organ');
underTest.__Rewire__('hud', chai.spy.object([`appendToTelnetPane`, `appendToBotPane`]));

describe(`Memory Organ`, () => {
	describe('#giveMeATarget', function () {
		it('should return null if memory has no enemies', function () {
			underTest.__set__('lastSeenEnemies', null);

			let result = underTest.giveMeATarget();

			expect(result).to.be.null;
		});

		it('should return the lowest level enemy when there are multiple', function () {
			let weakEnemy = {
				name      : 'weak',
				difficulty: 'v'
			};
			let strongEnemy = {
				name      : 'strong',
				difficulty: '='
			};

			underTest.__set__('lastSeenEnemies', [strongEnemy, weakEnemy]);

			let result = underTest.giveMeATarget();

			expect(result).to.equal(weakEnemy);
		});
	});
});
