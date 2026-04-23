export const productLocators = {
  productImage: '.inventory_details_img',
  productName: '.inventory_details_name',
  productPrice: '.inventory_details_price',
  productDescription: '.inventory_details_desc',
  addToCartButton: (slug: string) => `[data-test="add-to-cart-${slug}"]`,
  backButton: '[data-test="back-to-products"]',
};
