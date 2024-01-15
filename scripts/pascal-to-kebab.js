const fs = require('fs');
const path = require('path');

function pascalToKebab(str) {
  // This regex will match the start of the string (^) and any uppercase letters ([A-Z])
  // The 'g' flag will make it a global search, so it finds all matches in the string
  return str.replace(/^([A-Z])|([A-Z])/g, (match, p1, p2, offset) => {
    // If it's the start of the string, convert to lowercase without a hyphen
    // Otherwise, add a hyphen before the lowercase letter
    return (offset === 0 ? '' : '-') + match.toLowerCase();
  });
}

function updateImports(fileContent) {
  // Use a regular expression to find and replace import paths
  return fileContent.replace(/from '.*';/g, (match) => {
    // Extract the import path and convert it to kebab-case
    const importPath = match.slice(6, -2);
    const kebabCasePath = pascalToKebab(importPath);
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
      // Rename the directory itself if needed
      const newDirName = pascalToKebab(file);
      const newDirPath = path.join(dir, newDirName);
      if (newDirName !== file) {
        fs.renameSync(filePath, newDirPath);
        console.log(`Renamed directory: ${file} to ${newDirName}`);
        renameFilesAndFolders(newDirPath); // Recursively handle directories
      } else {
        renameFilesAndFolders(filePath); // Recursively handle directories
      }
    } else if (fileStat.isFile()) {
      const newFileName = pascalToKebab(file);
      const newFilePath = path.join(dir, newFileName);
      fs.renameSync(filePath, newFilePath); // Rename the file

      // Read file content and update imports
      const fileContent = fs.readFileSync(newFilePath, 'utf8');
      const updatedContent = updateImports(fileContent);
      fs.writeFileSync(newFilePath, updatedContent); // Write the updated content
      console.log(`Renamed file: ${file} to ${newFileName}`);
    }
  });
  console.log(`Completed renaming files and folders in directory: ${dir}`);
}

console.log('Script started.');
renameFilesAndFolders('./apps/idle.chat');
console.log('Script completed.');
