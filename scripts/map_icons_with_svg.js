const fs = require('fs');
const path = require('path');

// Paths for folders and JSON files
const jsonFilePath = './original.json'; // Path to the original JSON file
const whiteFolderPath = './White'; // Path to the White folder for light icons
const blackFolderPath = './Black'; // Path to the Black folder for dark icons
const outputJsonFilePath = './updated.json'; // Path for the new JSON file

// Function to read SVG content
function getSvgContent(filePath) {
  try {
    return fs.readFileSync(filePath,'utf8');
  } catch (error) {
    console.error(`Error reading SVG file at ${filePath}:`,error);
    return null;
  }
}

// Main function to process JSON and add SVG data
function appendIconsToJSON() {
  // Read the original JSON file
  fs.readFile(jsonFilePath,'utf8',(err,data) => {
    if (err) {
      console.error('Error reading JSON file:',err);
      return;
    }

    // Parse the JSON data
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing JSON:',error);
      return;
    }

    // Process each entry in JSON data
    jsonData = jsonData.map(item => {
      const baseName = item.name; // Assuming each object has a unique `name` that matches the SVG filename

      // Define paths for the SVG files
      const whiteIconPath = path.join(whiteFolderPath,`${baseName}.svg`);
      const blackIconPath = path.join(blackFolderPath,`${baseName}.svg`);

      // Get SVG contents
      const lightSvg = getSvgContent(whiteIconPath);
      const darkSvg = getSvgContent(blackIconPath);

      // Add the `icon` property with light and dark SVGs if available
      item.icon = {
        light: lightSvg || 'Icon not found',
        dark: darkSvg || 'Icon not found',
      };

      return item;
    });

    // Write the updated JSON data to a new file
    fs.writeFile(outputJsonFilePath,JSON.stringify(jsonData,null,2),'utf8',(err) => {
      if (err) {
        console.error('Error writing updated JSON file:',err);
      } else {
        console.log('Updated JSON file saved successfully!');
      }
    });
  });
}

// Run the function
appendIconsToJSON();
