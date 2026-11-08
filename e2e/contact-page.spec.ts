import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const BREAKPOINTS = [320, 768, 1024, 1440] as const
const THEMES = ['light', 'dark'] as const
const VIEWPORT_HEIGHT = 900

async function openPage(page: Page, theme: (typeof THEMES)[number] = 'light') {
  await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Contact us' })).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
}

test('the example page loads', async ({ page }) => {
  await openPage(page)
  await expect(page).toHaveTitle('App template')
  await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible()
})

test('a keyboard-only user can submit the form', async ({ page }) => {
  await openPage(page)

  // Tab order: theme toggle, Name, Email, Message, Send message.
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Dark theme' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByLabel('Name')).toBeFocused()
  await page.keyboard.type('Ada Lovelace')
  await page.keyboard.press('Tab')
  await page.keyboard.type('ada@example.com')
  await page.keyboard.press('Tab')
  await page.keyboard.type('Sent with the keyboard only.')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Send message' })).toBeFocused()
  await page.keyboard.press('Enter')

  await expect(page.getByRole('status')).toHaveText('Message sent. Thank you, Ada Lovelace.')
  await expect(page.getByRole('table').getByText('ada@example.com')).toBeVisible()
})

test('the theme toggle works from the keyboard', async ({ page }) => {
  await openPage(page)
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.keyboard.press('Space')
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})

for (const theme of THEMES) {
  test(`axe reports zero violations (${theme})`, async ({ page }) => {
    await openPage(page, theme)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  test(`axe reports zero violations with form errors (${theme})`, async ({ page }) => {
    await openPage(page, theme)
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByText('Enter your name.')).toBeVisible()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  for (const width of BREAKPOINTS) {
    test(`screenshot ${width}px ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT })
      await openPage(page, theme)
      await expect(page).toHaveScreenshot(`contact-${width}-${theme}.png`, { fullPage: true })
    })
  }
}
