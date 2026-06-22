import { expect } from "@playwright/test";
import MyBookingsPage from "./MyBookingsPage";
import { constants } from "../constants/constants.js";

class BookEventPage {
  constructor(page) {
    this.page = page;
  }
  
  async bookEvent(bookingName, bookingEmail, bookingPhoneNumber, numberOfSeats) {
    const browseEventLocator = this.page.getByText("Browse Events →");
    await browseEventLocator.click();

    //Verify if page is loaded and first book now button is visible
    const bookButtonLocators = this.page.getByTestId("book-now-btn");
    const firstBookButtonLocator = bookButtonLocators.first();
    await expect(firstBookButtonLocator).toBeVisible();

    await firstBookButtonLocator.click();

    for (let i = 0; i < numberOfSeats - 1; i++) {
      await this.page.locator("div .w-9").nth(1).click();
    };
    const bookingNameLocator = this.page.locator("#customerName")
    await bookingNameLocator.fill(bookingName);

    const bookingEmailLocator = this.page.locator("#customer-email")
    await bookingEmailLocator.fill(bookingEmail);

    const bookingPhoneNumberLocator = this.page.locator("#phone")
    await bookingPhoneNumberLocator.fill(bookingPhoneNumber);

    const confirmBookingLocator = this.page.locator("#confirm-booking");
    await confirmBookingLocator.click();

    await expect(
      this.page.getByText("Booking Confirmed")
    ).toBeVisible();

    return (await this.page.locator(".booking-ref").innerText()).trim();
  }

  async navigateToViewMyBookings() {
    await Promise.all([
      this.page.waitForURL(`${constants.BASE_URL}/bookings`),
      this.page.getByText('View My Bookings').click()
    ]);

    return new MyBookingsPage(this.page);
  }
}

export default BookEventPage;




