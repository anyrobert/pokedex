import axios from 'axios';
// import { Platform } from 'react-native';
// import { getColorFromURL } from 'rn-dominant-color';

const baseUrlPokeApi = 'https://pokeapi.co/api/v2/';
const baseUrlPokeImage =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const pokeImageUrl = (id: number) => `${baseUrlPokeImage}${id}.png`;

axios.defaults.headers.Authorization =
  'Token 70a2f9ea1ec4896931a3a17bd2422972dc668cc7';

type XililarDominantColorResponse = {
  records: Array<{
    _url: string;
    _dominant_colors: {
      rgb_hex_colors: Array<string>;
    };
  }>;
};
export type PokemonResponse = {
  results: Array<Pokemon>;
};

export type Pokemon = {
  name: string;
  id: number;
  url: string;
  image: string;
  color: string;
};

export function fetchKantoPokemon(limit: number = 151) {
  return axios
    .get<PokemonResponse>(`${baseUrlPokeApi}pokemon?limit=${limit}`)
    .then(async ({ data: { results } }) => {
      const pokemons: Array<Pokemon> = [];
      await asyncForEach(results, async (pokemon: Pokemon) => {
        const name =
          pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        const id = parseInt(pokemon.url.split('/')[6], 10);
        const image = pokeImageUrl(id);

        pokemons.push({
          ...pokemon,
          name,
          id,
          image,
        });
      });
      const colors = await getPokemonColors([...Array(limit).keys()]);

      return pokemons.map((pokemon, index) => {
        return {
          ...pokemon,
          color: colors[index][1] ? colors[index][1] : '#CC0000',
        };
      });
    });
}

async function getPokemonColors(ids: Array<number>) {
  const urls = ids.map((id) => {
    return {
      _url: `${baseUrlPokeImage}${id + 1}.png`,
    };
  });
  const { data } = await axios.post<XililarDominantColorResponse>(
    'https://api.ximilar.com/dom_colors/product/v2/dominantcolor',
    {
      records: urls,
      color_names: false,
    },
  );
  return data.records.map((c) => c._dominant_colors.rgb_hex_colors);
}

async function asyncForEach(array: Array<any>, callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
