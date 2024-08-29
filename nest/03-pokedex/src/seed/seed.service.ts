import { Injectable } from '@nestjs/common';
import { PokeResponse, Result } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto';

@Injectable()
export class SeedService {
  constructor(private readonly pokemonService: PokemonService) {}

  async populateDb() {
    const response = await fetch(
      // fetch requires node version > 18
      'https://pokeapi.co/api/v2/pokemon?limit=50',
      { method: 'GET' },
    );
    const { results }: PokeResponse = await response.json();
    const pokemons = results.map(({ name, url }: Result) => {
      const no = +url
        .split('/')
        .filter((elem) => elem !== '')
        .pop();
      return { name, no } as CreatePokemonDto;
    });

    await this.pokemonService.removeAll();
    await this.pokemonService.createBatch(pokemons);

    return 'Seed executed';
  }
}
