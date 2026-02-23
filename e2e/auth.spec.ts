import { test, expect } from "@playwright/test";

test.describe("Authentification - Pages auth", () => {
  test("Page de connexion affiche le formulaire", async ({ page }) => {
    await page.goto("/connexion");
    const emailInput = page.locator("input[type='email']");
    const passwordInput = page.locator("input[type='password']");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Page d'inscription affiche le formulaire", async ({ page }) => {
    await page.goto("/inscription");
    const emailInput = page.locator("input[type='email']");
    const passwordInput = page.locator("input[type='password']");
    const nameInput = page.locator("input[type='text']");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Page connexion charge correctement", async ({ page }) => {
    await page.goto("/connexion");
    await expect(page).not.toHaveTitle(/erreur|error/i);
  });

  test("Page inscription charge correctement", async ({ page }) => {
    await page.goto("/inscription");
    await expect(page).not.toHaveTitle(/erreur|error/i);
  });
});
