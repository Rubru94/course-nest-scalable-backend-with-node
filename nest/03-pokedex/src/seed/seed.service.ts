import { Injectable } from '@nestjs/common';
import { PokeResponse, Result } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto';
import { FetchAdapter } from 'src/common/adapters';

@Injectable()
export class SeedService {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: FetchAdapter,
  ) {}

  async populateDb() {
    const { results } = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=50',
    );
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
