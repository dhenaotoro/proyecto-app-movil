import { isScreenShown } from "./utils/isScreenShown";
import {by, element, expect} from 'detox';
import { USER_LOGIN } from "./utils/mockedData";

describe('Login Component', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should filter properties based on input (positive case)', async () => {
    await isScreenShown('Login');

    await element(by.id('Login.Correo')).typeText(USER_LOGIN.email);
    await element(by.id('Login.Password')).typeText(USER_LOGIN.password);

    await element(by.id('Login.Button')).tap();

    await isScreenShown('ListarPQRs');
    
    await expect(element(by.id('ListarPQRs.MainTitle'))).toBeVisible(100);
  });
});