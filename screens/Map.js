import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, TextInput, FlatList, Modal } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';

export default function Map() {
  // State variables
  const [selectedScooter, setSelectedScooter] = useState(null); // Scooter sélectionné
  const [markerCoordinates, setMarkerCoordinates] = useState([]); // Coordonnées des marqueurs affichés
  const [searchValue, setSearchValue] = useState(''); // Valeur de recherche
  const [filteredMarkers, setFilteredMarkers] = useState([]); // Marqueurs filtrés selon la recherche
  const mapRef = useRef(null); // Référence à l'objet MapView
  const [showPopup, setShowPopup] = useState(false); // Affichage du popup d'informations sur le scooter
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false); // Filtre pour afficher uniquement les scooters disponibles
  const [showOnlyBatteryAbove30, setShowOnlyBatteryAbove30] = useState(false); // Filtre pour afficher uniquement les scooters avec une batterie supérieure à 30%

  // Fonction appelée lors du changement de région de la carte
  const onRegionChange = (region) => {
    // Ajuster la carte pour afficher tous les marqueurs
    if (markerCoordinates.length > 0) {
      mapRef.current.fitToCoordinates(markerCoordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: false,
      });
    }
  };

  // Données des marqueurs et scooters
  const scooterMarkers = [
    {
      id: 1,
      name: 'Borne A',
      coordinate: { latitude: 43.1722395, longitude: 5.5927003 },
      scooterData: [
        { id: 1, marque: 'Scooter A', modèle: 'Modèle 1', disponibilité: 'disponible', batterie: 80 },
        { id: 2, marque: 'Scooter D', modèle: 'Modèle 4', disponibilité: 'non disponible', batterie: 60 },
        { id: 5, marque: 'Scooter G', modèle: 'Modèle 7', disponibilité: 'disponible', batterie: 25 },
      ],
    },
    {
      id: 2,
      name: 'Borne B',
      coordinate: { latitude: 43.1861027, longitude: 5.6061669 },
      scooterData: [{ id: 3, marque: 'Scooter B', modèle: 'Modèle 2', disponibilité: 'non disponible', batterie: 50 }],
    },
    {
      id: 3,
      name: 'Borne C',
      coordinate: { latitude:43.1818754, longitude: 5.6044755 },
      scooterData: [{ id: 4, marque: 'Scooter C', modèle: 'Modèle 3', disponibilité: 'disponible', batterie: 75 }],
    },
  ];

  // Gestion de la sélection d'un scooter
  const handleScooterSelect = (marker) => {
    // Filtrer les scooters selon les critères de recherche
    const filteredScooterData = marker.scooterData.filter(filterScooters);

    setSelectedScooter(filteredScooterData); // Définir le scooter sélectionné
    setMarkerCoordinates([marker.coordinate]); // Définir les coordonnées du marqueur à afficher
    setSearchValue(marker.name); // Définir la valeur de recherche
    setShowPopup(true); // Afficher le popup d'informations sur le scooter
  };

  // Gestion de la recherche
  const handleSearch = () => {
    // Filtrer les marqueurs selon les critères de recherche
    const filtered = scooterMarkers.filter((marker) => {
      const filteredScooterData = marker.scooterData.filter(filterScooters);
      return (
        marker.name.toLowerCase().includes(searchValue.toLowerCase()) &&
        filteredScooterData.length > 0
      );
    });

    setFilteredMarkers(filtered); // Définir les marqueurs filtrés

    if (filtered.length > 0) {
      const coordinates = filtered.map((marker) => marker.coordinate);
      setMarkerCoordinates(coordinates); // Définir les coordonnées des marqueurs à afficher
      setSelectedScooter(filtered[0].scooterData); // Définir le premier scooter sélectionné
      setShowPopup(true); // Afficher le popup d'informations sur le scooter
    } else {
      setMarkerCoordinates([]); // Aucun marqueur à afficher
      setSelectedScooter(null); // Aucun scooter sélectionné
      setShowPopup(false); // Cacher le popup d'informations sur le scooter
    }
  };

  // Fonction de filtrage des scooters
  const filterScooters = (item) => {
    if (!showOnlyAvailable && !showOnlyBatteryAbove30) {
      return true;
    }

    if (showOnlyAvailable && item.disponibilité !== 'disponible') {
      return false;
    }

    if (showOnlyBatteryAbove30 && item.batterie <= 30) {
      return false;
    }

    return true;
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onMapReady={onRegionChange}
        initialRegion={{
          latitude: 43.2009588,
          latitudeDelta: 12,
          longitude: 5.5786472,
          longitudeDelta: 12,
        }}
      >
        {/* Affichage des marqueurs filtrés */}
        {filteredMarkers.length > 0 ? (
          filteredMarkers.map((marker) => (
            // Vérifier si le marqueur a des scooters correspondants
            marker.scooterData.some((item) => item.id === selectedScooter[0].id) && (
              <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                onPress={() => handleScooterSelect(marker)}
              >
                <Callout>
                  <TouchableOpacity onPress={() => handleScooterSelect(marker)}>
                    <Text>{marker.name}</Text>
                  </TouchableOpacity>
                </Callout>
              </Marker>
            )
          ))
        ) : (
          scooterMarkers.map((marker) => {
            const filteredScooterData = marker.scooterData.filter(filterScooters);
            // Vérifier si le marqueur a des scooters correspondants
            if (filteredScooterData.length > 0) {
              return (
                <Marker
                  key={marker.id}
                  coordinate={marker.coordinate}
                  onPress={() => handleScooterSelect(marker)}
                />
              );
            }
            return null; // Si aucun scooter ne correspond aux fil.

          })
        )}
      </MapView>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une borne"
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch()}>
          <Text style={styles.searchButtonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, showOnlyAvailable ? styles.activeFilterButton : null]}
          onPress={() => setShowOnlyAvailable(!showOnlyAvailable)}
        >
          <LinearGradient
            colors={['#FFD003', '#FB5C00']}
            style={[styles.gradient, showOnlyAvailable ? styles.activeGradient : null]}
          >
            <Text
              style={[
                styles.filterButtonText,
                showOnlyAvailable ? styles.activeFilterButtonText : null,
              ]}
            >
              {showOnlyAvailable ? 'Disponibles' : 'Disponibles'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, showOnlyBatteryAbove30 ? styles.activeFilterButton : null]}
          onPress={() => setShowOnlyBatteryAbove30(!showOnlyBatteryAbove30)}
        >
          <LinearGradient
            colors={['#FFD003', '#FB5C00']}
            style={[styles.gradient, showOnlyBatteryAbove30 ? styles.activeGradient : null]}
          >
            <Text
              style={[
                styles.filterButtonText,
                showOnlyBatteryAbove30 ? styles.activeFilterButtonText : null,
              ]}
            >
              Batterie {'>'} 30%
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {showPopup && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPopup}
          onRequestClose={() => setShowPopup(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowPopup(false)}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
              <Text style={styles.popupTitle}>{selectedScooter && selectedScooter[0].marque}</Text>
              <Text>Modèle: {selectedScooter && selectedScooter[0].modèle}</Text>
              <Text>Disponibilité: {selectedScooter && selectedScooter[0].disponibilité}</Text>
              <Text>Batterie: {selectedScooter && selectedScooter[0].batterie}%</Text>
              {selectedScooter && selectedScooter.length > 1 && (
                <View style={styles.otherScooterContainer}>
                  <Text style={styles.otherScooterTitle}>Autres scooters:</Text>
                  <FlatList
                    data={selectedScooter.slice(1)}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.otherScooterItem}>
                        <Text>{item.marque}</Text>
                        <Text>Modèle: {item.modèle}</Text>
                        <Text>Disponibilité: {item.disponibilité}</Text>
                        <Text>Batterie: {item.batterie}%</Text>
                      </View>
                    )}
                  />
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  searchContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginRight: 10,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 12,
    paddingLeft: 10,
  },
  searchButton: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
  searchButtonText: {
    color: '#fff',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    elevation: 4,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeButtonText: {
    color: 'blue',
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  otherScooterContainer: {
    marginTop: 20,
  },
  otherScooterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  otherScooterItem: {
    marginBottom: 10,
  },
  filterContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  filterButton: {
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  activeFilterButton: {
    backgroundColor: '#FFD003',
  },
  gradient: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  filterButtonText: {
    color: '#fff',
  },
  activeFilterButtonText: {
    color: '#000',
  },
});
