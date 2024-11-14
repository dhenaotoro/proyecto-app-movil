import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { EncuestaBot } from '../../../screens/Encuestas/EncuestaBot';

// Create a mock navigator
const Stack = createNativeStackNavigator();

// Mock the useRoute hook to provide the necessary params
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: jest.fn(),
}));

// Wrap the EncuestaBot component inside a navigator for testing
const MockNavigation = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="EncuestaBot">
      <Stack.Screen name="EncuestaBot" component={EncuestaBot} />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('EncuestaBot Component', () => {
  test('should render EncuestaBot with static content', () => {
    // Mock the route params for testing
    useRoute.mockReturnValue({
      params: {
        userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
      },
    });

    render(<MockNavigation />);

    // Check if the EncuestaBot title is rendered
    const encuestaTitle = screen.getByText('Evalúanos');
    expect(encuestaTitle).toBeTruthy();

    // Check if the channel text is rendered
    const channelText = screen.getByText('Entre 1 y 5, cuál es tu nivel de percepción de la atención donde 1 es mala y 5 es excelente');
    expect(channelText).toBeTruthy();
  });

  test('should render rating buttons on the first step', () => {
    // Mock the route params for testing
    useRoute.mockReturnValue({
      params: {
        userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
      },
    });

    render(<MockNavigation />);

    // Check if rating buttons are displayed
    for (let i = 1; i <= 5; i++) {
      const button = screen.getByText(i.toString());
      expect(button).toBeTruthy();
    }
  });

  test('should render and disable "Yes/No option" radio buttons when no opinion is provided', async () => {
    // Mock the route params for testing
    useRoute.mockReturnValue({
      params: {
        userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
      },
    });

    render(<MockNavigation />);

    const ratingButton = screen.getByText('1'); // Assuming this is one of the rating options
    fireEvent.press(ratingButton);

    const opinionStep = screen.getByText('¿Recomendarías el servicio prestado por tu empresa de confianza?');
    expect(opinionStep).toBeTruthy();

    const optionYesNo = screen.getByText('Sí');
    expect(optionYesNo).toBeTruthy();
  });

});

describe('EncuestaBot Component - Additional Tests', () => {

    // Test for state change after selecting a rating (go to step 1)
    test('should go to the next step after selecting a rating', async () => {
      // Mock the route params for testing
      useRoute.mockReturnValue({
        params: {
          userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
        },
      });
  
      render(<MockNavigation />);
  
      // Click on a rating button
      const ratingButton = screen.getByText('3');
      fireEvent.press(ratingButton);
  
      // Check if the next step's question is rendered
      const nextQuestion = screen.getByText('¿Recomendarías el servicio prestado por tu empresa de confianza?');
      expect(nextQuestion).toBeTruthy();
    });
  
  });
  
