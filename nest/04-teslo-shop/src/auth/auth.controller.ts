import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { AuthenticatedUser, CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { ValidRole } from './enums/valid-role.enum';
import { UserRoleGuard } from './guards/user-role.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'User created',
    type: AuthenticatedUser,
  })
  @ApiResponse({
    example: {
      message: ['email must be an email', 'email must be a string'],
      error: 'Bad Request',
      statusCode: 400,
    },
    status: 400,
    description: 'Bad request',
  })
  @Post('register')
  registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<AuthenticatedUser> {
    return this.authService.registerUser(createUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'User logged',
    type: AuthenticatedUser,
  })
  @ApiResponse({
    example: {
      message: ['email must be an email', 'email must be a string'],
      error: 'Bad Request',
      statusCode: 400,
    },
    status: 400,
    description: 'Bad request',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto): Promise<AuthenticatedUser> {
    return this.authService.login(loginUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'User status obtained',
    type: AuthenticatedUser,
  })
  @ApiResponse({
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User): Promise<AuthenticatedUser> {
    return this.authService.checkAuthStatus(user);
  }

  /**
   * Route with authentication only.
   */
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
