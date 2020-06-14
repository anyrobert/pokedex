import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Platform,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  TextInput,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { HomeScreenNavigationProp } from '../../routes';
import { PokemonContext } from '../../context/store';
import Loading from '../../components/Loading';

type Props = {
  navigation: HomeScreenNavigationProp;
};

const Home = ({ navigation }: Props) => {
  const { pokemons, isLoading } = useContext(PokemonContext);
  const [search, setSearch] = useState('');
  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <View style={{ height: getStatusBarHeight() }} />
      ) : (
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      )}
      <TextInput
        placeholder="Pesquise algum Pokemon"
        value={search}
        onChangeText={setSearch}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={
            search
              ? pokemons.filter(
                  (pokemon) =>
                    !!pokemon.name
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase()),
                )
              : pokemons
          }
          numColumns={2}
          renderItem={({ item }) => {
            const { name, image, color } = item;
            return (
              <View style={{ flex: 0.5 }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('Pokemon', item);
                  }}
                  style={{ ...styles.pokemonBlock, backgroundColor: color }}>
                  <View>
                    <Text style={styles.pokemonName}>{name}</Text>
                  </View>

                  <Image source={{ uri: image }} style={styles.pokemonImage} />
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={({ name }) => name}
        />
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pokemonBlock: {
    flex: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  pokemonName: {
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: 16,
    marginTop: 10,
  },
  pokemonImage: {
    width: 80,
    height: 80,
  },
});
