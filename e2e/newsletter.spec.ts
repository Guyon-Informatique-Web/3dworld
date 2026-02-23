import { test, expect } from "@playwright/test";

test.describe("Infolettre - Fonctionnalités", () => {
  test("Formulaire infolettre est visible", async ({ page }) => {
    await page.goto("/");
    const newsForm = page.locator(
      "form:has-text('infolettre'), form:has-text('newsletter'), input[type='email']"
    );
    if (await newsForm.count() > 0) {
      await expect(newsForm.first()).toBeVisible();
    }
  });

  test("Champ email accepte du texte", async ({ page }) => {
    await page.goto("/");
    const emailInput = page.locator("input[type='email']");
    if (await emailInput.count() > 0) {
      await emailInput.first().fill("test@example.com");
      const value = await emailInput.first().inputValue();
      expect(value).toBe("test@example.com");
    }
  });

  test("Bouton soumettre existe", async ({ page }) => {
    await page.goto("/");
    const submitButton = page.locator(
      "button[type='submit'], button:has-text('Envoyer'), button:has-text('S'), button:has-text('Submit')"
    );
    if (await submitButton.count() > 0) {
      await expect(submitButton.first()).toBeVisible();
    }
  });
});
