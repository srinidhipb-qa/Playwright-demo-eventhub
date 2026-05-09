import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage.js";
import { constants } from "../constants/constants.js"

const email = "srinidhinidhi38@gmail.com";
const password = "April@123";
test("Should log in successfully", async ({ page }) => {
  const loginPage = new LoginPage(page);
  loginPage.logIn(email, password);

  //To verify if log out button is present
  const logOutButtonLocator = page.locator("#logout-btn");
  await expect(logOutButtonLocator).toBeVisible();

  //To verify if the logged in user is correct
  const userLocator = page.locator("#user-email-display");
  const userName = await userLocator.textContent();
  expect(email == userName).toBeTruthy();

  //To check the URL is changed to dashboard
  await expect(page).toHaveURL(constants.BASE_URL);

  //To verify if browse events link is visible
  await expect(page.getByText("Browse Events →")).toBeVisible();

  //To verify if My bookings link is visible
  const mybookingsLocator = page.locator("div a[href='/bookings']").nth(1);
  await expect(mybookingsLocator).toBeVisible();
});
