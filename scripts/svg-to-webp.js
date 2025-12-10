// svg-to-webp.js
const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const {glob} = require('glob');

// Configuration
const config = {
  // Quality of WebP (0-100)
  quality: 90,
  // Recursively search through these directories
  directories: ['./ecosystem/icons/new'],
  // Number of conversions to run in parallel
  concurrency: 4
};

/**
 * Converts a single SVG file to WebP format
 * @param {string} filePath - Path to the SVG file
 * @returns {Promise<string>} - Path to the created WebP file
 */
async function convertSvgToWebp(filePath) {
  try {
    const file = path.basename(filePath);          // Alchemy_Light.svg
    const base = file.replace(/_(Light|dark)\.svg$/i,""); // Alchemy
    const variant = /_Light/i.test(file) ? "light" : "dark";

    const outputFolder = path.join("ecosystem","icons",variant); // e.g. output/light
    await fs.mkdir(outputFolder,{recursive: true});

    const webpPath = path.join(outputFolder,`${base.toLowerCase()}.webp`);
    const svgPath = path.join(outputFolder,`${base.toLowerCase()}.svg`);

    const svgBuffer = await fs.readFile(filePath);

    await fs.writeFile(svgPath,svgBuffer);

    await sharp(svgBuffer)
      .webp({ quality: config.quality })
      .toFile(webpPath);

    console.log(`✅ Converted & Copied: ${file} → ${webpPath} & ${svgPath}`);
    return webpPath;

  } catch (error) {
    console.error(`❌ Error converting ${filePath}:`, error.message);
    throw error;
  }
}
/**
 * Process files in chunks to control concurrency
 * @param {Array} items - Array of items to process
 * @param {Function} fn - Function to apply to each item
 * @param {number} concurrency - Max number of parallel operations
 * @returns {Promise<Array>} - Array of results
 */
async function processInChunks(items, fn, concurrency) {
  const results = [];
  
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    const chunkPromises = chunk.map(item => fn(item));
    
    // Wait for the current chunk to complete before moving to the next
    const chunkResults = await Promise.allSettled(chunkPromises);
    
    // Filter out and log any rejected promises
    chunkResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error(`Failed to process ${chunk[index]}: ${result.reason}`);
      }
    });
  }
  
  return results;
}

/**
 * Find all SVG files in the specified directories
 * @returns {Promise<Array<string>>} - Array of file paths
 */
async function findSvgFiles() {
  try {
    const patterns = config.directories.map(dir => `${dir}/**/*.svg`);
    console.log('🔍 Searching with patterns:',patterns);
    
    const files = await glob(patterns,{nodir: true});
    console.log('Found files:',files);
    return files;
  } catch (error) {
    console.error('Error finding SVG files:',error);
    throw error;
  }
}

/**
 * Main function to convert all SVG files to WebP
 */
async function main() {
  try {
    console.log('🔍 Searching for SVG files...');
    const svgFiles = await findSvgFiles();
    
    if (svgFiles.length === 0) {
      console.log('No SVG files found in the specified directories.');
      return;
    }
    
    console.log(`🚀 Found ${svgFiles.length} SVG files. Starting conversion with ${config.concurrency} parallel processes...`);
    
    const startTime = Date.now();
    const results = await processInChunks(svgFiles, convertSvgToWebp, config.concurrency);
    const endTime = Date.now();
    
    const successCount = results.filter(Boolean).length;
    console.log('\n✨ Conversion Summary:');
    console.log(`- Total SVG files: ${svgFiles.length}`);
    console.log(`- Successfully converted: ${successCount}`);
    console.log(`- Failed: ${svgFiles.length - successCount}`);
    console.log(`- Time taken: ${((endTime - startTime) / 1000).toFixed(2)}s`);
    
  } catch (error) {
    console.error('Error in conversion process:', error);
    process.exit(1);
  }
}

// Execute the main function
main().catch(console.error);