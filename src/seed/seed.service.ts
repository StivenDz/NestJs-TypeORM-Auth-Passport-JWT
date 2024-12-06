import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from "bcrypt";

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository:Repository<User>
  ) {

  }

  public async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return "SEED EXECUTED!"
  }

  private async deleteTables() {
    await this.productsService.deleteAllProduct();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()

  }
  private async insertUsers(){
    const seedUsers = initialData.users;

    const users:User[] = [];

    seedUsers.forEach(user => {
      users.push( this.userRepository.create({
        ...user,
        password: bcrypt.hashSync(user.password,12)
      }) )
    })

    const usersInserted = await this.userRepository.save(users);

    return usersInserted[0];
  }

  private async insertNewProducts(user:User) {    

    const products = initialData.products;
    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product,user))
    })

    const results = await Promise.all(insertPromises);


    return results;
  }
}
