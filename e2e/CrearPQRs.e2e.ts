import { isScreenShown } from "./utils/isScreenShown";
import { by, element, expect, waitFor } from 'detox';
import { USER_LOGIN } from "./utils/mockedData";

describe('CrearPQRs Component', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should successfully log in, navigate to CrearPQRs, and create a new PQRs when valid user credentials are provided', async () => {
    await isScreenShown('Login');

    await element(by.id('Login.Correo')).typeText(USER_LOGIN.email);
    await element(by.id('Login.Password')).typeText(USER_LOGIN.password);
    await element(by.id('Login.Password')).tapReturnKey();

    await element(by.id('Login.Button')).tap();

    await isScreenShown('ListarPQRs');

    await expect(element(by.id('ListarPQRs.MainTitle'))).toBeVisible(100);

    await waitFor(element(by.id('ListarPQRs.CrearPQRsButton'))).toBeVisible().whileElement(by.id('ListarPQRs.ScrollView')).scroll(2000, 'down');

    await expect(element(by.id('ListarPQRs.CrearPQRsButton'))).toBeVisible(100);

    await element(by.id('ListarPQRs.CrearPQRsButton')).tap();

    await isScreenShown('CrearPQRs');

    // Fill out the form fields
    await waitFor(element(by.id('CrearPQRs.TipoSolicitud'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('CrearPQRs.TipoSolicitud')).tap();
    await waitFor(element(by.text('Petición'))).toBeVisible(100).withTimeout(1000);
    await element(by.text('Petición')).tap();

    await waitFor(element(by.id('CrearPQRs.Descripcion'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('CrearPQRs.Descripcion')).replaceText('Se solicita devolución del producto X.');

    // Enter transaction number
    await expect(element(by.id('CrearPQRs.NumeroTransaccion'))).toBeVisible(100);
    await element(by.id('CrearPQRs.NumeroTransaccion')).clearText();
    await element(by.id('CrearPQRs.NumeroTransaccion')).replaceText('345672456');

    // Select dropdown options
    await waitFor(element(by.id('CrearPQRs.ImpactoProblema'))).toBeVisible().whileElement(by.id('CrearPQRs.ScrollView')).scroll(500, 'down');

    await expect(element(by.id('CrearPQRs.ImpactoProblema'))).toBeVisible(100);
    await element(by.id('CrearPQRs.ImpactoProblema')).tap();
    await element(by.text('Moderado')).tap();

    await expect(element(by.id('CrearPQRs.ImpactoSolucion'))).toBeVisible(100);
    await element(by.id('CrearPQRs.ImpactoSolucion')).tap();
    await element(by.text('Compensación de dinero')).tap();

    await waitFor(element(by.id('CrearPQRs.Checkbox'))).toBeVisible().whileElement(by.id('CrearPQRs.ScrollView')).scroll(500, 'down');
    await expect(element(by.id('CrearPQRs.Checkbox'))).toBeVisible(100);
    await element(by.id('CrearPQRs.Checkbox')).tap();

    await expect(element(by.id('CrearPQRs.Button'))).toBeVisible(100);
    await element(by.id('CrearPQRs.Button')).tap();

    await expect(element(by.label('OK'))).toBeVisible(100);
    await element(by.label('OK')).tap();

    await isScreenShown('ListarPQRs');
  });
});