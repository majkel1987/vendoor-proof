import { expect, test } from "@playwright/test";

test("EN footer opens the English policy as a route modal and Escape restores focus", async ({
  page,
}) => {
  await page.goto("/property-management");
  const privacyLink = page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Privacy", exact: true });

  await privacyLink.focus();
  await privacyLink.click();

  await expect(page).toHaveURL(/\/privacy$/);
  const dialog = page.getByRole("dialog", { name: "Privacy Policy" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText("The public website currently presents"),
  ).toBeVisible();
  await expect(dialog).not.toContainText("[[");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/property-management$/);
  await expect(privacyLink).toBeFocused();
});

test("PL footer opens the Polish policy and browser Back closes it", async ({
  page,
}) => {
  await page.goto("/pl/property-management");
  const privacyLink = page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Prywatność", exact: true });

  await privacyLink.click();

  await expect(page).toHaveURL(/\/pl\/privacy$/);
  const dialog = page.getByRole("dialog", { name: "Polityka prywatności" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText("Publiczna strona przedstawia obecnie produkt"),
  ).toBeVisible();

  await page.goBack();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/pl\/property-management$/);
});

test("language switch changes the open policy content and localized route", async ({
  page,
}) => {
  await page.goto("/pl/property-management");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Prywatność", exact: true })
    .click();

  const polishDialog = page.getByRole("dialog", { name: "Polityka prywatności" });
  await polishDialog.getByRole("link", { name: "EN", exact: true }).click();

  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole("dialog", { name: "Privacy Policy" })).toBeVisible();
  await expect(page.getByText("The public website currently presents")).toBeVisible();
});

for (const policy of [
  { locale: "en", path: "/privacy", title: "Privacy Policy" },
  { locale: "pl", path: "/pl/privacy", title: "Polityka prywatności" },
] as const) {
  test(`${policy.path} renders as a standalone localized page after a direct load`, async ({
    page,
  }) => {
    await page.goto(policy.path);
    await page.reload();

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { level: 1, name: policy.title }),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", policy.locale);
    await expect(page.locator("link[rel='canonical']")).toHaveCount(1);
    await expect(page.locator("link[hreflang='en']")).toHaveCount(1);
    await expect(page.locator("link[hreflang='pl']")).toHaveCount(1);
    await expect(page.locator("body")).not.toContainText("[[");
  });
}

test("privacy modal fits a 375px mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/property-management");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Privacy", exact: true })
    .click();

  const dialog = page.getByRole("dialog", { name: "Privacy Policy" });
  const box = await dialog.boundingBox();

  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(375);
  expect(box!.y + box!.height).toBeLessThanOrEqual(812);
});
