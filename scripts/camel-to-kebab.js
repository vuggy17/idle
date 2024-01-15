const fs = require('fs');
const path = require('path');

function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function updateImports(fileContent) {
  // Use a regular expression to find and replace import paths
  return fileContent.replace(/from '.*';/g, (match) => {
    // Extract the import path and convert it to kebab-case
    const importPath = match.slice(6, -2);
    const kebabCasePath = camelToKebab(importPath);
    return `from '${kebabCasePath}';`;
  });
}

function renameFilesAndFolders(dir) {
  console.log(`Starting to rename files and folders in directory: ${dir}`);
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);
    if (fileStat.isDirectory()) {
      renameFilesAndFolders(filePath); // Recursively handle directories
      console.log(`Completed renaming directory: ${filePath}`);
    } else if (fileStat.isFile()) {
      const newFileName = camelToKebab(file);
      const newFilePath = path.join(dir, newFileName);
      fs.renameSync(filePath, newFilePath); // Rename the file

      // Read file content and update imports
      const fileContent = fs.readFileSync(newFilePath, 'utf8');
      const updatedContent = updateImports(fileContent);
      fs.writeFileSync(newFilePath, updatedContent); // Write the updated content
    }
  });
  console.log(`Completed renaming files and folders in directory: ${dir}`);
}

console.log('Script started.');
renameFilesAndFolders('./apps/idle.chat');
console.log('Script completed.');
