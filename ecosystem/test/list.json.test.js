
const fs = require('fs');
const path = require('path');

// Define the expected structure
const expectedStructure = {
  "icon": {
    "light": expect.any(String),
    "dark": expect.any(String)
  },
  "name": expect.any(String),
  "website": expect.any(String),
  "link": expect.any(String),
  "description": expect.any(String),
  "type": expect.any(String),
  "visible": expect.any(Boolean)
}

// Allowed types
const allowedTypes = [
  'Tools',
  'Oracles',
  'Decentralized finance',
  'Wallet',
  'Centralized exchange',
  'Onramp',
  'Bridge',
  'NFT',
  'DAO',
  'Gaming'
];

// Load the JSON data
const ecosystemData = JSON.parse(
  fs.readFileSync(path.join(__dirname,'../list.json'),'utf8')
);

describe('Validate Ecosystem List',() => {
  it('should have correct structure for json!',() => {
    ecosystemData.forEach(element => {
      expect(element).toMatchObject(expectedStructure)
      expect(allowedTypes).toContain(element.type)
      expect(element.icon.light).toMatch(/\.svg|.jpg$/);
      expect(element.icon.dark).toMatch(/\.svg|.jpg$/);
    });
  });
})
