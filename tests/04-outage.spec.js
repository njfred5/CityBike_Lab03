const { test, expect } = require('@playwright/test');

test('station API outage shows an error and retry restores results', async ({ page }) => {
  let attempts = 0;
  await page.route('**/api/stations', async route => {
    attempts++;
    if (attempts === 1) {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service unavailable' })
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('/');
  const alert = page.getByRole('alert').filter({ hasText: 'Unable to load stations.' });
  await expect(alert).toBeVisible();

  await page.getByRole('button', { name: 'Retry loading' }).click();

  await expect(page.getByTestId('station-card')).toHaveCount(4);
  await expect(alert).toBeHidden();
  expect(attempts).toBe(2);
});
