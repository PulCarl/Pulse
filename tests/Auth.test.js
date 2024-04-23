import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AuthScreen from '../screens/AuthScreen.js';
import fetch from 'jest-fetch-mock';

beforeEach(() => {
  fetch.resetMocks();
  fetch.mockResponse(JSON.stringify({ token: 'mockedToken', userData: 'mockedData' }));
});

test('login with valid credentials', async () => {
    const onLoggedIn = jest.fn();
    const { getByPlaceholderText, getByText } = render(<AuthScreen onLoggedIn={onLoggedIn} />);
    
    // Simuler la saisie de l'email et du mot de passe
    fireEvent.changeText(getByPlaceholderText('Email'), 'carl@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'carl');
    
    // Simuler le clic sur le bouton de connexion
    fireEvent.press(getByText("Se connecter"));
  
    // Attendre que le test soit terminé
    await waitFor(() => {
      // Vérifier que la fonction onLoggedIn a été appelée une fois
      expect(onLoggedIn).toHaveBeenCalledTimes(1);
      // Extraire les arguments passés à onLoggedIn
      const [[token, userData]] = onLoggedIn.mock.calls;
      // Vérifier que le token est défini
      expect(token).toBeDefined();
      // Vérifier que userData contient une propriété name égale à "Carl"
      expect(userData).toEqual(expect.objectContaining({ name: "Carl" }));
      // Afficher un message de confirmation de connexion dans la console
      console.log("Carl est connecté"); // Message de confirmation de connexion
    });
});
