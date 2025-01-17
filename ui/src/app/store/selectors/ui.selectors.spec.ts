import { showSearchPatientOnMenu } from './ui.selectors';

describe('I navigate to home page', () => {
  const url = '/home';
  it('should hide patient search bar', () => {
    expect(showSearchPatientOnMenu.projector(url)).toBe(false);
  });
});
