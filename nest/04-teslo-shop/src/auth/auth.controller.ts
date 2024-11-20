import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';

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
    @GetUser(['email', 'role']) user: User,
  ) {
    /**
     * if passed through the guard we could recover the user from express request.
     *
     * console.log({ user: request.user });
     */

    return { ok: true, message: 'Private route', user };
  }
}
