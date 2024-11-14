import { render, fireEvent, screen } from '@testing-library/react-native';
import { Encuestas } from '../../../screens/Encuestas/Encuestas';
import { EncuestaBot } from '../../../screens/Encuestas/EncuestaBot';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

// Mock Navigation
const Stack = createNativeStackNavigator();

const MockedNavigation = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Encuestas"
          component={Encuestas}
          initialParams={{ userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', userName: 'Ivan Dario' }}
        />
        {/* Add EncuestaBot screen */}
        <Stack.Screen
          name="EncuestaBot"
          component={EncuestaBot}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

describe('Encuestas component', () => {
  it('navigates to EncuestaBot when a survey is pressed', () => {
    const mockNavigate = jest.fn(); // Define mockNavigate for this test
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate }); // Mock useNavigation to return the mock function

    render(
      <MockedNavigation>
        <Stack.Screen
          name="Encuestas"
          component={Encuestas}
          initialParams={{ userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', userName: 'Ivan Dario' }}
        />
      </MockedNavigation>
    );

    // Press on a survey description to navigate to EncuestaBot
    fireEvent.press(screen.getByTestId('Encuestas.EncuestaBot.Encuesta satisfacción'));

    // Verify that the mockNavigate function was called with the correct arguments
    expect(mockNavigate).toHaveBeenCalledWith('EncuestaBot', { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45' });
  });
});
