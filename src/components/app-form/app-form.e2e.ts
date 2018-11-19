import { newE2EPage } from '@stencil/core/testing';

describe('app-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-form></app-form>');

    const element = await page.find('app-form');
    expect(element).toHaveClass('hydrated');
  });

  it('contains a "Get Weather" input form', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-form></app-form>');

    const element = await page.find('app-form >>> .Boxy');
    expect(element.textContent).toEqual('');
  });
});
