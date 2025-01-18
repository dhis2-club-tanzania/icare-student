import { SanitizeDangerousUrlPipe } from './sanitize-dangerous-url.pipe';

describe('SanitizeDangerousUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new SanitizeDangerousUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
