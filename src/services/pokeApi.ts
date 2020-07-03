import axios from 'axios';
import { pokemonColorsByType } from '../helpers';
const baseUrlPokeApi = 'https://pokeapi.co/api/v2/';

const baseUrlPokeImage =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

const pokeImageUrl = (id: number) => `${baseUrlPokeImage}${id}.png`;

export type PokemonsResponse = {
  results: Array<Pokemon>;
  count: number;
  next: string;
};

export type Pokemon = {
  name: string;
  id: number;
  url: string;
  image: string;
  type: PokemonTypeName;
  color: string;
};

export type PokemonTypeName =
  | 'normal'
  | 'fire'
  | 'fighting'
  | 'water'
  | 'flying'
  | 'grass'
  | 'poison'
  | 'electric'
  | 'ground'
  | 'psychic'
  | 'rock'
  | 'ice'
  | 'bug'
  | 'dragon'
  | 'ghost'
  | 'dark'
  | 'steel'
  | 'fairy';

type DefaultNameAndUrl = {
  name: string;
  url: string;
};

type PokemonMove = {
  move: DefaultNameAndUrl;
};

type PokemonType = {
  slot: number;
  type: { name: PokemonTypeName; url: string };
};

type PokemonAbility = {
  ability: DefaultNameAndUrl;
  is_hidden: boolean;
  slot: number;
};

type PokemonResponse = {
  abilities: PokemonAbility[];
  base_experience: number;
  forms: DefaultNameAndUrl;
  id: number;
  moves: PokemonMove[];
  name: string;
  order: number;
  types: PokemonType[];
};

export function fetchKantoPokemon(limit: number = 151) {
  return axios
    .get<PokemonsResponse>(`${baseUrlPokeApi}pokemon?limit=${limit}`)
    .then(async ({ data: { results, next } }) => {
      const pokemons: Array<Pokemon> = [];
      await asyncForEach(results, async (pokemon: Pokemon) => {
        const name =
          pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

        const { data } = await axios.get<PokemonResponse>(pokemon.url);
        const { id, types } = data;
        const firstType = types.find((type) => type.slot === 1);
        if (firstType) {
          const color = pokemonColorsByType[firstType?.type.name];
          const image = pokeImageUrl(id);

          pokemons.push({
            ...pokemon,
            name,
            id,
            type: firstType?.type.name,
            image,
            color,
          });
        }
      });

      return { pokemons, next };
    });
}

async function asyncForEach(array: Array<any>, callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
