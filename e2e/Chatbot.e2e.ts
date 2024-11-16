import { isScreenShown } from "./utils/isScreenShown";
import { by, element, expect, waitFor } from 'detox';
import { USER_LOGIN } from "./utils/mockedData";

describe('Chatbot Component', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it.skip('should successfully log in, navigate to Chatbot, and create a new PQRs when valid user credentials are provided', async () => {
    await isScreenShown('Login');

    await element(by.id('Login.Correo')).typeText(USER_LOGIN.email);
    await element(by.id('Login.Password')).typeText(USER_LOGIN.password);
    await element(by.id('Login.Password')).tapReturnKey();

    await element(by.id('Login.Button')).tap();

    await isScreenShown('ListarPQRs');

    await expect(element(by.id('ListarPQRs.MainTitle'))).toBeVisible(100);

    await waitFor(element(by.id('ListarPQRs.ChatbotButton'))).toBeVisible().whileElement(by.id('ListarPQRs.ScrollView')).scroll(2000, 'down');
    await element(by.id('ListarPQRs.ChatbotButton')).tap();

    await isScreenShown('Chatbot');

    await waitFor(element(by.id('Chatbot.Option.Queja'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('Chatbot.Option.Queja')).tap();

    await waitFor(element(by.id('Chatbot.EnviarMensaje'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('Chatbot.EnviarMensaje')).replaceText('Se reporta un producto en mal estado.');
    await element(by.id('Chatbot.EnviarMensaje.IconButton')).tap();

    await waitFor(element(by.id('Chatbot.EnviarMensaje'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('Chatbot.EnviarMensaje')).replaceText('2024-09-11');
    await element(by.id('Chatbot.EnviarMensaje.IconButton')).tap();

    await waitFor(element(by.id('Chatbot.EnviarMensaje'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('Chatbot.EnviarMensaje')).replaceText('9745672456');
    await element(by.id('Chatbot.EnviarMensaje.IconButton')).tap();

    await element(by.id('Chatbot.Option.Si')).tap();

    await element(by.id('MainHeader.CloseButton')).tap();

    await isScreenShown('ListarPQRs');
  });
});