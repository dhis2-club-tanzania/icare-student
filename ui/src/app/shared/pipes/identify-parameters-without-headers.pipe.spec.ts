import { IdentifyParametersWithoutHeadersPipe } from './identify-parameters-without-headers.pipe';

describe('IdentifyParametersWithoutHeadersPipe', () => {
  it('create an instance', () => {
    const pipe = new IdentifyParametersWithoutHeadersPipe();
    expect(pipe).toBeTruthy();
  });
});
