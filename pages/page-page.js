const { expect } = require("playwright/test");
const { LoginPage } = require("./login-page");

exports.PagePage = class PagePage {
  constructor(page, utilities) {
    this.page = page;
    this.utils = utilities;
    this.loginPage = new LoginPage(page, utilities);
    this.navPage = page.getByRole("link", { name: "Pages", exact: true });
    this.buttonCreatePage = page
      .getByRole("link", { name: "New page", exact: true })
      .first();
    this.pageTitle = page.getByPlaceholder("Page title");
    this.pageContent = page.locator(".koenig-editor__editor");
    this.retry = page.getByRole("link", { name: "Pages", exact: true });
    this.firstPageInList = page.locator("ol.gh-list li a").first();
    this.settings = page.locator('button[title="Settings"]');
    this.inputUrl = page.locator("#url");
    this.urlInSettings = page.locator('.ghost-url-preview');
    this.inputAuthor = page.locator('#author-list');
    this.removeAuthor = page.locator('type="search"');
    this.errorAuthor = page.locator('.for-select.form-group.error.ember-view');
  }
  
  async createPage(title, subtitle, url) {
    await this.loginPage.login(url, this.utilities);
    await this.navPage.click();
    await this.utils.takeScreenshot();
    await this.buttonCreatePage.click();
    await this.utils.takeScreenshot();
    await this.pageTitle.fill(title);
    await this.pageContent.fill(subtitle);
    await this.utils.takeScreenshot();
  }

  async returnToListPage() {
    await this.retry.click();
    await this.page.waitForTimeout(2000);
    await this.utils.takeScreenshot();
  }

  async enterfirstPageInList() {
    await this.firstPageInList.click();
    await this.page.waitForTimeout(2000);
    await this.utils.takeScreenshot();
  }

  async editUrlPage(url) {
    await this.settings.click();
    await this.inputUrl.fill(url);
    await this.utils.takeScreenshot();
  }

  async checkeditUrlPage(url) {
    const urlSettings =  await this.urlInSettings.textContent();
    await this.utils.takeScreenshot();
    expect(urlSettings).toContain(url);
  }

  async dropAuthor(){
    await this.settings.click();
    await this.inputAuthor.click();
    await this.page.waitForTimeout(1000); 
    await this.page.keyboard.press('Backspace');
    await this.inputAuthor.click();
    await this.utils.takeScreenshot();
  }

  async checkErrorAuthor(error){
    const errorAuthor = await this.errorAuthor.textContent();
    expect(errorAuthor).toContain(error);

  }


};
