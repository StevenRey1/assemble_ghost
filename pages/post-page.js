const { expect } = require("playwright/test");
const { LoginPage } = require("./login-page");

exports.PostPage = class PostPage {
  constructor(page, utilities) {
    this.page = page;
    this.utils = utilities;
    this.loginPage = new LoginPage(page, utilities);
    this.navPost = page.getByRole("link", { name: "Posts", exact: true });
    this.buttonCreatePost = page
      .getByRole("link", { name: "New post", exact: true })
      .first();
    this.postTitle = page.getByPlaceholder("Post title");
    this.postContent = page.locator(".koenig-editor__editor");
    this.retry = page.getByRole("link", { name: "Posts", exact: true });
    this.firstPostInList = page.locator("ol.posts-list a").first();
    this.publishButton = page.getByRole('button', { name: 'Publish', exact: true });
    this.alertTitleLonger = page.locator('.gh-alert.gh-alert-red .gh-alert-content');
  }
  
  async createPost(title, subtitle, url) {
    await this.loginPage.login(url, this.utilities);
    await this.navPost.click();
    await this.utils.takeScreenshot();
    await this.buttonCreatePost.click();
    await this.utils.takeScreenshot();
    await this.postTitle.fill(title);
    await this.postContent.fill(subtitle);
    await this.utils.takeScreenshot();
  }

  async returnToListPost() {
    await this.retry.click();
    await this.page.waitForTimeout(2000);
    await this.utils.takeScreenshot();
  }

  async enterfirstPostInList() {
    await this.firstPostInList.click();
    await this.page.waitForTimeout(2000);
    await this.utils.takeScreenshot();
  }

  async editTitleInPost(title) {
    await this.postTitle.fill(title);
    await this.utils.takeScreenshot();
  }

  async checkTitlePage(title) {
    await this.postContent.click();
    await this.page.waitForTimeout(1000); 
    const pageTitle = await this.page.title();
    // Verificar si contiene una subcadena específica
    expect(pageTitle).toContain(title); // Coincidencia parcial sin RegExp
  }


  async checkErrorTitleLarger(expectedError) {
    try {
      // Intentar hacer clic en el botón del old
      if (await this.page.getByRole('button', { name: 'Publish' }).isVisible()) { // Verifica si es visible
        await this.page.getByRole('button', { name: 'Publish' }).click(); // Haz clic si es visible
        await this.page.waitForTimeout(500); 
        await this.utils.takeScreenshot();
      }
      
      
      // Hacer clic en el primer botón de publicación
      await this.publishButton.click();
  
      // Esperar a que el mensaje de error aparezca
      await this.page.waitForTimeout(500); 
  
      // Tomar una captura de pantalla
      await this.utils.takeScreenshot();
  
      // Obtener el texto del mensaje de error
      const alertText = await this.page.locator('.gh-alert.gh-alert-red .gh-alert-content').textContent();
  
      // Verificar que el mensaje de error contiene el texto esperado
      expect(alertText).toContain(expectedError);
    } catch (error) {
      // Manejo de errores
      console.error('An error occurred:', error); // Registra el error para depuración
      throw error; // Puedes lanzar el error si necesitas terminar la prueba o dejar que continúe
    }
  }
  


};
