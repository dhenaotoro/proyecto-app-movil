import { isScreenShown } from "./utils/isScreenShown";
import { by, element, expect, waitFor } from 'detox';
import { USER_LOGIN } from "./utils/mockedData";

describe('DatosPersonales Component', () => {
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

    await waitFor(element(by.id('Modal.DatosPersonales'))).toBeVisible().withTimeout(1000);
    await element(by.id('Modal.DatosPersonales')).tap();

    await isScreenShown('DatosPersonales');

    // Fill out the form fields
    await waitFor(element(by.id('DatosPersonales.Telefono'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('DatosPersonales.Telefono')).tap();
    await element(by.id('DatosPersonales.Telefono')).clearText();
    await element(by.id('DatosPersonales.Telefono')).replaceText('3546789022');
    await element(by.id('DatosPersonales.Telefono')).tap();

    // Enter transaction number
    await waitFor(element(by.id('DatosPersonales.Direccion'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('DatosPersonales.Direccion')).tap();
    await element(by.id('DatosPersonales.Direccion')).clearText();
    await element(by.id('DatosPersonales.Direccion')).replaceText('Diagonal 45 #45-101');
    await element(by.id('DatosPersonales.Direccion')).tap();

    await expect(element(by.id('DatosPersonales.Button'))).toBeVisible(100);
    await element(by.id('DatosPersonales.Button')).tap();

    await expect(element(by.label('OK'))).toBeVisible(100);
    await element(by.label('OK')).tap();

    await isScreenShown('ListarPQRs');
  });
});