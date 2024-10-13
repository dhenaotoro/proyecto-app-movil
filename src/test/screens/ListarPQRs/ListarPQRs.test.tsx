import { render, screen, userEvent } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import { it, describe, beforeEach } from '@jest/globals';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import ListarPQRs from '../../../screens/ListarPQRs/ListarPQRs';

describe('ListarPQRs', () => {
    let user: UserEventInstance;

    beforeEach(() => {
        user = userEvent.setup();
    });

    it('should show the welcome message and username', () => {
        render(<ListarPQRs />);
        expect(screen.getByText('Bienvenido')).toBeDefined();
        expect(screen.getByText('IVAN')).toBeDefined();
    });

    it('should show the PQRs header', () => {
        render(<ListarPQRs />);
        expect(screen.getByText('PQRs')).toBeDefined();
    });

    it('should display the PQRs table with statuses and codes', () => {
        render(<ListarPQRs />);
        expect(screen.getByText('Abierto')).toBeDefined();
        expect(screen.getByText('000000001')).toBeDefined();
        const closedTexts = screen.getAllByText('Cerrado');
        expect(closedTexts).toHaveLength(2);
        expect(screen.getByText('000000002')).toBeDefined();
    });

    it('should show the register PQR button', () => {
        render(<ListarPQRs />);
        expect(screen.getByText('Registra tu PQR')).toBeDefined();
    });

    it('should trigger an action when register button is pressed', async () => {
        render(<ListarPQRs />);
        const registerButton = screen.getByText('Registra tu PQR');
        await user.press(registerButton);
    });
});