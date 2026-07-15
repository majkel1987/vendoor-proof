import { expect, test } from "@playwright/test";

test("EN footer opens Terms as a route modal and Escape restores focus", async ({
  page,
}) => {
  await page.goto("/property-management");
  const termsLink = page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Terms", exact: true });

  await termsLink.focus();
  await termsLink.click();

  await expect(page).toHaveURL(/\/terms$/);
  const dialog = page.getByRole("dialog", { name: "Terms of Service" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText("The Terms have not been published yet"),
  ).toBeVisible();
  await expect(dialog).not.toContainText("[[");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/property-management$/);
  await expect(termsLink).toBeFocused();
});

test("PL footer opens Regulamin and browser Back closes it", async ({
  page,
}) => {
  await page.goto("/pl/property-management");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Regulamin", exact: true })
    .click();

  await expect(page).toHaveURL(/\/pl\/terms$/);
  const dialog = page.getByRole("dialog", { name: "Regulamin" });
  await expect(
    dialog.getByText("Regulamin nie został jeszcze opublikowany"),
  ).toBeVisible();

  await page.goBack();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/pl\/property-management$/);
});

test("Terms language switch changes content and localized URL", async ({
  page,
}) => {
  await page.goto("/pl/property-management");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Regulamin", exact: true })
    .click();

  await page
    .getByRole("dialog", { name: "Regulamin" })
    .getByRole("link", { name: "EN", exact: true })
    .click();

  await expect(page).toHaveURL(/\/terms$/);
  await expect(
    page.getByRole("dialog", { name: "Terms of Service" }),
  ).toBeVisible();
  await expect(
    page.getByText("The Terms have not been published yet"),
  ).toBeVisible();
});

for (const terms of [
  { locale: "en", path: "/terms", title: "Terms of Service" },
  { locale: "pl", path: "/pl/terms", title: "Regulamin" },
] as const) {
  test(`${terms.path} renders a standalone localized and printable page`, async ({
    page,
  }) => {
    await page.goto(terms.path);
    await page.reload();

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { level: 1, name: terms.title }),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", terms.locale);
    await expect(page.locator("link[rel='canonical']")).toHaveCount(1);
    await expect(page.locator("link[hreflang='en']")).toHaveCount(1);
    await expect(page.locator("link[hreflang='pl']")).toHaveCount(1);
    await expect(page.locator("article")).toHaveAttribute(
      "data-terms-hash",
      /^[a-f0-9]{64}$/,
    );
    await expect(page.locator("body")).not.toContainText("[[");

    await page.emulateMedia({ media: "print" });
    await expect(
      page.getByRole("button", { name: /Print|Drukuj/ }),
    ).toBeHidden();
  });
}

test("Terms modal fits a 375px viewport at 200% zoom", async ({ page }) => {
  await page.setViewportSize({ width: 188, height: 406 });
  await page.goto("/property-management");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Terms", exact: true })
    .click();

  const box = await page
    .getByRole("dialog", { name: "Terms of Service" })
    .boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(188);
});
