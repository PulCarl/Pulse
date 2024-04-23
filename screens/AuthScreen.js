import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// URL de l'API
const API_URL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.102.129.222:8080';

const AuthScreen = ({ onLoggedIn }) => {
  // Déclaration des états pour les champs du formulaire et les messages d'erreur/succès
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  // Fonction pour réinitialiser les champs du formulaire
  const resetFields = () => {
    setEmail('');
    setName('');
    setPassword('');
    setConfirmPassword('');
    setPhoneNumber('');
  };

  // Fonction pour changer entre l'écran de connexion et d'inscription
  const onChangeHandler = () => {
    setIsLogin(!isLogin);
    setMessage('');
    resetFields();
  };

  // Fonction appelée lors de la connexion réussie
  const handleLoggedIn = (token) => {
    fetch(`${API_URL}/private`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Unable to fetch user data');
        }
      })
      .then((userData) => {
        // Appel à onLoggedIn avec le token et les données de l'utilisateur
        onLoggedIn(jsonRes.token, jsonRes.userData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Fonction appelée lors de la soumission du formulaire
  const onSubmitHandler = () => {
    if (!isLogin && password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match");
      return;
    }

    const payload = {
      email,
      name,
      password,
      phoneNumber,
    };

    fetch(`${API_URL}/${isLogin ? 'login' : 'signup'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        try {
          const jsonRes = await res.json();
          if (res.status !== 200) {
            setIsError(true);
            setMessage(jsonRes.message);
          } else {
            // Appel à onLoggedIn avec le token et les données de l'utilisateur
            onLoggedIn(jsonRes.token, jsonRes.userData);
            setMessage(jsonRes.message);
            // Réinitialiser les valeurs des champs
            setEmail('');
            setName('');
            setPassword('');
            setConfirmPassword('');
            setPhoneNumber('');
          }
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Fonction pour obtenir le message à afficher
  const getMessage = () => {
    const status = isError ? `Error: ` : `Success: `;
    return status + message;
  };

  // Rendu de l'écran d'authentification
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={require('../images/scoot.png')} style={styles.image} />
        <Text style={styles.title}>Bienvenue sur Pulse</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.inputs}>
          <Text style={styles.subtitle}>Informations du compte</Text>
          <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={setEmail} value={email} />
          {!isLogin && <TextInput style={styles.input} placeholder="Name" onChangeText={setName} />}
          {/* {!isLogin && <TextInput style={styles.input} placeholder="Phone Number" onChangeText={setPhoneNumber} />} */}
          <TextInput secureTextEntry={true} style={styles.input} placeholder="Password" onChangeText={setPassword} value={password} />
          {!isLogin && <TextInput secureTextEntry={true} style={styles.input} placeholder="Confirm Password" onChangeText={setConfirmPassword} />}
          <Text style={[styles.message, { color: isError ? 'red' : 'green' }]}>{message ? getMessage() : null}</Text>
          <TouchableOpacity style={styles.button} onPress={onSubmitHandler}>
            <Text style={styles.buttonText}>{isLogin ? "Se connecter" : "S'inscrire"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonAlt} onPress={onChangeHandler}>
            <LinearGradient colors={['#FFD003', '#FB5C00']} style={styles.buttonAlt}>
              <Text style={styles.buttonAltText}>
                {isLogin ? "S'inscrire" : "Se connecter"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Styles pour les composants de l'écran d'authentification
const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginTop: '-35%',
  },
  image: {
    width: '40%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -10,
  },
  subtitle: {
    marginTop: 20,
    fontSize: 10,
    marginRight: '40%',
  },
  card: {
    flex: 1,
    width: '80%',
    maxHeight: 380,
    paddingBottom: '30%',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: '10%',
    marginBottom: '30%',
    color: 'black',
  },
  form: {
    justifyContent: 'space-between',
    paddingBottom: '5%',
  },
  inputs: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    paddingTop: 10,
    fontSize: 16,
    minHeight: 40,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    width: '80%',
    backgroundColor: 'white',
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonAlt: {
    width: '90%',
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonAltText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    marginVertical: '5%',
  },
});

export default AuthScreen;
