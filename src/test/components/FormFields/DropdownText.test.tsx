import { render, screen, userEvent } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import {it, describe} from '@jest/globals';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import { DropdownText } from '../../../components/FormFields/DropdownText';

describe('DropdownText', () => {
    let user: UserEventInstance;
    let valuesToShow: {[key: string]: string} = {
        test1: "value1",
        test2: "value2"
    }

    beforeEach(() => {
        user = userEvent.setup();
    });

    it('should show a required label', () => {
        render(<DropdownText label='Text' value='' valuesToShow={valuesToShow} onChange={jest.fn()} required testID='DropdownText.Picker'/>);
    
        expect(screen.getByRole('text', { name: 'Text*'})).toBeDefined();
    });

    it('should show a non-required label', () => {
        render(<DropdownText label='Text' value='' valuesToShow={valuesToShow} onChange={jest.fn()} required={false} testID='DropdownText.Picker'/>);
    
        expect(screen.getByRole('text', { name: 'Text'})).toBeDefined();
    });

    it('should load a value defined', () => {
        render(<DropdownText label='Text' value='value1' valuesToShow={valuesToShow} onChange={jest.fn()} required={false} testID='DropdownText.Picker'/>);
    
        expect(screen.getByTestId('DropdownText.Picker')).toBeTruthy();
    });
});