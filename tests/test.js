// test.spec.js
const { test } = require('@playwright/test');
const { PostPage } = require('../pages/post-page.js');
const {PagePage} = require('../pages/page-page.js')
const Utilities = require('../pages/utilities.js');

// Contador global para mantener estado entre pruebas
let globalCounter = 1;

const loginUrls = [
  { name: 'New Ghost', url: 'https://ghost-ur1e.onrender.com/ghost/#/signin' },
  { name: 'Old Ghost', url: 'https://ghost-4uyg.onrender.com/ghost/#/signin' },
];

// Fixture para mantener estado del contador
test.use({
  screenshotCounter: async ({}, use) => {
    // Usa el contador global
    await use({
      increment: () => globalCounter++, // Incrementar el contador global
      getCurrent: () => globalCounter, // Obtener el valor actual del contador global
    });
  },
});

test.describe('Edit post title and verify that change the title page', () => {
  loginUrls.forEach((loginUrl) => {
    test(`Edit post with ${loginUrl.name}`, async ({ page, screenshotCounter }) => {
      // Pasar el fixture al constructor de Utilities
      const utilities = new Utilities(page, screenshotCounter);
      const postPage = new PostPage(page, utilities);
      await postPage.createPost('Post title', 'Post content', loginUrl.url);
      await postPage.returnToListPost();
      await postPage.enterfirstPostInList();
      await postPage.editTitleInPost('Title edited');
      await postPage.checkTitlePage('Title edited');
     
    });
  });
}); 

 test.describe('Edit post with title larger than 255 characters', () => {
  loginUrls.forEach((loginUrl) => {
    test(`Edit post with ${loginUrl.name}`, async ({ page, screenshotCounter }) => {
      const utilities = new Utilities(page, screenshotCounter);
      const postPage = new PostPage(page, utilities);

      // Crear una cadena de 256 caracteres
      const longTitle = 'a'.repeat(256); // Generar cadena de 256 caracteres

      await postPage.createPost('Post title', 'Post content', loginUrl.url);
      await postPage.returnToListPost();
      await postPage.enterfirstPostInList(); // Revisa el nombre del método para consistencia

      // Convertir longTitle a una cadena explícitamente
      await postPage.editTitleInPost(String(longTitle)); // O usa `${longTitle}` para una plantilla de cadena
      await postPage.checkErrorTitleLarger('Title cannot be longer than 255 characters');
    });
  });
});  

 test.describe('Edit page URL', () => {
  loginUrls.forEach((loginUrl) => {
    test(`Edit page with ${loginUrl.name}`, async ({ page, screenshotCounter }) => {
      const utilities = new Utilities(page, screenshotCounter);
      const pagePage = new PagePage(page, utilities);
      await pagePage.createPage('Page title', 'Page content', loginUrl.url);
      await pagePage.returnToListPage();
      await pagePage.enterfirstPageInList(); // Revisa el nombre del método para consistencia
      await pagePage.editUrlPage('new-url');
      await pagePage.checkeditUrlPage('new-url');
    });
  });
}); 


 test.describe('Edit page without author', () => {
  loginUrls.forEach((loginUrl) => {
    test(`Edit page with ${loginUrl.name}`, async ({ page, screenshotCounter }) => {
      const utilities = new Utilities(page, screenshotCounter);
      const pagePage = new PagePage(page, utilities);
      await pagePage.createPage('Page title', 'Page content', loginUrl.url);
      await pagePage.returnToListPage();
      await pagePage.enterfirstPageInList(); // Revisa el nombre del método para consistencia
      await pagePage.dropAuthor();
      await pagePage.checkErrorAuthor('At least one author is required.');
    });
  });
}); 