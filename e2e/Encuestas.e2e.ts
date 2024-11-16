import { isScreenShown } from "./utils/isScreenShown";
import { by, element, expect, waitFor } from 'detox';
import { USER_LOGIN } from "./utils/mockedData";

describe('Encuestas Components', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should successfully log in, navigate to Encuestas, and answer a outstanding poll when valid user credentials are provided', async () => {
    await isScreenShown('Login');

    await element(by.id('Login.Correo')).typeText(USER_LOGIN.email);
    await element(by.id('Login.Password')).typeText(USER_LOGIN.password);
    await element(by.id('Login.Password')).tapReturnKey();

    await element(by.id('Login.Button')).tap();

    await isScreenShown('ListarPQRs');

    await expect(element(by.id('ListarPQRs.MainTitle'))).toBeVisible(100);

    await waitFor(element(by.id('ListarPQRs.EncuestasButton'))).toBeVisible().whileElement(by.id('ListarPQRs.ScrollView')).scroll(2000, 'down');
    await expect(element(by.id('ListarPQRs.EncuestasButton'))).toBeVisible(100);
    await element(by.id('ListarPQRs.EncuestasButton')).tap();

    await isScreenShown('Encuestas');

    await waitFor(element(by.id('Encuestas.EncuestaBot.Encuesta satisfacción'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('Encuestas.EncuestaBot.Encuesta satisfacción')).tap();

    await isScreenShown('EncuestaBot');

    await waitFor(element(by.id('EncuestaBot.Button.1'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('EncuestaBot.Button.1')).tap();

    await waitFor(element(by.id('EncuestaBot.Option.Yes'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('EncuestaBot.Option.Yes')).tap();
    
    await waitFor(element(by.id('EncuestaBot.Descripcion'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('EncuestaBot.Descripcion')).replaceText('Muy buena aplicación');

    await waitFor(element(by.id('EncuestaBot.Button'))).toBeVisible(100);
    await element(by.id('EncuestaBot.Button')).tap();

    await isScreenShown('Encuestas');
  });
});