import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Toolshop/i);
});

test('preferred locators: role, text, test id, and placeholder', async ({ page }) => {
  await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();

  await expect(page.getByText('Categories', { exact: true })).toBeVisible();

  const search = page.getByTestId('search-query');
  await expect(search).toBeVisible();

  await expect(page.getByPlaceholder(/search/i)).toBeVisible();

  await search.fill('pliers');
  await page.getByTestId('search-submit').click();
  await expect(page.getByTestId('product-name').first()).toContainText(/pliers/i);
});

test('label, alt text, title, CSS, and XPath locator examples', async ({ page }) => {
  await page.getByRole('link', { name: /sign in/i }).click();
  await expect(page.getByLabel(/email/i)).toBeVisible();

  await expect(page.locator('input[type="email"]')).toBeVisible();

  await page.getByRole('link', { name: /home/i }).click();

  const firstProductImage = page.getByAltText(/pliers/i).first();
  await expect(firstProductImage).toBeVisible();

  await expect(page.getByTitle(/cart/i)).toBeVisible();

  const categoryHeading = page.locator('xpath=//*[normalize-space()="Categories"]');
  await expect(categoryHeading.first()).toBeVisible();
});

test('chaining and filtering locators within a product card', async ({ page }) => {
  const productCard = page
    .locator('[data-test="product-card"]')
    .filter({ hasText: /combination pliers/i })
    .first();

  await expect(productCard).toBeVisible();
  await expect(productCard.getByTestId('product-name')).toContainText(/combination pliers/i);
  await productCard.getByTestId('add-to-cart').click();

  await expect(page.getByRole('link', { name: /cart/i })).toContainText(/1/);
});
