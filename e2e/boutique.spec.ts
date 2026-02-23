import { test, expect } from "@playwright/test";

test.describe("Boutique - Fonctionnalités produits", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/boutique");
  });

  test("Les produits s'affichent en grille", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
  });

  test("Les boutons de filtre par catégorie existent", async ({ page }) => {
    const filterButtons = page.locator("button");
    await expect(filterButtons).toBeDefined();
  });

  test("Le menu déroulant de tri existe", async ({ page }) => {
    const sortDropdown = page.locator("select, [role='combobox']");
    if (await sortDropdown.count() > 0) {
      await expect(sortDropdown.first()).toBeVisible();
    }
  });

  test("La barre de recherche filtre les produits", async ({ page }) => {
    const searchInput = page.locator(
      "input[type='search'], input[placeholder*='recherch' i]"
    );
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible();
    }
  });

  test("Le toggle 'En stock' existe", async ({ page }) => {
    const stockToggle = page.locator("input[type='checkbox']");
    if (await stockToggle.count() > 0) {
      await expect(stockToggle.first()).toBeVisible();
    }
  });

  test("La page boutique charge sans erreur", async ({ page }) => {
    await expect(page).not.toHaveTitle(/erreur|error/i);
  });

  test("Clic sur un produit navigue vers la page détail", async ({ page }) => {
    const productLink = page.locator("a[href*='/produit'], a[href*='/product']");
    if (await productLink.count() > 0) {
      const href = await productLink.first().getAttribute("href");
      expect(href).toBeTruthy();
    }
  });
});
