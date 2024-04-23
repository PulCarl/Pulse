import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


import Colors from '../../constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
  
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FB5C00', // Utilisation de la couleur "#FB5C00" pour l'icône et le texte du nom des onglets actifs
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Location',
          tabBarIcon: ({ color }) => <FontAwesome5 name="key" size={24} color="#FFCF03" />,
          tabBarLabelStyle: {
            color: '#FFCF03', // Couleur personnalisée pour le texte du nom
          },
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Recherche',
          tabBarIcon: ({ color }) => <FontAwesome name="search" size={24} color="#FFCF03" />,
          headerShown: false, // Enlève la barre en haut de l'écran
          tabBarLabelStyle: {
            color: '#FFCF03', // Couleur personnalisée pour le texte du nom
          },
  }}
/>
      <Tabs.Screen
        name="three"
        options={{
          title: 'Compte ',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={24} color="#FFCF03" />,
          headerShown: false, // Enlève la barre en haut de l'écran
          tabBarLabelStyle: {
            color: '#FFCF03', // Couleur personnalisée pour le texte du nom
          },
        }}
      />
    </Tabs>
    
  );
}
