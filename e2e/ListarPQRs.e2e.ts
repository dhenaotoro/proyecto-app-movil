import { isScreenShown } from "./utils/isScreenShown";
import { by, element, expect } from 'detox';
import { USER_LOGIN } from "./utils/mockedData";

describe('Login Component', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should successfully log in and navigate to CrearPQRs when valid user credentials are provided', async () => {
    await isScreenShown('Login');

    await element(by.id('Login.Correo')).typeText(USER_LOGIN.email);
    await element(by.id('Login.Password')).typeText(USER_LOGIN.password);
    await element(by.id('Login.Password')).tapReturnKey();

    await element(by.id('Login.Button')).tap();

    await isScreenShown('ListarPQRs');
    await element(by.id('CrearPQRs.Button')).tap();

    await isScreenShown('CrearPQRs');

    // Optionally, you can check if a specific element in CrearPQRs is visible
    await expect(element(by.id('CrearPQRs.MainTitle'))).toBeVisible(100);

  });
  
});
