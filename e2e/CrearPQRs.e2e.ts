import { isScreenShown } from "./utils/isScreenShown";
import { by, element, expect, waitFor } from 'detox';
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
    await element(by.id('Login.Button')).tap();

    await isScreenShown('ListarPQRs');
    await element(by.id('CrearPQRs.Button')).tap();

    await isScreenShown('CrearPQRs');

    // Fill out the form fields
    await element(by.id('request-type-dropdown')).tap();
    await element(by.text('Petición')).tap();

    await element(by.id('description-textarea')).typeText('This is a test description.');

    // Enter transaction number
    await element(by.id('transaction-input')).clearText();
    await element(by.id('transaction-input')).typeText('12345'); // Enter the transaction number

    // Select dropdown options
    await element(by.id('problem-impact-dropdown')).tap();
    await element(by.text('Moderado')).tap();

    await element(by.id('solution-impact-dropdown')).tap();
    await element(by.text('Compensación de dinero')).tap();

    await element(by.id('CrearPQRs.Checkbox')).tap();

    await element(by.id('CrearPQRs.Button')).tap(); // Tap the save button

    // Optionally verify if a success message appears or check the next expected screen
    await expect(element(by.text('Guardado'))).toBeVisible();
  });
});