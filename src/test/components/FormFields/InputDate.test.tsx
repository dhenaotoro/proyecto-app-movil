import { render, screen, userEvent, fireEvent, waitFor } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import {it, describe} from '@jest/globals';
import { InputDate } from '../../../components/FormFields/InputDate';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';

describe('InputDate', () => {
    let user: UserEventInstance;
    const initialDate = new Date('2025-01-01');

    beforeEach(() => {
        user = userEvent.setup();
    });

    it('should show a required label', () => {
        render(<InputDate label='Date' value={initialDate} onInputChange={jest.fn()} required={true} testID='InputDate.Text'/>);
    
        expect(screen.getByRole('text', { name: 'Date*'})).toBeTruthy();
    });

    it('should show a non-required label', () => {
        render(<InputDate label='Date' value={initialDate} onInputChange={jest.fn()} required={false} testID='InputDate.Text'/>);
    
        expect(screen.getByRole('text', { name: 'Date'})).toBeTruthy();
    });

    it('should load a value defined', () => {
        render(<InputDate label='Date' value={initialDate} onInputChange={jest.fn()} required={false} testID='InputDate.Text'/>);
    
        expect(screen.getByRole('text', { name: initialDate.toISOString().split('T')[0]}));
    });

    it('should call the onInputChange when choosing a date', async () => {
        const onInputChange = jest.fn();
        const { getByTestId } = render(<InputDate label='Text' value={initialDate} onInputChange={onInputChange} required={true} testID='InputDate.Text'/>);
    
        await user.press(screen.getByTestId('InputDate.Text'));

        const newDate = new Date('2025-02-01');
        await waitFor(() => 
            fireEvent(getByTestId('InputDate.Text-Date-Picker'), 'onChange', { nativeEvent: { timestamp: newDate.getTime() }, }) // Simula seleccionar nueva fecha
        );

        expect(onInputChange).toHaveBeenCalled();
    });
});