import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform,TouchableOpacity} from 'react-native';


const API_URL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.102.129.222:8080';

export default function HomeScreen({ token }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const handleLoggedIn = (token) => {
      fetch(`${API_URL}/private`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
    handleLoggedIn(token);
  }, [token]);
  

  return (
    <View style={styles.container}>
      {userData ? (
        <Text  style={styles.welcomeText}>Bienvenue {userData.name} </Text>
      ) : (
        <Text>Chargement...</Text>
      )}
       <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Profil</Text>
        <Text style={styles.buttonSubtext}>Nom, Prénom, Numéro de téléphone, Adresse e-mail...</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Paramètres</Text>
        <Text style={styles.buttonSubtext}>Affichage, Sons et notifications, Localisations</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Moyens de paiement</Text>
        <Text style={styles.buttonSubtext}>Vos différents moyens de paiement</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Nous contacter</Text>
        <Text style={styles.buttonSubtext}>Vous avez un problème ? Contactez-nous !</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Conditions et politiques</Text>
        <Text style={styles.buttonSubtext}>Conditions générales d'utilisation, Politique de confidentialité...</Text>
      </TouchableOpacity>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    width: '80%',
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
});
