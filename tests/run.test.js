const run = require('../loader.js');
const fs = require('fs');
let minify = require("babel-minify");


function isValidJs(testString) {
  var isValid = true;
  try {
    minify(testString);
  }
  catch(e) {
    isValid = false;
  }
  return isValid;
}


let context = {
    context: 'tests',
    resourcePath: 'foo/bar/Component.js'
};

describe('run', () => {
  it('should compile a simple string', () => {
    var text = fs.readFileSync("tests/run.js", "utf8");
    
    try {
      text = run.call(context, text); 
    } catch (e) {
      console.error(e);
    }

    expect(isValidJs(text)).toBe(true);
  });

  // it('should compile a simple variable', () => {
  //   expect(run(1, 2)).toBe(3);
  // });

  // it('should compile a simple expression', () => {
  //   expect(run(1, 2)).toBe(3);
  // });

  // it('should compile a complex expression', () => {
  //   expect(run(1, 2)).toBe(3);
  // });

  // it('should compile a really long expression', () => {
  //   expect(run(1, 2)).toBe(3);
  // });

  // it('should compile multiple classnames', () => {
  //   expect(run(1, 2)).toBe(3);
  // });

  // it('should work with className attribute', () => {
  //   expect(run(1, 2)).toBe(3);
  // });

  // it('should compile minified babel', () => {
  //   expect(run(1, 2)).toBe(3);
  // });

  // it('should not contain warnings if minified', () => {
  //   expect(run(1, 2)).toBe(3);
  // });

  // it('should contain warnings if not minified', () => {
  //   expect(run(1, 2)).toBe(3);
  // });

  // it('should fail without corresponding stylesheet', () => {
  //   expect(run(1, 2)).toBe(3);
  // });

  // it('should minify result when input is minified', () => {
  //   expect(run(1, 2)).toBe(3);
  // });

  // it('should not minify result when input is not minified', () => {
  //   expect(run(1, 2)).toBe(3);
  // });

  // it('should not modify input when it does not mention \'klass\'', () => {
  //   expect(run(1, 2)).toBe(3);
  // });
});