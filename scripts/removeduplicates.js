const fs = require('fs');

// Function to load JSON data
function loadJson(filePath) {
  const rawData = fs.readFileSync(filePath,'utf8');
  return JSON.parse(rawData);
}

// Function to remove duplicates based on a unique key (e.g., 'id' or 'name')
function removeDuplicates(data,key) {
  const uniqueData = [];
  const seen = new Set();

  data.forEach(item => {
    const value = item[key];
    if (!seen.has(value)) {
      seen.add(value);
      if (!item.name.includes('REMOVE')) {
        let uniqueItem = {
          icon: item.name.toLowerCase().split(' ').join('').split('.').join(''),
          ...item,
          website: item.website.toLowerCase(),
        }
        uniqueData.push(uniqueItem);
      }
    }
  });

  return uniqueData;
}

// Function to save JSON data to a file
function saveJson(filePath,data) {
  fs.writeFileSync(filePath,JSON.stringify(data,null,2));
  console.log(`Data saved to ${filePath}`);
}

function sortData(data) {
  return data.sort((a,b) => a.name > b.name ? 1 : -1);
}

// Main function
function processJson(inputFile,outputFile,uniqueKey) {
  const jsonData = loadJson(inputFile);
  // const cleanedData = removeDuplicates(jsonData,uniqueKey);
  const cleanedData = sortData(jsonData);
  saveJson(outputFile,cleanedData);
}

// Run the function
processJson('list.json','output.json','name');