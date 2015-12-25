import rewire from 'rewire';
import {expect, default as chai} from 'chai';
import spies from 'chai-spies';
chai.use(spies);

let underTest = rewire('../build/mud-bot');

describe('Mud Bot', () => {
	let murderSpy, memorySpy;
	beforeEach(() => {
		murderSpy = chai.spy();
		underTest.__Rewire__('murder', murderSpy);

		memorySpy = chai.spy.object(['health', 'isFighting']);
		underTest.__Rewire__('memory', memorySpy);
	});

	it('should murder when healthy and not fighting', () => {
		memorySpy.health = () => 1.0;
		memorySpy.isFighting = () => false;

		underTest.__get__('liveYoLifeNinja')();

		expect(murderSpy).to.have.been.called();
	});
});