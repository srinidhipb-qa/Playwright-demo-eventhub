import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";


const email = "srinidhinidhi38@gmail.com";
const password = "April@123";
const bookingName = "Srinidhi";
const bookingEmail = "test@test.com";
const bookingPhoneNumber = "+91 98765 43210";
test("Should be able to book 3 seats for an event and cancel the booking", async ({
  page,
}) => {
  //New instance of loginPage
  const loginPage = new LoginPage(page);
  await loginPage.logIn(email, password);

  const browseEventLocator =  page.getByText("Browse Events →");
  await browseEventLocator.click();

  //Verify if page is loaded and first book now button is visible
  const bookButtonLocators = page.getByTestId("book-now-btn");
  const firstBookButtonLocator = bookButtonLocators.first();
  await expect(firstBookButtonLocator).toBeVisible();

  //Book an event with 2 seat

  await firstBookButtonLocator.click();
  const numberOfSeats = page.locator("div  .w-9").nth(1);
  await numberOfSeats.click();
  await numberOfSeats.click();

  await page.locator("#customerName").fill(bookingName);
  await page.locator("#customer-email").fill(bookingEmail);
  await page.locator("#phone").fill(bookingPhoneNumber);

  await page.locator("#confirm-booking").click();

  //To assert if the booking is done
  await expect(page.getByText("Booking Confirmed")).toBeVisible();
  await expect(page.getByText("Booking Ref")).toBeVisible();

  const referenceId = await page.locator(".booking-ref").first().innerText();

  await page.getByText("View My Bookings").click();
 
//To fetch the card based on refId
  const bookingCard = page.locator("#booking-card").filter({hasText: referenceId})

  //To click on view details
  const viewDetailsLocator =  bookingCard.getByText("View Details");

  await viewDetailsLocator.click();

  //View details of booked event page is open
  //Fetch the ref ID and compare
  const referenceIdInViewDetails = await page
    .locator("div span.font-mono")
    .first()
    .innerText();

   expect(referenceId === referenceIdInViewDetails).toBeTruthy();

  //Fetch and compare the customer name
  const cardLocator = page.locator(".bg-white").nth(1);
  const customerNameInViewDetails = await cardLocator
    .locator(".text-sm")
    .nth(1)
    .innerText();
   expect(customerNameInViewDetails === bookingName).toBeTruthy();

  //Fetch and compare the customer email
  const customerEmailViewDetails = await cardLocator
    .locator(".text-sm")
    .nth(3)
    .innerText();
   expect(customerEmailViewDetails === bookingEmail).toBeTruthy();

  //assert if only one seat is booked
  const cardLocatorSeats = page.locator(".bg-white").nth(2);
  const bookedSeats = await cardLocatorSeats
    .locator(".text-sm")
    .nth(1)
    .innerText();

   expect(bookedSeats === "3").toBeTruthy();

  //To cancel a event
  const cancelBookingLocator = page.locator("div .inline-flex").nth(1);
  await cancelBookingLocator.click();
  const confirmCancelBookingLocator = page.locator("#confirm-dialog-yes");
  await confirmCancelBookingLocator.click();

  //Verify if "Booking cancelled successfully" toast is visible
  const cancelConfirmedToast = page.getByText("Booking cancelled successfully");
  await expect(cancelConfirmedToast).toBeVisible();
});
