import { isScreenShown } from "./utils/isScreenShown";
import {by, element, expect} from 'detox';
import {v4 as uuidv4} from 'uuid';

describe('Register Component', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should register an iddle user', async () => {
    await isScreenShown('Login');

    await element(by.id('Login.Register')).tap();

    await isScreenShown('Register');
    
    await waitFor(element(by.id('Register.TipoDocumento'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('Register.TipoDocumento')).tap();

    await waitFor(element(by.text('Cédula de extranjería'))).toBeVisible(100).withTimeout(1000);
    await element(by.text('Cédula de extranjería')).tap();

    await waitFor(element(by.id('Register.Documento'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('Register.Documento')).replaceText('1088256784');

    await waitFor(element(by.id('Register.Nombres'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('Register.Nombres')).replaceText('Pedro Andres');

    await waitFor(element(by.id('Register.Apellidos'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('Register.Apellidos')).replaceText('Henao Toro');

    await waitFor(element(by.id('Register.Telefono'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('Register.Telefono')).replaceText('3106787908');

    await waitFor(element(by.id('Register.Direccion'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('Register.Direccion')).replaceText('Diagonal 12 D #40-01');

    let emailUuid = uuidv4();
    await waitFor(element(by.id('Register.Correo'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('Register.Correo')).replaceText(`${emailUuid}@outlook.com`);

    await waitFor(element(by.id('Register.Password'))).toBeVisible().whileElement(by.id('Register.ScrollView')).scroll(500, 'down');
    await waitFor(element(by.id('Register.Password'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('Register.Password')).replaceText('Password1!');

    await waitFor(element(by.id('Register.PasswordRepeated'))).toBeVisible(100).withTimeout(1000);
    await element(by.id('Register.PasswordRepeated')).replaceText('Password1!');
    
    await expect(element(by.id('Register.PoliticaPrivacidad'))).toBeVisible(100);
    await element(by.id('Register.PoliticaPrivacidad')).tap();

    await expect(element(by.id('Register.Button'))).toBeVisible(100);
    await element(by.id('Register.Button')).tap();
  });
});

