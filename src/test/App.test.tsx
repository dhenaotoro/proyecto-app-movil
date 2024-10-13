import { render } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import {it} from '@jest/globals';
import App from '../../App';

jest.mock('../services/api');
it('renders correctly', () => {
  render(<App />);
});
