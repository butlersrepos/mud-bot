import rewire from 'rewire';
import {expect, should, default as chai} from 'chai';
import spies from 'chai-spies';
chai.use(spies);

let murder = rewire('../build/murder-organ');

describe('Murder Organ', () => {
});