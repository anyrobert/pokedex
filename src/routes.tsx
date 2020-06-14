import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  createStackNavigator,
  TransitionSpecs,
  HeaderStyleInterpolators,
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Pokemon as PokemonType } from './services/pokeApi';

export type RootStackParamList = {
  Home: undefined;
  Pokemon: PokemonType;
};

export type PokemonScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Pokemon'
>;
export type PokemonScreenRouteProp = RouteProp<RootStackParamList, 'Pokemon'>;

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

//Screens
import Home from './screens/Home';
import Pokemon from './screens/Pokemon';

const MainStack = createStackNavigator<RootStackParamList>();

const transition: StackNavigationOptions = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0.1],
            }),
          },
          {
            scale: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1],
                })
              : 1,
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.7],
        }),
      },
    };
  },
};

export default function Routes() {
  return (
    <View style={styles.container}>
      <MainStack.Navigator>
        <MainStack.Screen
          name="Home"
          options={{ headerShown: false, headerBackTitleVisible: false }}
          component={Home}
        />
        <MainStack.Screen
          name="Pokemon"
          component={Pokemon}
          options={({ route }) => {
            return {
              title: route.params.name,
              headerShown: false,
              // headerStyle: {
              //   backgroundColor: route.params.color,
              // },
              // headerBackTitleVisible: false,
              // headerTintColor: '#fff',
              ...transition,
            };
          }}
        />
      </MainStack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
