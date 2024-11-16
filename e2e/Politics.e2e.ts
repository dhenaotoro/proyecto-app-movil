import { isScreenShown } from "./utils/isScreenShown";
import {by, element, expect} from 'detox';

describe('Politics Component', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show politics and privacy screen', async () => {
    await isScreenShown('Login');

    await element(by.id('Login.Register')).tap();

    await isScreenShown('Register');

    await waitFor(element(by.id('Register.PoliticsAndPrivacyLink'))).toBeVisible().whileElement(by.id('Register.ScrollView')).scroll(500, 'down');
    await element(by.id('Register.PoliticsAndPrivacyLink')).tap();

    await isScreenShown('Politics');
  });
});