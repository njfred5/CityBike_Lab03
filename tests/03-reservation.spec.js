const { test, expect } = require('@playwright/test');

async function openReservationForm(page) {
  await page.goto('/');
  await expect(page.getByTestId('station-card')).toHaveCount(4);
  await page.getByRole('button', { name: 'Reserve at Central Square' }).click();
}

test('invalid email blocks reservation', async ({ page }) => {
  let postCount = 0;
  await page.route('**/api/reservations', route => {
    postCount++;
    return route.continue();
  });

  await openReservationForm(page);
  await page.getByLabel('Email address').fill('not-an-email');
  await page.getByRole('button', { name: 'Confirm reservation' }).click();

  await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  expect(postCount).toBe(0);
});

test('reservation sends correct payload and confirms booking', async ({ page }) => {
  let payload;
  await page.route('**/api/reservations', async route => {
    payload = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ reservationId: 'CB-DEMO-777', stationId: 'central' })
    });
  });

  await openReservationForm(page);
  await page.getByLabel('Email address').fill('student@example.com');
  await page.getByRole('button', { name: 'Confirm reservation' }).click();

  await expect(page.getByText('Reservation confirmed: CB-DEMO-777')).toBeVisible();
  expect(payload).toEqual({ stationId: 'central', email: 'student@example.com' });
});
