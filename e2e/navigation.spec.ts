import { test, expect } from "@playwright/test";

test.describe("Navigation - Toutes les pages principales", () => {
  test("Page d'accueil affiche '3D World'", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1, title")).toContainText(/3D World|3dworld/i);
  });

  test("Page boutique charge correctement", async ({ page }) => {
    await page.goto("/boutique");
    await expect(
      page.locator("body")
    ).toBeVisible();
  });

  test("Page blog charge correctement", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Page FAQ charge correctement", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Page contact charge correctement", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Page services charge correctement", async ({ page }) => {
    await page.goto("/services");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Page à propos charge correctement", async ({ page }) => {
    await page.goto("/a-propos");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Page CGV charge correctement", async ({ page }) => {
    await page.goto("/cgv");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Page mentions légales charge correctement", async ({ page }) => {
    await page.goto("/mentions-legales");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Page politique cookies charge correctement", async ({ page }) => {
    await page.goto("/politique-cookies");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Page politique de confidentialité charge correctement", async ({
    page,
  }) => {
    await page.goto("/politique-de-confidentialite");
    await expect(page.locator("body")).toBeVisible();
  });
});
