import { render, screen, userEvent } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import {it, describe} from '@jest/globals';
import MainHeader from '../../../components/Header/MainHeader';
import { useMenuModal } from '../../../context/MenuModalContext';

jest.mock('../../../context/MenuModalContext');

describe('MainHeader', () => {
    // Mockea la función openMenu
    const mockOpenMenu = jest.fn();
    const mockBackPress = jest.fn();

    beforeEach(() => {
        // Simula el contexto y su función
        (useMenuModal as jest.Mock).mockReturnValue({ openMenu: mockOpenMenu });
    });

    const renderComponent = () => render(<MainHeader showBackButton showMenu onBackPress={mockBackPress} />);

    afterEach(() => {
        jest.clearAllMocks(); // Limpia los mocks después de cada prueba
    });

    it('should have a title', () => {
        renderComponent();
    
        expect(screen.getByRole('text', { name: 'ABCall'})).toBeTruthy();
    });

    it('should have a menu button', () => {
        renderComponent();
    
        expect(screen.getByTestId('MainHeader.Button')).toBeTruthy();
    });

    it('should call openMenu method from the MenuModalContext', async () => {
        const user = userEvent.setup();
        renderComponent();
    
        await user.press(screen.getByTestId('MainHeader.Button'));
        expect(mockOpenMenu).toHaveBeenCalled();
    });

    it('should have a close button', () => {
        renderComponent();
    
        expect(screen.getByTestId('MainHeader.CloseButton')).toBeTruthy();
    });

    it('should call closeScreen method', async () => {
        const user = userEvent.setup();
        renderComponent();
    
        await user.press(screen.getByTestId('MainHeader.CloseButton'));

        expect(mockBackPress).toHaveBeenCalled();
    });
});