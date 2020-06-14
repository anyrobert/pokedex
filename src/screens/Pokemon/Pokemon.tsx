import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Icon from 'react-native-vector-icons/FontAwesome';

import {
  PanGestureHandler,
  State,
  PanGestureHandlerStateChangeEvent,
  TouchableOpacity,
} from 'react-native-gesture-handler';

import {
  PokemonScreenNavigationProp,
  PokemonScreenRouteProp,
} from '../../routes';

type Props = {
  navigation: PokemonScreenNavigationProp;
  route: PokemonScreenRouteProp;
};

const IMAGE_HEIGHT = 250;
const HEADER_MAX_HEIGHT = 80;

const Pokemom = ({ route, navigation }: Props) => {
  const {
    params: { name, color, image },
  } = route;
  let offset = 0;
  const translateY = new Animated.Value(0);
  const animatedEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationY: translateY,
        },
      },
    ],
    {
      useNativeDriver: true,
    },
  );
  function onHandlerStateChange(event: PanGestureHandlerStateChangeEvent) {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let opened = false;
      const { translationY } = event.nativeEvent;
      offset += translationY;
      if (translationY <= -50) {
        opened = true;
      } else {
        translateY.setValue(offset);
        translateY.setOffset(0);
        offset = 0;
      }

      Animated.timing(translateY, {
        toValue: opened ? -IMAGE_HEIGHT : 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        offset = opened ? -IMAGE_HEIGHT : 0;
        translateY.setOffset(offset);
        translateY.setValue(0);
      });
    }
  }

  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: color }}>
      <StatusBar backgroundColor={color} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Icon name="chevron-left" size={18} color="#fff" />
        </TouchableOpacity>
        <Animated.Text
          style={[
            styles.pokemonName,
            {
              opacity: translateY.interpolate({
                inputRange: [-150, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              }),
            },
          ]}>
          {name}
        </Animated.Text>
        <TouchableOpacity onPress={() => {}}>
          <Icon name="heart-o" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      <Animated.Image
        source={{ uri: image }}
        style={[
          styles.pokemonImage,
          {
            opacity: translateY.interpolate({
              inputRange: [-150, 0],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
            transform: [
              {
                scale: translateY.interpolate({
                  inputRange: [-IMAGE_HEIGHT, 0],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
              },
              {
                translateY: translateY.interpolate({
                  inputRange: [-IMAGE_HEIGHT, 0],
                  outputRange: [-IMAGE_HEIGHT, -25],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      />
      <PanGestureHandler
        onHandlerStateChange={onHandlerStateChange}
        onGestureEvent={animatedEvent}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                {
                  translateY: translateY.interpolate({
                    inputRange: [-IMAGE_HEIGHT + HEADER_MAX_HEIGHT, 0],
                    outputRange: [getStatusBarHeight() - 260, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        />
      </PanGestureHandler>
    </SafeAreaView>
  );
};

export default Pokemom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  pokemonName: {
    color: '#fff',
    fontSize: 18,
  },
  pokemonImage: {
    width: IMAGE_HEIGHT,
    height: IMAGE_HEIGHT,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: HEADER_MAX_HEIGHT + IMAGE_HEIGHT,
  },
  header: {
    height: HEADER_MAX_HEIGHT,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
});
