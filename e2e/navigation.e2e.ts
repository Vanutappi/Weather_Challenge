import { newE2EPage } from '@stencil/core/testing';

describe('navigation', () => {
  it('goes to the form page', async () => {
    const page = await newE2EPage({ url: '/'});

    const button = await page.find('app-root >>> app-form >>> button');
    expect(button).toBeTruthy();
    await button.click();
  });
});
