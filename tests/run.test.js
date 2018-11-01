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
    context: 'tests/code/compiled',
    resourcePath: 'foo/bar/Component.js'
};

function returnOutputFromFile(filename) {
    let text = fs.readFileSync(context.context + "/" + filename, "utf8");
    
    try {
      return run.call(context, text); 
    } catch (e) {
      console.error(e);
    }
}

describe('run', () => {
  it('should compile a simple string', () => {
    let text = returnOutputFromFile('string.js');

    expect(isValidJs(text)).toBe(true);
  });

  it('should compile a simple variable', () => {
    let text = returnOutputFromFile('variable.js');

    expect(isValidJs(text)).toBe(true);
  });

  it('should compile a simple expression', () => {
    let text = returnOutputFromFile('expression.js');

    expect(isValidJs(text)).toBe(true);
  });

  it('should compile a complex expression', () => {
    let text = returnOutputFromFile('complexExpression.js');

    expect(isValidJs(text)).toBe(true);
  });

  it('should compile a really long expression', () => {
    let text = returnOutputFromFile('longExpression.js');

    expect(isValidJs(text)).toBe(true);
  });

  it('should compile multiple classnames', () => {
    let text = returnOutputFromFile('multipleClassNames.js');

    expect(isValidJs(text)).toBe(true);
  });

  it('should compile with className attribute', () => {
    let text = returnOutputFromFile('withClassNameAttribute.js');

    expect(isValidJs(text)).toBe(true);
  });

  it('should compile minified babel', () => {
    let text = returnOutputFromFile('minified.js')

    expect(isValidJs(text)).toBe(true);
  });

  it('should not contain warnings if minified', () => {
    let text = returnOutputFromFile('minified.js')

    expect(text.indexOf('console.warn') !== -1).toBe(false);
  });

  it('should contain warnings if not minified', () => {
    let text = returnOutputFromFile('expression.js')

    expect(text.indexOf('console.error') !== -1).toBe(true);
  });

  it('should fail without corresponding stylesheet', () => {
    let contextNoStyle = {
        context: 'tests/code/compiled/noStyle',
        resourcePath: 'foo/bar/Component.js'
    };

    var text = fs.readFileSync(context.context + "/minified.js", "utf8");

    expect(() => run.call(contextNoStyle, text)).toThrow();
  });

  it('should minify result when input is minified', () => {
    let text = returnOutputFromFile('minified.js')

    expect(text.split(/\r?\n/).length <= 3).toBe(true);
  });

  it('should not minify result when input is not minified', () => {
    let text = returnOutputFromFile('expression.js')

    expect(text.split(/\r?\n/).length > 3).toBe(true);
  });

  it('should not modify input when it does not mention \'klass\'', () => {
    let oldText = fs.readFileSync(context.context + "/noKlass.js", "utf8");
    let text = returnOutputFromFile('noKlass.js')
    
    expect(text).toEqual(oldText);
  });
});