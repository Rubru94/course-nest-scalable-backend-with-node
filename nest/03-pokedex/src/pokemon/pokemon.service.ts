import { Injectable, NotFoundException } from '@nestjs/common';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorHandler } from 'src/handlers';
import { CreatePokemonDto, UpdatePokemonDto } from './dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  findAll() {
    return this.pokemonModel.find();
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    // by no
    if (!isNaN(+term)) pokemon = await this.pokemonModel.findOne({ no: term });

    // by mongo id
    if (!pokemon && isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term);

    // by name
    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no "${term}" not found`,
      );

    return pokemon;
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      ErrorHandler.handleException(error);
    }
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true }); // { new: true } --> return new object
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      ErrorHandler.handleException(error);
    }
  }

  async remove(id: string) {
    return `This action removes a #${id} pokemon`;
  }
}
