const fs = require('fs');
const path = require('path');

function renameFiles(directory) {
  fs.readdir(directory,(err,files) => {
    if (err) {
      console.error("Error reading the directory:",err);
      return;
    }

    files.forEach(file => {
      const ext = path.extname(file); // Get file extension
      const baseName = path.basename(file,ext); // Get the base filename (without extension)

      // Create the new filename: lowercase, remove "logo", replace spaces with underscores
      const newBaseName = baseName
        .toLowerCase() // Convert to lowercase
        .split(" ").join("") // split by space and join by ';
        .replace(/black/gi,"") // Remove "logo" if present (case insensitive)
        .replace(/white/gi,"") // Remove "logo" if present (case insensitive)
        // .replace(/\s+/g,"_") // Replace spaces with underscores
        .replace(/_+/g,"_") // Remove any consecutive underscores
        .replace(/_$/,"") // Remove trailing underscore if present
        .trim();

      const newFileName = `${newBaseName}${ext}`;
      const oldPath = path.join(directory,file);
      const newPath = path.join(directory,newFileName);

      // Rename the file if the new name is different
      if (file !== newFileName) {
        fs.rename(oldPath,newPath,err => {
          if (err) {
            console.error(`Error renaming ${file} to ${newFileName}:`,err);
          } else {
            console.log(`Renamed: ${file} -> ${newFileName}`);
          }
        });
      }
    });
  });
}

// Usage: pass the directory path
renameFiles('./trade_icons/black'); // Replace './your_directory' with your target folder path
renameFiles('./trade_icons/white'); // Replace './your_directory' with your target folder path
