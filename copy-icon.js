const fs = require('fs');
fs.copyFileSync("C:\\Users\\mohid\\.gemini\\antigravity-ide\\brain\\dae8a89c-6404-4c25-bdbc-881dde1c409c\\mehndi_favicon_1783365659900.png", "b:\\Projects\\Mehndi Artistry\\app\\icon.png");
try {
  fs.unlinkSync("b:\\Projects\\Mehndi Artistry\\app\\icon.svg");
} catch(e) {}
console.log("Copied successfully");
