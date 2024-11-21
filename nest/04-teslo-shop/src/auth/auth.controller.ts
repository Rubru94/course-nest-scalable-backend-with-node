import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { ValidRole } from './enums/valid-role.enum';
import { UserRoleGuard } from './guards/user-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  /**
   * Route with authentication only.
   */
  @Get('private')
  @UseGuards(AuthGuard()) // By default AuthGuard use JwtStrategy validations
  testingPrivateRoute(
    /* @Req() request: Express.Request */
    @GetUser() user: User,
    @GetUser('email') userSpecific: User,
    @GetUser(['email', 'fullName']) userSpecific2: User,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders, // Decorator from @nestjs/common
  ) {
    /**
     * if passed through the guard we could recover the user from express request.
     *
     * console.log({ user: request.user });
     */

    return {
      ok: true,
      message: 'Private route',
      user,
      userSpecific,
      userSpecific2,
      rawHeaders,
      headers,
    };
  }

  /**
   * Route with authentication & authorization.
   */
  @Get('private2')
  // @SetMetadata('roles', ['admin', 'super-user'])
  @RoleProtected(ValidRole.SuperUser, ValidRole.Admin)
  // With custom guards we avoid using "new UserRoleGuard()" to create new instances when new requests are made. Instead we use a single instance all the time.
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Private route 2',
      user,
    };
  }

  /**
   * Route with authentication & authorization using decorator composition (https://docs.nestjs.com/custom-decorators#decorator-composition).
   */
  @Get('private3')
  @Auth(ValidRole.SuperUser, ValidRole.Admin)
  testingPrivateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Private route 3',
      user,
    };
  }
}
