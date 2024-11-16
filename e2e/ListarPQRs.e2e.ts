import { isScreenShown } from "./utils/isScreenShown";
import { by, element, expect, waitFor } from 'detox';
import { USER_LOGIN } from "./utils/mockedData";

describe('ListarPQRs Component', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it.skip('should successfully log in and see the Crear PQRs and Chatbot buttons when valid user credentials are provided', async () => {
    await isScreenShown('Login');

    await element(by.id('Login.Correo')).typeText(USER_LOGIN.email);
    await element(by.id('Login.Password')).typeText(USER_LOGIN.password);
    await element(by.id('Login.Password')).tapReturnKey();

    await element(by.id('Login.Button')).tap();

    await isScreenShown('ListarPQRs');

    await expect(element(by.id('ListarPQRs.MainTitle'))).toBeVisible(100);

    await waitFor(element(by.id('ListarPQRs.ChatbotButton'))).toBeVisible().whileElement(by.id('ListarPQRs.ScrollView')).scroll(4000, 'down');

    await expect(element(by.id('ListarPQRs.CrearPQRsButton'))).toBeVisible(100);
    await expect(element(by.id('ListarPQRs.ChatbotButton'))).toBeVisible(100);
  });
  
});
