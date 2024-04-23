import { StyleSheet, Button } from 'react-native';
import { Text, View } from '../../components/Themed';
import Location from '../../screens/Location';



export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Location/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
