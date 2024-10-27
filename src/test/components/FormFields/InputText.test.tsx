import { render, screen, userEvent } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import {it, describe} from '@jest/globals';
import { InputText } from '../../../components/FormFields/InputText';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';

describe('InputText', () => {
    let user: UserEventInstance;

    beforeEach(() => {
        user = userEvent.setup();
    });

    it('should show a required label', () => {
        render(<InputText label='Text' value='' onInputChange={jest.fn()} required={true} testID='TextInput.Text'/>);
    
        expect(screen.getByRole('text', { name: 'Text*'})).toBeTruthy();
    });

    it('should show a non-required label', () => {
        render(<InputText label='Text' value='' onInputChange={jest.fn()} required={false} testID='TextInput.Text'/>);
    
        expect(screen.getByRole('text', { name: 'Text'})).toBeTruthy();
    });

    it('should load a value defined', () => {
        render(<InputText label='Text' value='Loaded value' onInputChange={jest.fn()} required={false} testID='TextInput.Text'/>);
    
        expect(screen.getByLabelText('Text').props.value).toEqual('Loaded value');
    });

    it('should call the onInputChange when typing on the input text field', async () => {
        const onInputChange = jest.fn();
        render(<InputText label='Text' value='' onInputChange={onInputChange} required={true} testID='TextInput.Text'/>);
    
        await user.type(screen.getByTestId('TextInput.Text'), 'Text');

        expect(onInputChange).toHaveBeenLastCalledWith('t');
    });

    it('should show render a multiline text input', () => {
        render(<InputText label='Text' value='' multiline onInputChange={jest.fn()} required={true} testID='TextInput.Text'/>);
    
        expect(screen.getByRole('text', { name: 'Text*'})).toBeTruthy();
    });
});