import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from "bcrypt";

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt.payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger = new Logger("AuthService");

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService:JwtService
  ) { }
  public async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...restData } = createUserDto;
      const user = this.userRepository.create({
        ...restData,
        password: bcrypt.hashSync(password, 12)
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token:this.getJwtToken({id:user.id})
      };

    } catch (err) {
      this.handleDBExceptions(err);
    }
  }
  public async login(loginUserDto: LoginUserDto) {
      const { email, password } = loginUserDto;

      const user = await this.userRepository.findOne({
        where:{email},
        select:{email:true,password:true,id:true}
      });

      if(!user) 
        throw new UnauthorizedException("Not Valid Credentials (email)");

      if(!bcrypt.compareSync(password,user.password)) 
        throw new UnauthorizedException("Not Valid Credentials (password)");
      delete user.password;

      return {
        ...user,
        token:this.getJwtToken({id:user.id})
      };
      // TODO: Return JWT Token
  }

  public checkAuthStatus(user:User){
    return {
      ...user,
      token:this.getJwtToken({id:user.id})
    };
  }

  private getJwtToken(payload:JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBExceptions(err: any): never {
    if (err.code === "23505")
      throw new BadRequestException(err.detail);
    console.log(err);
    
    this.logger.error(err);
    throw new InternalServerErrorException("Unexpected Error");
  }
}
