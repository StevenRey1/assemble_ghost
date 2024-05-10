const fs = require('fs');
const path = require('path');

class Utilities {
  constructor(page, screenshotCounter) {
    this.page = page;
    this.screenshotCounter = screenshotCounter;
  }

  async takeScreenshot() {
    // Incrementar el contador y obtener el valor actual
    const currentCounter = this.screenshotCounter.increment();

    
    let screenshot= ''
    if(currentCounter<10){
      screenshot = `./screenshots/screenshots1/screenshot_${currentCounter}.png`; // Nombre único para la captura
    }else if(currentCounter<19){
      screenshot = `./screenshots/screenshots2/screenshot_${currentCounter-9}.png`; // Nombre único para la captura
    }else if(currentCounter<30){
      screenshot = `./screenshots/screenshots3/screenshot_${currentCounter-18}.png`; // Nombre único para la captura
    }else if(currentCounter<41){
      screenshot = `./screenshots/screenshots4/screenshot_${currentCounter-29}.png`; // Nombre único para la captura
    }



    // Tomar la captura de pantalla y guardarla en la carpeta correspondiente
    await this.page.screenshot({ path: screenshot });
  }
}

module.exports = Utilities;

