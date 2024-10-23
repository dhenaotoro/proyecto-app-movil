import React from 'react';
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


export const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const mockValue = {
        isAuthenticated: true,
        signIn: mockSignIn,
        signUp: mockSignUp,
        signOut: mockSignOut,
        fetchUserAttributes: mockFetchUserAttributes,
        confirmSignUp: mockConfirmSignUp
    };

    return <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>;
};