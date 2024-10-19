import { render, screen, userEvent } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import { it, describe, beforeEach } from '@jest/globals';
import CrearPQRs from '../../../screens/CrearPQRs/CrearPQRs';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';

describe('CrearPQRs', () => {
    let user: UserEventInstance;

    beforeEach(() => {
        user = userEvent.setup();
    });

    it('should display the app title', () => {
        render(<CrearPQRs />);
        expect(screen.getByText('ABCall')).toBeDefined();
    });

    it('should display the subtitle', () => {
        render(<CrearPQRs />);
        expect(screen.getByText('Gestiona tus PQRs rápidamente, regístrate ya!')).toBeDefined();
    });

    it('should display the request type label and dropdown', () => {
        render(<CrearPQRs />);
        expect(screen.getByText('Tipo de solicitud *')).toBeDefined();
        const requestTypeDropdown = screen.getByTestId('request-type-dropdown'); // Asegúrate de agregar testID al dropdown
        expect(requestTypeDropdown).toBeDefined();
    });

    it('should display the description label and text area', () => {
        render(<CrearPQRs />);
        expect(screen.getByText('Descripción *')).toBeDefined();
        const descriptionArea = screen.getByTestId('description-textarea'); // Asegúrate de agregar testID al área de texto
        expect(descriptionArea).toBeDefined();
    });

    it('should display the acquisition date label and calendar dropdown', () => {
        render(<CrearPQRs />);
        expect(screen.getByText('Fecha de adquisición *')).toBeDefined();
    });

    it('should display the transaction number label and input', () => {
        render(<CrearPQRs />);
        expect(screen.getByText('Número de transacción *')).toBeDefined();
        const transactionInput = screen.getByTestId('transaction-input'); // Asegúrate de agregar testID al input
        expect(transactionInput).toBeDefined();
    });

    it('should display the problem impact label and dropdown', () => {
        render(<CrearPQRs />);
        expect(screen.getByText('Impacto del problema')).toBeDefined();
        const impactDropdown = screen.getByTestId('problem-impact-dropdown'); // Asegúrate de agregar testID al dropdown
        expect(impactDropdown).toBeDefined();
    });

    it('should display the solution impact label and dropdown', () => {
        render(<CrearPQRs />);
        expect(screen.getByText('Impacto de solución')).toBeDefined();
        const solutionImpactDropdown = screen.getByTestId('solution-impact-dropdown'); // Asegúrate de agregar testID al dropdown
        expect(solutionImpactDropdown).toBeDefined();
    });

    it('should display the personal data consent checkbox', () => {
        render(<CrearPQRs />);
        const consentCheckbox = screen.getByRole('checkbox'); // Asegúrate de que el checkbox tenga un rol
        expect(consentCheckbox).toBeDefined();
        expect(screen.getByText('Acepto el uso de datos personales')).toBeDefined();
    });

    it('should display the save button', () => {
        render(<CrearPQRs />);
        const saveButton = screen.getByText('Guardar');
        expect(saveButton).toBeDefined();
    });

    it('should validate required fields when saving', async () => {
        render(<CrearPQRs />);
        const saveButton = screen.getByText('Guardar');
        await user.press(saveButton);
        // Aquí debes añadir validaciones para verificar que los mensajes de error se muestran.
    });
});
