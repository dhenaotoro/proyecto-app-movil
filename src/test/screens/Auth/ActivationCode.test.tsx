import { render, screen, userEvent } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import { it, describe } from '@jest/globals';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import { confirmSignUp } from 'aws-amplify/auth';
import { useNavigation } from '@react-navigation/native';
import { Alert } from "react-native";
import { ActivationCode } from '../../../screens/Auth/ActivationCode';

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), // Esto mantiene el resto del módulo intacto
    useNavigation: jest.fn()
}));
jest.mock('aws-amplify/auth', () => ({
    confirmSignUp: jest.fn()
}));

describe('Activation Code', () => {
    let user: UserEventInstance;

    beforeEach(() => {
        user = userEvent.setup();
    });

    it('should show an introductory text', () => {
        render(<ActivationCode />);
    
        expect(screen.getByRole('text', { name: 'Se envió correo de confirmación al correo ** con el código de activación. Por favor regístralo a continuación'})).toBeDefined();
    });

    it('should show input text for activation code', () => {
        render(<ActivationCode />);
    
        expect(screen.getByTestId('ActivationCode.CodigoActivacion')).toBeDefined();
    });

    it('should show a button to ActivationCode', () => {
        render(<ActivationCode />);
    
        expect(screen.getByTestId('ActivationCode.Button')).toBeDefined();
    });

    it('should call the handlePress method when clicking the Continuar button', async () => {
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });
        (confirmSignUp as jest.Mock).mockReturnValue({
            isSignedIn: true,
            nextStep: 'COMPLETED'
        });
        render(<ActivationCode />);
    
        await user.type(screen.getByTestId('ActivationCode.CodigoActivacion'), '12456900');
        await user.press(screen.getByLabelText('ActivationCode.Button'));

        expect(confirmSignUp).toHaveBeenCalledWith({ username: 'test@email.com', password: 'T345sdad'});
        expect(mockNavigate).toHaveBeenCalledWith('Login');
    });

    it('should show an Alert when signIn fails', async () => {
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });
        (confirmSignUp as jest.Mock).mockRejectedValue({});
        const alertFn = jest.spyOn(Alert, 'alert');

        render(<ActivationCode />);
    
        await user.type(screen.getByTestId('ActivationCode.CodigoActivacion'), '12456900');
        await user.press(screen.getByLabelText('ActivationCode.Button'));

        expect(confirmSignUp).toHaveBeenCalledWith({ username: 'test@email.com', password: 'T345sdad'});
        expect(alertFn).toHaveBeenCalled();
    });
});