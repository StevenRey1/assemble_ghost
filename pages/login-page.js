
exports.LoginPage = class LoginPage {
  constructor(page, utilities) {
    this.page = page;
    this.utils = utilities; // Crear la instancia de Utilities una vez
    this.userField = page.locator('input[name="identification"]');
    this.passwordField = page.locator('input[name="password"]');
    this.signInButton = page.locator('button[type="submit"]');
  }

  async navigateTo(url) {
    await this.page.goto(url);
    await this.page.waitForTimeout(2000); // Considera usar `waitForLoadState` para mayor robustez
    await this.utils.takeScreenshot();
  }

  async submitLoginForm(user, password) {
    await this.userField.fill(user);
    await this.passwordField.fill(password);
    await this.utils.takeScreenshot();
    await this.signInButton.click();
  }

  async login(url) {
    const username = 'pruebauniandes@uniandes.edu.co';
    const userPassword = 'Uniandes123456';
    await this.navigateTo(url);
    await this.submitLoginForm(username, userPassword);
    await this.page.waitForTimeout(2000);
    await this.utils.takeScreenshot();
  }
};
