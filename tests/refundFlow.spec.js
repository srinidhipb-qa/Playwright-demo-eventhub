import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import BookEventPage from "../pages/BookEventPage";

const email = "srinidhinidhi38@gmail.com";
const password = "April@123";
const bookingName = "Srinidhi";
const bookingEmail = "test@test.com";
const bookingPhoneNumber = "+91 98765 43210";


test("Full refund is eligible for single ticket", async ({ page }) => {
  //New instance of loginPage
  const loginPage = new LoginPage(page);
  await loginPage.logIn(email, password);

  //New instance of bookEventPage
  const bookEventPage = new BookEventPage(page);
  let numberOfSeats = -1;
  const bookingReferenceId = await bookEventPage.bookEvent(bookingName, bookingEmail, bookingPhoneNumber, numberOfSeats);
  
  //To navigate to view My bookings
  const myBookingsPage = await bookEventPage.navigateToViewMyBookings();

  //To open the booking details card based on ref id
  await myBookingsPage.openBookingDetails(bookingReferenceId);

  //assert if only one seat is booked
  const cardLocatorSeats = page.locator(".bg-white").nth(2);
  const bookedSeats = await cardLocatorSeats
    .locator(".text-sm")
    .nth(1)
    .innerText();

  expect(bookedSeats === "1").toBeTruthy();

  //To check for refund eligiblity
  const refundButtonLocator = page.locator("#check-refund-btn");
  await refundButtonLocator.click();

  //To wait for spinner to complete the action
  await page.waitForTimeout(5000);

  //To assert the text eligible for full refund
  const eligibleForRefundText = "Eligible for refund. Single-ticket bookings qualify for a full refund."
  await expect(page.getByText(eligibleForRefundText)).toBeVisible();


  //To cancel a event
  const cancelBookingLocator = page.locator("div .inline-flex").nth(1);
  await cancelBookingLocator.click();
  const confirmCancelBookingLocator = page.locator("#confirm-dialog-yes");
  await confirmCancelBookingLocator.click();

  //Verify if "Booking cancelled successfully" toast is visible
  const cancelConfirmedToast = page.getByText("Booking cancelled successfully");
  await expect(cancelConfirmedToast).toBeVisible();
});


test("Refund is not  eligible for group (3) ticket", async ({
  page,
}) => {
  //New instance of loginPage
  const loginPage = new LoginPage(page);
  await loginPage.logIn(email, password);

  //New instance of bookEventPage
  const bookEventPage = new BookEventPage(page);
  let numberOfSeats = 3;
  const bookingReferenceId = await bookEventPage.bookEvent(bookingName, bookingEmail, bookingPhoneNumber, numberOfSeats);

  //To navigate to view My bookings
  const myBookingsPage = await bookEventPage.navigateToViewMyBookings();

  //To open the booking details card based on ref id
  await myBookingsPage.openBookingDetails(bookingReferenceId);

  //assert if three seats are booked
  const cardLocatorSeats = page.locator(".bg-white").nth(2);
  const bookedSeats = await cardLocatorSeats
    .locator(".text-sm")
    .nth(1)
    .innerText();

  expect(bookedSeats === "3").toBeTruthy();

  //To check for refund eligiblity
  const refundButtonLocator = page.locator("#check-refund-btn");
  await refundButtonLocator.click();

  //To wait for spinner to complete the action
  await page.waitForTimeout(5000);

  //To assert the text eligible for full refund
  const notEligibleForRefundText = "Not eligible for refund. Group bookings (3 tickets) are non-refundable."
  await expect(page.getByText(notEligibleForRefundText)).toBeVisible();

  //To cancel a event
  const cancelBookingLocator = page.locator("div .inline-flex").nth(1);
  await cancelBookingLocator.click();
  const confirmCancelBookingLocator = page.locator("#confirm-dialog-yes");
  await confirmCancelBookingLocator.click();

  //Verify if "Booking cancelled successfully" toast is visible
  const cancelConfirmedToast = page.getByText("Booking cancelled successfully");
  await expect(cancelConfirmedToast).toBeVisible();
});
