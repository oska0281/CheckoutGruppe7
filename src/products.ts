import * as fs from 'fs';

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  rebateQuantity: number;
  rebatePercent: number;
  upsellProductId: string | null;
}

const products: Product[] = JSON.parse(fs.readFileSync('products.json', 'utf8'));

console.log(products);