import { expect } from "@playwright/test";

class MyBookingsPage {
    constructor(page) {
        this.page = page;
    }

    async getBookingCardByRefId(referenceID) {
        return await this.page.locator("#booking-card").filter({ hasText: referenceID });
    }

    async openBookingDetails(referenceID) {
        const card = await this.getBookingCardByRefId(referenceID);

        await expect(card).toBeVisible();
        await card.getByText("View Details").click();
    }
}

export default MyBookingsPage;