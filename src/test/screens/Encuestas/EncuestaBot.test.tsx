import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EncuestaBot } from '../../../screens/Encuestas/EncuestaBot';
import userEvent, { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';

// Mock navigation
const Stack = createNativeStackNavigator();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

const renderComponent = (initialParams = { 
  userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', 
  nombreEncuesta: 'Encuesta satisfacción' 
}) => {
  return render(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="EncuestaBot">
        <Stack.Screen name="EncuestaBot" component={EncuestaBot} initialParams={initialParams} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe('EncuestaBot', () => {
  test('should render EncuestaBot with static content', () => {
    renderComponent();

    // Verify the static text content
    const title = screen.getByText('Evalúanos');
    expect(title).toBeTruthy();

    const prompt = screen.getByText(
      'Entre 1 y 5, cuál es tu nivel de percepción de la atención donde 1 es mala y 5 es excelente'
    );
    expect(prompt).toBeTruthy();
  });

  test('should render rating buttons on the first step', () => {
    renderComponent();

    // Check rating buttons from 1 to 5
    for (let i = 1; i <= 5; i++) {
      const button = screen.getByText(i.toString());
      expect(button).toBeTruthy();
    }
  });

  test('should proceed to the next step after selecting a rating', async () => {
    renderComponent();

    // Select a rating
    const ratingButton = screen.getByText('3');
    fireEvent.press(ratingButton);

    // Verify the next question appears
    const nextStep = screen.getByText('¿Recomendarías el servicio prestado por tu empresa de confianza?');
    expect(nextStep).toBeTruthy();
  });
  
});
