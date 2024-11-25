import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository } from 'typeorm';
import { handleDBException } from '../common/handlers/error.handler';
import { AuthenticatedUser, CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<AuthenticatedUser> {
    try {
      const user = this.createUser(createUserDto);
      await this.userRepository.save(user);

      delete user.password;
      return { ...user, token: this.getJwtToken({ id: user.id }) };
    } catch (error) {
      handleDBException(error, this.logger);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthenticatedUser> {
    const { email, password } = loginUserDto;

    /**
     * It is only necessary to obtain the user's password in login.
     * By default the user entity will have that column with { select: false }
     * and here we retrieve it with a specific query.
     */
    const user = await this.userRepository.findOne({
      select: { id: true, email: true, password: true },
      where: { email },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    // bcrypt.compareSync --> encrypt data sended (password) & compare against previously encrypted data (user.password)
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    delete user.password;
    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }

  async registerUserBatch(createUserDtoCollection: CreateUserDto[]) {
    try {
      const users = createUserDtoCollection.map((user) =>
        this.createUser(user),
      );
      return await this.userRepository.save(users);
    } catch (error) {
      handleDBException(error, this.logger);
    }
  }

  /**
   * User token revalidation
   */
  async checkAuthStatus(user: User): Promise<AuthenticatedUser> {
    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }

  async deleteAllUsers(): Promise<DeleteResult> {
    const qb = this.userRepository.createQueryBuilder('user');

    try {
      return await qb.delete().where({}).execute();
    } catch (error) {
      handleDBException(error, this.logger);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private createUser(createUserDto: CreateUserDto): User {
    const saltRounds = 10;
    const { password, ...userData } = createUserDto;

    return this.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, saltRounds),
    });
  }
}
