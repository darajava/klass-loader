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

describe('run', () => {
  it('should compile a simple string', () => {
    var text = fs.readFileSync(context.context + "/string.js", "utf8");
    
    try {
      text = run.call(context, text); 
    } catch (e) {
      console.error(e);
    }

    expect(isValidJs(text)).toBe(true);
  });

  it('should compile a simple variable', () => {
    var text = fs.readFileSync(context.context + "/variable.js", "utf8");
    
    try {
      text = run.call(context, text); 
    } catch (e) {
      console.error(e);
    }

    expect(isValidJs(text)).toBe(true);
  });

  it('should compile a simple expression', () => {
    var text = fs.readFileSync(context.context + "/expression.js", "utf8");
    
    try {
      text = run.call(context, text); 
    } catch (e) {
      console.error(e);
    }

    expect(isValidJs(text)).toBe(true);
  });

  it('should compile a complex expression', () => {
    var text = fs.readFileSync(context.context + "/complexExpression.js", "utf8");
    
    try {
      text = run.call(context, text); 
    } catch (e) {
      console.error(e);
    }

    expect(isValidJs(text)).toBe(true);
  });

  it('should compile a really long expression', () => {
    var text = fs.readFileSync(context.context + "/longExpression.js", "utf8");
    
    try {
      text = run.call(context, text); 
    } catch (e) {
      console.error(e);
    }

    expect(isValidJs(text)).toBe(true);
  });

  it('should compile multiple classnames', () => {
    var text = fs.readFileSync(context.context + "/multipleClassNames.js", "utf8");
    
    try {
      text = run.call(context, text); 
    } catch (e) {
      console.error(e);
    }

    expect(isValidJs(text)).toBe(true);
  });

  it('should work with className attribute', () => {
    var text = fs.readFileSync(context.context + "/withClassNameAttribute.js", "utf8");
    
    try {
      text = run.call(context, text); 
    } catch (e) {
      console.error(e);
    }

    expect(isValidJs(text)).toBe(true);
  });

  it('should compile minified babel', () => {
    var text = fs.readFileSync(context.context + "/minified.js", "utf8");
    
    try {
      text = run.call(context, text); 
    } catch (e) {
      console.error(e);
    }

    expect(isValidJs(text)).toBe(true);
  });

  it('should not contain warnings if minified', () => {
    var text = fs.readFileSync(context.context + "/minified.js", "utf8");
    
    try {
      text = run.call(context, text); 
    } catch (e) {
      console.error(e);
    }

    expect(text.indexOf('console.warn') !== -1).toBe(false);
  });

  it('should contain warnings if not minified', () => {
    var text = fs.readFileSync(context.context + "/expression.js", "utf8");
    
    try {
      text = run.call(context, text); 
    } catch (e) {
      console.error(e);
    }

    expect(text.indexOf('console.warn') !== -1).toBe(true);
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
    var text = fs.readFileSync(context.context + "/minified.js", "utf8");
    
    try {
      text = run.call(context, text); 
    } catch (e) {
      console.error(e);
    }      

    expect(text.split(/\r?\n/).length <= 3).toBe(true);
  });

  it('should not minify result when input is not minified', () => {
    var text = fs.readFileSync(context.context + "/expression.js", "utf8");
    
    try {
      text = run.call(context, text); 
    } catch (e) {
      console.error(e);
    }

    expect(text.split(/\r?\n/).length > 3).toBe(true);
  });

  it('should not modify input when it does not mention \'klass\'', () => {
    var text = fs.readFileSync(context.context + "/noKlass.js", "utf8");
    
    let textOut;

    try {
      textOut = run.call(context, text); 
    } catch (e) {
      console.error(e);
    }

    expect(text).toEqual(textOut);
  });
});