import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import { constants } from "../constants/constants.js";

const email = "srinidhinidhi38@gmail.com";
const password = "April@123";
const bookingName = "Srinidhi";
const bookingEmail = "test@test.com";
const bookingPhoneNumber = "+91 98765 43210";

test("Should be able to book an event", async ({ page }) => {
  //New instance of loginPage
  const loginPage = new LoginPage(page);
  await loginPage.logIn(email, password);

  const browseEventLocator = await page.getByText("Browse Events →");
  await browseEventLocator.click();

  //Verify if page is loaded and first book now button is visible
  const bookButtonLocators = page.getByTestId("book-now-btn");
  const firstBookButtonLocator = bookButtonLocators.first();

  await expect(firstBookButtonLocator).toBeVisible();

  //Book an event with 1 seat

  await firstBookButtonLocator.click();
  await page.locator("#customerName").fill(bookingName);
  await page.locator("#customer-email").fill(bookingEmail);
  await page.locator("#phone").fill(bookingPhoneNumber);
  await page.locator("#confirm-booking").click();

  //To assert if the booking is done
  await expect(page.getByText("Booking Confirmed")).toBeVisible();
  await expect(page.getByText("Booking Ref")).toBeVisible();

  const referenceId = await page.locator(".booking-ref").first().innerText();

  await page.getByText("View My Bookings").click();
  //To get the first booking card
  const firstBookedCard = await page.locator("#booking-card").first();
  // const bookingRefOfFirstCard = await firstBookButtonLocator.locator(".booking-ref")

  const referenceIdofBookedCard = await firstBookedCard
    .locator(".booking-ref")
    .textContent();

  //To test if the booking ref ID and cardd after booking has the same ref ID
  await expect(referenceId === referenceIdofBookedCard).toBeTruthy();

  //To click on view details
  const viewDetailsLocator = await firstBookedCard.getByText("View Details");

  await viewDetailsLocator.click();

  //View details of booked event page is open
  //Fetch the ref ID and compare
  const referenceIdInViewDetails = await page
    .locator("div span.font-mono")
    .first()
    .innerText();

  await expect(referenceId === referenceIdInViewDetails).toBeTruthy();

  //Fetch and compare the customer name
  const cardLocator = page.locator(".bg-white").nth(1);
  const customerNameInViewDetails = await cardLocator
    .locator(".text-sm")
    .nth(1)
    .innerText();
  await expect(customerNameInViewDetails === bookingName).toBeTruthy();

  //Fetch and compare the customer email
  const customerEmailViewDetails = await cardLocator
    .locator(".text-sm")
    .nth(3)
    .innerText();
  await expect(customerEmailViewDetails === bookingEmail).toBeTruthy();

  //assert if only one seat is booked
  const cardLocatorSeats = page.locator(".bg-white").nth(2);
  const bookedSeats = await cardLocatorSeats
    .locator(".text-sm")
    .nth(1)
    .innerText();

  await expect(bookedSeats === "1").toBeTruthy();

  //To cancel a event
  const cancelBookingLocator = page.locator("div .inline-flex").nth(1);
  await cancelBookingLocator.click();
  const confirmCancelBookingLocator = page.locator("#confirm-dialog-yes");
  await confirmCancelBookingLocator.click();

  //Verify if "Booking cancelled successfully" toast is visible
  const cancelConfirmedToast = page.getByText("Booking cancelled successfully");
  await expect(cancelBookingLocator).toBeVisible();
});
