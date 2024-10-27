import React, { useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

export const mockSignIn = jest.fn().mockReturnValue({
    isSignedIn: true,
    nextStep: 'COMPLETED'
});
export const mockFetchUserAttributes = jest.fn().mockReturnValue({
    sub: 'ffff-ffff-ffff',
    given_name: 'User'
});
export const mockSignOut = jest.fn();
export const mockSignUp = jest.fn();
export const mockConfirmSignUp = jest.fn();


export const MockAuthProvider = ({ children, isAuthenticated = true }: { children: React.ReactNode, isAuthenticated?: boolean}) => {
    const [authState, setAuthState] = useState(isAuthenticated);
    
    const mockValue = {
        isAuthenticated: authState,
        signIn: mockSignIn,
        signUp: mockSignUp,
        signOut: mockSignOut,
        fetchUserAttributes: mockFetchUserAttributes,
        confirmSignUp: mockConfirmSignUp
    };

    return <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>;
};