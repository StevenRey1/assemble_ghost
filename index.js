const fs = require('fs');
const path = require('path');
const compareImages = require("resemblejs/compareImages");
const config = require("./config.json");

const sourceFolder = "screenshots/screenshots1"; // Directorio con las imágenes originales
const targetFolder = "screenshots/screenshots2"; // Directorio con las imágenes modificadas
const sourceFolder2 = "screenshots/screenshots3"; // Directorio con las imágenes modificadas
const targetFolder2= "screenshots/screenshots4"; // Directorio con las imágenes modificadas
const resultsFolder = "./results"; // Directorio para guardar resultados
const options = { scaleToSameSize: true, ignore: "antialiasing" }; // Opciones de comparación

// Asegúrate de que el directorio de resultados exista
if (!fs.existsSync(resultsFolder)) {
    fs.mkdirSync(resultsFolder, { recursive: true });
}

// Función para comparar imágenes de dos carpetas y guardar resultados
async function compareImagesInFolders(sourceFolder, targetFolder, resultsFolder,numero_informe) {
    const resultInfo = {};
    let datetime = new Date().toISOString().replace(/:/g, ".");
    const sourceFiles = fs.readdirSync(sourceFolder); // Archivos en el directorio original
    const targetFiles = fs.readdirSync(targetFolder); // Archivos en el directorio modificado

    for (const fileName of sourceFiles) {
        if (targetFiles.includes(fileName)) {
            const sourcePath = path.join(sourceFolder, fileName);
            const targetPath = path.join(targetFolder, fileName);

            // Comparar las imágenes y guardar solo la imagen comparada
            const data = await compareImages(
                fs.readFileSync(sourcePath),
                fs.readFileSync(targetPath),
                options
            );

            // Guarda la imagen comparada en el directorio de resultados
            const resultComparePath = path.join(resultsFolder+`/compare_${numero_informe}`, `compare-${fileName}`);
            fs.writeFileSync(resultComparePath, data.getBuffer());

            // Guarda información sobre el análisis
            resultInfo[fileName] = {
                isSameDimensions: data.isSameDimensions,
                dimensionDifference: data.dimensionDifference,
                misMatchPercentage: data.misMatchPercentage,
                diffBounds: data.diffBounds,
                analysisTime: data.analysisTime,
            };
        }
    }

    // Guardar el informe en HTML
    fs.writeFileSync(`./results/report_${numero_informe}.html`, createReport(datetime, resultInfo,sourceFolder,targetFolder,numero_informe));
    fs.copyFileSync('./index.css', `./results/index.css`);

    return resultInfo;
}

// Comparar imágenes y mostrar resultados
(async () => {
    const results = await compareImagesInFolders(sourceFolder, targetFolder, resultsFolder,1);
    console.log("Comparación completada. Resultados:", results);
})();

(async () => {
    const results = await compareImagesInFolders(sourceFolder2, targetFolder2, resultsFolder,2);
    console.log("Comparación completada. Resultados:", results);
})();

function browser(id, info ,sourceFolder, targetFolder,numero_informe) {
    return `
    <div class="browser">
        <div class="header">
            <h2>Comparison: ${id}</h2>
            <p>MisMatch Percentage: ${info.misMatchPercentage}%</p>
            <p>Analysis Time: ${info.analysisTime} ms</p>
            <p>Dimension Difference: Width (${info.dimensionDifference.width}), Height (${info.dimensionDifference.height})</p>
        </div>
        <div class="imgline">
            <div class="imgcontainer">
                <span class="imgname">Before</span>
                <img src="/${sourceFolder}/${id}" alt="Before Image">
            </div>
            <div class="imgcontainer">
                <span class="imgname">After</span>
                <img src="/${targetFolder}/${id}" alt="After Image">
            </div>
            </div>
            <div class="imgcontainer">
                <span class="imgname">Compare</span>
                <img src="compare_${numero_informe}/compare-${id}" alt="Comparison Image">
            </div>
    </div>`;
}



function createReport(datetime, resInfo, sourceFolder, targetFolder,numero_informe) {
    return `
    <html>
        <head>
            <title>Visual Regression Test Report</title>
            <link rel="stylesheet" href="index.css">
        </head>
        <body>
            <h1>Visual Regression Test Report</h1>
            <p>Generated: ${datetime}</p>
            <div class="results">
                ${Object.keys(resInfo)
                    .map(id => browser(id, resInfo[id], sourceFolder, targetFolder,numero_informe)) // Corregir el uso de 'map'
                    .join('')}
            </div>
        </body>
    </html>`;
}