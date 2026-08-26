const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../server/data/products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const categoriesToRemove = new Set([
  'Rakhi / Festival',
  'Gifts / E-Gift Cards',
  'Print Store',
  'Party & Celebration',
  'Pooja Needs',
  'Toys & Games',
  'Books & Magazines',
  'Fashion & Accessories',
  'Pet Care',
  'Home & Office',
  'Sauces & Spreads'
]);

const filteredProducts = products
  .filter(p => !categoriesToRemove.has(p.category))
  .map((p, index) => ({
    ...p,
    id: `prod_${index + 1}`
  }));

fs.writeFileSync(productsFilePath, JSON.stringify(filteredProducts, null, 2));

console.log(`Removed ${products.length - filteredProducts.length} items.`);
console.log(`Remaining items: ${filteredProducts.length}`);
const remainingCategories = [...new Set(filteredProducts.map(p => p.category))];
console.log(`Remaining categories (${remainingCategories.length}):`, remainingCategories);
