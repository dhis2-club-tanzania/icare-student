import { GroupParametersByHeadersPipe } from './group-parameters-by-headers.pipe';

describe('GroupParametersByHeadersPipe', () => {
  it('create an instance', () => {
    const pipe = new GroupParametersByHeadersPipe();
    expect(pipe).toBeTruthy();
  });
});
