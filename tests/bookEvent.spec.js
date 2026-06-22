import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import BookEventPage from "../pages/BookEventPage";

const email = "srinidhinidhi38@gmail.com";
const password = "April@123";
const bookingName = "Srinidhi";
const bookingEmail = "test@test.com";
const bookingPhoneNumber = "+91 98765 43210";
const numberOfSeats = 1;

test("Should be able to book an event", async ({ page }) => {
  //New instance of loginPage
  const loginPage = new LoginPage(page);
  await loginPage.logIn(email, password);

  //New instance of bookEventPage
  const bookEventPage = new BookEventPage(page);
  const bookingReferenceId = await bookEventPage.bookEvent(bookingName, bookingEmail, bookingPhoneNumber, numberOfSeats);
  await expect(page.getByText("Booking Ref")).toBeVisible();

  //To navigate to view My bookings
  const myBookingsPage = await bookEventPage.navigateToViewMyBookings();

  //To open the booking details card based on ref id
  await myBookingsPage.openBookingDetails(bookingReferenceId);

  //Fetch and compare the customer name
  const cardLocator = page.locator(".bg-white").nth(1);
  const customerNameInViewDetails = await cardLocator
    .locator(".text-sm")
    .nth(1)
    .innerText();
  expect(customerNameInViewDetails).toBe(bookingName);

  //Fetch and compare the customer email
  const customerEmailViewDetails = await cardLocator
    .locator(".text-sm")
    .nth(3)
    .innerText();

  expect(customerEmailViewDetails).toBe(bookingEmail)

  //assert if only one seat is booked
  const cardLocatorSeats = page.locator(".bg-white").nth(2);
  const bookedSeats = await (cardLocatorSeats.locator(".text-sm").nth(1)).innerText();
  expect(bookedSeats === "1").toBeTruthy();
});
