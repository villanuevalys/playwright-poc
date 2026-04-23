export const cartLocators = {
  cartItems: '[data-test="inventory-item"]',
  checkoutButton: '[data-test="checkout"]',
  continueShoppingButton: '[data-test="continue-shopping"]',
  removeButton: (slug: string) => `[data-test="remove-${slug}"]`,
};
