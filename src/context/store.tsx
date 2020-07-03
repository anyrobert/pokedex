import React, { useEffect } from 'react';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { fetchKantoPokemon, Pokemon } from '../services/pokeApi';
import AsyncStorage from '@react-native-community/async-storage';

type Props = {
  children: React.ReactNode;
};

type Context = {
  pokemons: Array<Pokemon>;
  isLoading: boolean;
  setPokemons?: Dispatch<SetStateAction<Context>>;
};

const initialState: Context = {
  pokemons: [],
  isLoading: true,
  setPokemons: (): void => {
    throw new Error('setPokemons function must be overridden');
  },
};

const PokemonContext = createContext<Context>(initialState);

const PokemonContextProvider = ({ children }: Props): JSX.Element => {
  const [pokemonsContextState, setPokemons] = useState<Context>(initialState);

  useEffect(() => {
    AsyncStorage.getItem('pokedex@pokemons').then((storedPokemons) => {
      // value previously stored
      if (storedPokemons && pokemonsContextState.pokemons.length < 1) {
        setPokemons({ pokemons: JSON.parse(storedPokemons), isLoading: false });
      }
      if (!storedPokemons && pokemonsContextState.pokemons.length < 1) {
        fetchKantoPokemon().then((response) => {
          const { pokemons } = response;
          setPokemons({ pokemons, isLoading: false });
          AsyncStorage.setItem('pokedex@pokemons', JSON.stringify(pokemons));
        });
      }
    });
  }, [pokemonsContextState.pokemons]);
  return (
    <PokemonContext.Provider
      value={{
        ...pokemonsContextState,
        setPokemons,
      }}>
      {children}
    </PokemonContext.Provider>
  );
};

export { PokemonContext, PokemonContextProvider };
