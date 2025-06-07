const fs = require('fs');
const path = require('path');

// Caminho para a pasta onde os arquivos estão localizados
const directoryPath = path.join(__dirname, 'nahora-merchant/src');

// Função para verificar e adicionar o import
function addReactImport(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Verifica se já existe "import React from 'react';"
  if (fileContent.includes("import React from 'react';")) {
    console.log(`O arquivo ${filePath} já possui o import.`);
    return;
  }

  // Verifica se há outras importações no arquivo
  if (fileContent.match(/^import .* from .*/m)) {
    const updatedContent = `import React from 'react';\n${fileContent}`;
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Adicionado "import React from 'react';" ao arquivo ${filePath}`);
  } else {
    console.log(`Nenhuma importação encontrada no arquivo ${filePath}. Ignorado.`);
  }
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
      addReactImport(fullPath);
    }
  });
}

// Executa o script
processDirectory(directoryPath);