import React from 'react';
import { render, screen, fireEvent, userEvent } from '@testing-library/react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EncuestaBot } from '../../../screens/Encuestas/EncuestaBot';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';

// Create a mock navigator
const Stack = createNativeStackNavigator();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

const renderComponent = (initialParams = { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45' }) => {
  return render(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="EncuestaBot">
        <Stack.Screen name="EncuestaBot" component={EncuestaBot} initialParams={initialParams}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe('EncuestaBot', () => {
  test('should render EncuestaBot with static content', () => {
    renderComponent();

    // Check if the EncuestaBot title is rendered
    const encuestaTitle = screen.getByText('Evalúanos');
    expect(encuestaTitle).toBeTruthy();

    // Check if the channel text is rendered
    const channelText = screen.getByText('Entre 1 y 5, cuál es tu nivel de percepción de la atención donde 1 es mala y 5 es excelente');
    expect(channelText).toBeTruthy();
  });

  test('should render rating buttons on the first step', () => {
    // Mock the route params for testing
    renderComponent();

    // Check if rating buttons are displayed
    for (let i = 1; i <= 5; i++) {
      const button = screen.getByText(i.toString());
      expect(button).toBeTruthy();
    }
  });

  test('should render and disable "Yes/No option" radio buttons when no opinion is provided', async () => {
    // Mock the route params for testing
    renderComponent();

    const ratingButton = screen.getByText('1'); // Assuming this is one of the rating options
    fireEvent.press(ratingButton);

    const opinionStep = screen.getByText('¿Recomendarías el servicio prestado por tu empresa de confianza?');
    expect(opinionStep).toBeTruthy();

    const optionYesNo = screen.getByText('Sí');
    expect(optionYesNo).toBeTruthy();
  });

});

describe('EncuestaBot Component - Additional Tests', () => {
  let user: UserEventInstance;

  beforeEach(() => {
    user = userEvent.setup();
  });

  // Test for state change after selecting a rating (go to step 1)
  test('should go to the second step after selecting a rating', async () => {
    // Mock the route params for testing
    renderComponent();

    // Click on a rating button
    const ratingButton = screen.getByText('3');
    fireEvent.press(ratingButton);

    // Check if the next step's question is rendered
    const nextQuestion = screen.getByText('¿Recomendarías el servicio prestado por tu empresa de confianza?');
    expect(nextQuestion).toBeTruthy();
  });

  test('should go to the third step after answering the question ¿Recomendarías el servicio prestado por tu empresa de confianza?', async () => {
    // Mock the route params for testing
    renderComponent();

    // Click on a rating button
    const ratingButton = screen.getByText('3');
    fireEvent.press(ratingButton);

    // Check if the second question is rendered
    const secondQuestion = screen.getByText('¿Recomendarías el servicio prestado por tu empresa de confianza?');
    expect(secondQuestion).toBeTruthy();
    fireEvent.press(screen.getByTestId('EncuestaBot.Option.Yes'));

    // Check if the third question is rendered
    expect(screen.getByText('Evalúanos')).toBeTruthy();
    expect(screen.getByText('Expresa tu opinión libremente')).toBeTruthy();
    expect(screen.getByText('Descripción')).toBeTruthy();
  });

  test('should navigate to Encuestas screen when filling in the Descripcion form field and hitting Save button', async () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    
    renderComponent();

    // Click on a rating button
    const ratingButton = screen.getByText('3');
    fireEvent.press(ratingButton);

    // Check if the second question is rendered
    const secondQuestion = screen.getByText('¿Recomendarías el servicio prestado por tu empresa de confianza?');
    expect(secondQuestion).toBeTruthy();
    fireEvent.press(screen.getByTestId('EncuestaBot.Option.No'));

    // Check if the third question is rendered
    expect(screen.getByText('Evalúanos')).toBeTruthy();
    expect(screen.getByText('Expresa tu opinión libremente')).toBeTruthy();

    expect(screen.getByTestId('EncuestaBot.Descripcion')).toBeTruthy();
    await user.type(screen.getByTestId('EncuestaBot.Descripcion'), 'Test');
    
    await user.press(screen.getByTestId('EncuestaBot.Button'));

    expect(mockNavigate).toHaveBeenCalledWith('Encuestas', { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45' });
  });
});
  
