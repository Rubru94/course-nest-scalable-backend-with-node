import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  constructor(/* private readonly pokemonService: PokemonService */) {}

  populateDb() {
    return 'Seed executed';
  }
}
