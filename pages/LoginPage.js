import {constants} from "../constants/constants.js";

class LoginPage {
  constructor(page) {
    this.page = page;
  }
  async logIn(email, password) {
    await this.page.goto(constants.BASE_URL + "/login");
    const emailLocator = this.page.locator("#email");
    await emailLocator.fill(email);
    const passwordLocator = this.page.locator("#password");
    await passwordLocator.fill(password);
    const signInbuttonLocator = this.page.locator("#login-btn");
    await signInbuttonLocator.click();
  }
}

export default LoginPage;
