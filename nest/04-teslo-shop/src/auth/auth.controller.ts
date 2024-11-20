import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { GetUser, RawHeaders } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard()) // By default AuthGuard use JwtStrategy validations
  testingPrivateRoute(
    /* @Req() request: Express.Request */
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
  ) {
    /**
     * if passed through the guard we could recover the user from express request.
     *
     * console.log({ user: request.user });
     */

    return { ok: true, message: 'Private route', user, userEmail };
  }
}
