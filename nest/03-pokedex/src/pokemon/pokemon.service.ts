import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorHandler } from 'src/common/handlers';
import { CreatePokemonDto, UpdatePokemonDto } from './dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultSearchLimit: number;
  private defaultSearchOffset: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultSearchLimit =
      this.configService.getOrThrow<number>('defaultLimit'); // handle error if env variable not exist
    this.defaultSearchOffset =
      this.configService.getOrThrow<number>('defaultOffset');
  }

  findAll(paginationDto: PaginationDto) {
    const {
      limit = this.defaultSearchLimit,
      offset = this.defaultSearchOffset,
    } = paginationDto;

    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 'asc' });
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

  async createBatch(pokemons: CreatePokemonDto[]) {
    const pokes = pokemons.map((p) => ({
      ...p,
      name: p.name.toLowerCase(),
    }));

    try {
      return await this.pokemonModel.insertMany(pokes);
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
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id: '${id}' not found`);

    return;
  }

  async removeAll() {
    await this.pokemonModel.deleteMany({}); // delete * from pokemons
    return;
  }
}
