import { CloudAppPage } from './app.po';

describe('cloud-app App', () => {
  let page: CloudAppPage;

  beforeEach(() => {
    page = new CloudAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
