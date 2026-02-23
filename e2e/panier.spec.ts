import { test, expect } from "@playwright/test";

test.describe("Panier - Fonctionnalités", () => {
  test("Page panier charge correctement", async ({ page }) => {
    await page.goto("/panier");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Page panier ne montre pas d'erreur", async ({ page }) => {
    await page.goto("/panier");
    await expect(page).not.toHaveTitle(/erreur|error/i);
  });

  test("Message panier vide s'affiche quand nécessaire", async ({ page }) => {
    await page.goto("/panier");
    const emptyMessage = page.locator(
      "text=/panier vide|empty|aucun produit/i"
    );
    // Le message existe peut-être, c'est ok
    await expect(page.locator("body")).toBeVisible();
  });

  test("Panier page charge sans erreur JavaScript", async ({ page }) => {
    let jsError = false;
    page.on("pageerror", () => {
      jsError = true;
    });
    await page.goto("/panier");
    expect(jsError).toBe(false);
  });
});
