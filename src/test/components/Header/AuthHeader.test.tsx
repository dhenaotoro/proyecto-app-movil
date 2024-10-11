import { render, screen } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import {it, describe} from '@jest/globals';
import AuthHeader from '../../../components/Header/AuthHeader';

describe('AuthHeader', () => {
    it('should have a title', () => {
        render(<AuthHeader />);
    
        expect(screen.getByRole('text', { name: 'ABCall'})).toBeDefined();
    });
});