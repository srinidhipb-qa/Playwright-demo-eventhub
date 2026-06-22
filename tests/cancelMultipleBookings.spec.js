import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import BookEventPage from "../pages/BookEventPage";


const email = "srinidhinidhi38@gmail.com";
const password = "April@123";
const bookingName = "Srinidhi";
const bookingEmail = "test@test.com";
const bookingPhoneNumber = "+91 98765 43210";
const numberOfSeats = 3;
test("Should be able to book 3 seats for an event and cancel the booking", async ({
  page,
}) => {
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

  //assert if three seats are booked
  const cardLocatorSeats = page.locator(".bg-white").nth(2);
  const bookedSeats = await cardLocatorSeats
    .locator(".text-sm")
    .nth(1)
    .innerText();


  expect(bookedSeats).toBe("3");


  //To cancel a event
  const cancelBookingLocator = page.locator("div .inline-flex").nth(1);
  await cancelBookingLocator.click();
  const confirmCancelBookingLocator = page.locator("#confirm-dialog-yes");
  await confirmCancelBookingLocator.click();

  //Verify if "Booking cancelled successfully" toast is visible
  const cancelConfirmedToast = page.getByText("Booking cancelled successfully");
  await expect(cancelConfirmedToast).toBeVisible();
});
