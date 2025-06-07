const fs = require('fs');
const path = require('path');

// Caminho para a pasta onde os arquivos estão localizados
const directoryPath = path.join(__dirname, 'nahora-merchant/src');

// Função para remover imports duplicados
function removeDuplicateImports(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');

  const seenImports = new Set();
  const cleanedLines = lines.filter((line) => {
    if (line.startsWith('import ')) {
      if (seenImports.has(line)) {
        return false; // Remove a linha duplicada
      }
      seenImports.add(line);
    }
    return true;
  });

  const updatedContent = cleanedLines.join('\n');
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Removidos imports duplicados do arquivo: ${filePath}`);
}

// Função para percorrer os arquivos na pasta
function processDirectory(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);

    if (fs.statSync(fullPath).isDirectory()) {
      // Se for uma pasta, processa recursivamente
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx')) {
      // Se for um arquivo .jsx, processa
      removeDuplicateImports(fullPath);
    }
  });
}

// Executa o script
processDirectory(directoryPath);