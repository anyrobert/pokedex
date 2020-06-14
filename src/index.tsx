import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './routes';
import { PokemonContextProvider } from './context/store';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <PokemonContextProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </PokemonContextProvider>
  );
};

export default App;
