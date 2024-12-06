import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { RawHeaders,GetUser } from './decorators';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("register")
  public register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post("login")
  public login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get("check-auth-status")
  @Auth()
  checkAuthStatus(
    @GetUser() user:User
  ){
    return this.authService.checkAuthStatus(user);
  }

  @Get("private")
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user:User,
    @GetUser("email") userEmail:string,
    @RawHeaders() rawHeader: string[],
    @Headers() headers:IncomingHttpHeaders
  ) {
    
    
    return {
      ok: true,
      message: "private",
      user,
      userEmail,
      rawHeader,
      headers
    }
  }

  @Get("private2")
  // @SetMetadata("roles",["admin","super-user"])
  @RoleProtected(ValidRoles.SUPER_USER,ValidRoles.ADMIN)
  @UseGuards(AuthGuard(),UserRoleGuard)
  privateRoute2(
    @GetUser() user:User,
  ){

    return {
      ok: true,
      message: "private2",
      user
    }
  }
  @Get("private3")
  @Auth(ValidRoles.ADMIN)
  privateRoute3(
    @GetUser() user:User,
  ){

    return {
      ok: true,
      message: "private2",
      user
    }
  }
}
