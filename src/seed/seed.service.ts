import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService
  ) {

  }

  public async runSeed() {
    await this.insertNewProducts();
    return "SEED EXECUTED!"
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProduct();

    const products = initialData.products;
    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product))
    })

    const results = await Promise.all(insertPromises);


    return results;
  }
}
