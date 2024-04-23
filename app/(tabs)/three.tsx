import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import AuthScreen from '../../screens/AuthScreen';
import HomeScreen from '../../screens/HomeScreen';

export default function TabThreeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState(null);

  const handleLogin = (userToken: React.SetStateAction<string>, userData: any) => {
    setToken(userToken);
    setUserData(userData);
    setIsLoggedIn(true);
  };

  console.log('Is Logged In:', isLoggedIn); // Afficher l'état de connexion

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <HomeScreen token={token} userData={userData} />
      ) : (
        <AuthScreen onLoggedIn={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
