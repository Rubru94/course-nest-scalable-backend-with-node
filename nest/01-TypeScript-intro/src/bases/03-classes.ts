import axios from "axios";
import {
  Move,
  PokeapiResponse,
} from "../interfaces/pokeapi-response.interface";

export class Pokemon {
  public readonly id: number;
  public name: string;

  /* constructor() {
    this.id = 0;
    this.name = "";
  } */

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  /* constructor({ id, name }: Partial<Pokemon>) {
    this.id = id ?? 0;
    this.name = name ?? "noname";
  } */

  get imageUrl(): string {
    return `http://pokemon.com/${this.id}.jpg`;
  }

  scream(): void {
    console.log(`${this.name.toUpperCase()}!!!`);
  }

  private speak(): void {
    console.log(`${this.name}, ${this.name}`);
  }

  async getMoves(): Promise<Move[]> {
    const { data } = await axios.get<PokeapiResponse>(
      "https://pokeapi.co/api/v2/pokemon/4"
    );

    return data.moves;
  }
}

export class PokemonClassDefinitionShortWay {
  constructor(public readonly id: number, public name: string) {}
}

export const charmander = new Pokemon(20, "Charmander");

// charmander.id = 0 // --> forbidden, its read-only

console.log(charmander.imageUrl);
console.log(charmander.scream());
// console.log(charmander.speak()); // --> forbidden, its private

console.log(charmander.getMoves());
