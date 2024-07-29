import {
  Move,
  PokeapiResponse,
} from "../interfaces/pokeapi-response.interface";
import {
  PokeApiAxiosAdapter,
  PokeApiFetchAdapter,
  PokeApiHttpAdapter,
} from "../api/pokeApi.adapter";

export class Pokemon {
  get imageUrl(): string {
    return `https://pokemon.com/${this.id}.jpg`;
  }

  constructor(
    public readonly id: number,
    public name: string,
    private readonly http: PokeApiHttpAdapter
  ) {}

  scream() {
    console.log(`${this.name.toUpperCase()}!!!`);
  }

  speak() {
    console.log(`${this.name}, ${this.name}`);
  }

  async getMoves(): Promise<Move[]> {
    const data = await this.http.get<PokeapiResponse>(
      "https://pokeapi.co/api/v2/pokemon/4"
    );
    console.log(data.moves);

    return data.moves;
  }
}

const pokeApiAxios = new PokeApiAxiosAdapter();
const pokeApiFetch = new PokeApiFetchAdapter();

export const charmander = new Pokemon(4, "Charmander", pokeApiAxios);
export const pikachu = new Pokemon(10, "Pikachu", pokeApiFetch);

charmander.getMoves();
