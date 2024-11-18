import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { handleDBException } from '../common/handlers/error.handler';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const saltRounds = 10;
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, saltRounds),
      });
      await this.userRepository.save(user);
      delete user.password;

      return user;
      // TODO: Return access JWT
    } catch (error) {
      handleDBException(error, this.logger);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    /**
     * It is only necessary to obtain the user's password in login.
     * By default the user entity will have that column with { select: false }
     * and here we retrieve it with a specific query.
     */
    const user = await this.userRepository.findOne({
      select: { email: true, password: true },
      where: { email },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    // bcrypt.compareSync --> encrypt data sended (password) & compare against previously encrypted data (user.password)
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    return user;
  }
}
