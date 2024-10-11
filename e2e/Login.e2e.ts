import { isScreenShown } from "./utils/isScreenShown";
import {by, element, expect} from 'detox';

const SCREEN_TEST_ID = 'screen.Login';
const EMAIL_INPUT_TEST_ID = 'TextInput.Correo';
const PASSWORD_INPUT_TEST_ID = 'TextInput.Contraseña';
const LOGIN_BUTTON_TEST_ID = 'Login.loginButton';

describe('Login Component', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });
  it('should filter properties based on input (positive case)', async () => {
    isScreenShown(SCREEN_TEST_ID);

    await element(by.id(EMAIL_INPUT_TEST_ID)).typeText(USER_LOGIN.email);
    await element(by.id(PASSWORD_INPUT_TEST_ID)).typeText(USER_LOGIN.password);

    await element(by.id(LOGIN_BUTTON_TEST_ID)).tap();

    // at least one elements has the word office on it
    await expect(element(by.text('Listar PQR'))).toBeVisible();
  });
});