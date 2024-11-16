import { isScreenShown } from "./utils/isScreenShown";
import { by, element, expect, waitFor } from 'detox';
import { USER_LOGIN } from "./utils/mockedData";

describe('Alertas Component', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should successfully log in, navigate to DatosPersonales, and create a new PQRs when valid user credentials are provided', async () => {
    await isScreenShown('Login');

    await element(by.id('Login.Correo')).typeText(USER_LOGIN.email);
    await element(by.id('Login.Password')).typeText(USER_LOGIN.password);
    await element(by.id('Login.Password')).tapReturnKey();

    await element(by.id('Login.Button')).tap();

    await isScreenShown('ListarPQRs');

    await expect(element(by.id('ListarPQRs.MainTitle'))).toBeVisible(100);

    await waitFor(element(by.id('MainHeader.Button'))).toBeVisible();
    await element(by.id('MainHeader.Button')).tap();

    await waitFor(element(by.id('Modal.ContainerInternal'))).toBeVisible().withTimeout(1000);

    await waitFor(element(by.id('Modal.Alertas'))).toBeVisible().withTimeout(1000);
    await element(by.id('Modal.Alertas')).tap();

    await isScreenShown('Alertas');

    // Flag checkboxes to interface with the Alertas screen
    await expect(element(by.id('Alertas.SmsCheckbox'))).toBeVisible(100);
    await element(by.id('Alertas.SmsCheckbox')).tap();

    await expect(element(by.id('Alertas.EmailCheckbox'))).toBeVisible(100);
    await element(by.id('Alertas.EmailCheckbox')).tap();

    await expect(element(by.id('Alertas.CallCheckbox'))).toBeVisible(100);
    await element(by.id('Alertas.CallCheckbox')).tap();

    await expect(element(by.id('Alertas.Button'))).toBeVisible(100);
    await element(by.id('Alertas.Button')).tap();

    await expect(element(by.label('OK'))).toBeVisible(100);
    await element(by.label('OK')).tap();

    await isScreenShown('ListarPQRs');
  });
});