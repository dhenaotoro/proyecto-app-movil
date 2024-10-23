import { render, screen } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import {it, describe} from '@jest/globals';
import MainHeader from '../../../components/Header/MainHeader';

describe('AuthHeader', () => {
    it('should have a title', () => {
        render(<MainHeader />);
    
        expect(screen.getByRole('text', { name: 'ABCall'})).toBeDefined();
    });
});