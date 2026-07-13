import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/property-management",
  "/contractors",
  "/pl/property-management",
  "/pl/contractors"
];

for (const route of routes) {
  test(`${route} renders semantic metadata and footer`, async ({ page }) => {
    await page.goto(route);

    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.locator("link[rel='canonical']")).toHaveCount(1);
    await expect(page.locator("link[hreflang='en']")).toHaveCount(1);
    await expect(page.locator("link[hreflang='pl']")).toHaveCount(1);
    await expect(page.locator("link[hreflang='x-default']")).toHaveCount(1);
    await expect(
      page.getByText(/does not provide legal|nie zapewnia porad prawnych/i)
    ).toBeVisible();
  });
}

test("EN property hero CTA validates the pilot form and reaches success", async ({
  page
}) => {
  await page.route("**/api/lead", async (route) => {
    await route.fulfill({
      body: JSON.stringify({ ok: true }),
      contentType: "application/json",
      status: 200
    });
  });

  await page.goto("/property-management");
  await page
    .locator("main section")
    .first()
    .getByRole("link", { name: "Join early access" })
    .click();

  const form = page.locator("form");
  const workEmail = form.locator("#workEmail");
  await expect(workEmail).toBeVisible();
  await expect(workEmail).toBeFocused();
  await form.getByRole("button", { name: "Join early access" }).click();

  await expect(page.getByText("This field is required.").first()).toBeVisible();

  await workEmail.fill("alex@northline.example");
  await form.locator("#company").fill("Northline Property Group");
  await form.getByLabel("I agree to be contacted regarding early access").check();
  await form.getByRole("button", { name: "Join early access" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Thanks — we received your pilot application."
    })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Book a 20-minute workflow call" })
  ).toBeVisible();
});

test("mobile contractor navigation switches to PL and preserves segment", async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contractors");

  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Navigation" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { exact: true, name: "PL" }).click();

  await expect(page).toHaveURL(/\/pl\/contractors$/);
  await page
    .locator("main section")
    .first()
    .getByRole("link", { name: "Zgłoś firmę do wczesnego dostępu" })
    .click();
  await expect(page.getByLabel("Sluzbowy adres email")).toBeFocused();
});

test("PL property FAQ supports keyboard operation and emits FAQPage JSON-LD", async ({
  page
}) => {
  await page.goto("/pl/property-management");

  const faqButton = page.getByRole("button", {
    name: /Czy system sam przypomina vendorom/
  });
  await faqButton.focus();
  await expect(faqButton).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("region", {
      name: /Czy system sam przypomina vendorom/
    })
  ).toBeVisible();

  const faqJsonLd = await page
    .locator("script[type='application/ld+json']")
    .evaluateAll((scripts) =>
      scripts
        .map((script) => script.textContent ?? "")
        .some((content) => content.includes('"@type":"FAQPage"'))
    );
  expect(faqJsonLd).toBe(true);
});

test("mobile 375px has no horizontal overflow and keeps CTA usable", async ({
  page
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/property-management");

  const hasNoOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
  );
  expect(hasNoOverflow).toBe(true);

  const cta = page
    .locator("main section")
    .first()
    .getByRole("link", { name: "Join early access" });
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page.getByLabel("Work email")).toBeFocused();
});

test("prefers-reduced-motion disables pulse and reveal entry styles", async ({
  page
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/property-management");

  const pulseAnimation = await page
    .locator(".workflow-status-pulse")
    .first()
    .evaluate((element) => getComputedStyle(element).animationName);
  expect(pulseAnimation).toBe("none");

  const revealStyle = await page
    .locator("[data-motion-reveal]")
    .first()
    .evaluate((element) => ({
      opacity: getComputedStyle(element).opacity,
      transform: getComputedStyle(element).transform
    }));
  expect(revealStyle).toEqual({ opacity: "1", transform: "none" });
});

test("landing page has no detectable axe violations", async ({ page }) => {
  await page.goto("/property-management");
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
