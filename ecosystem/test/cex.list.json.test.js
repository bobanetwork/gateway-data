
const fs = require('fs');
const path = require('path');

// Define the expected structure
const expectedStructure = {
  "icon": {
    "light": expect.any(String),
    "dark": expect.any(String)
  },
  "name": expect.any(String),
  "link": expect.any(String),
  "visible": expect.any(Boolean),
  "pairName": expect.any(String),
}

// Load the JSON data
const ecosystemData = JSON.parse(
  fs.readFileSync(path.join(__dirname,'../cex.list.json'),'utf8')
);

describe('Validate Trade application List',() => {
  it('should have correct structure for json!',() => {
    ecosystemData.forEach(element => {
      expect(element).toMatchObject(expectedStructure)
      expect(element.icon.light).toMatch(/\.svg$/);
      expect(element.icon.dark).toMatch(/\.svg$/);
    });
  });
})
