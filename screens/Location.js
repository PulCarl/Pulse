import { StyleSheet, Button, Text, View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Location() {
  return (
    <View style={styles.container}>
      <Image source={require('../images/tache.png')} style={styles.image} />
      <Text style={styles.title}>Vous n’avez aucune location prévue pour le moment.</Text>
      <TouchableOpacity style={styles.gradient} >
        <LinearGradient colors={['#FFD003', '#FB5C00']} style={styles.button}>
          <Text style={styles.buttonText}>Trouver un scooter</Text>
        </LinearGradient>
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
  image: {
    marginBottom: 20,
  },
  title: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gradient: {
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 50,
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
