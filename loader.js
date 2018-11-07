let babel = require("babel-core");
let loaderUtils = require('loader-utils');
let fs = require('fs');
let beautify = require('js-beautify').js_beautify;
let minify = require("babel-minify");

// Scrolls up and down on the same level as the codeblock with 'klass'
// Tests for 'className' and if found will delete the className attribute
// and return its value
let findClassNames = (lineno, spaces, lines) => {
  let spaceRE = new RegExp('^' + spaces);
  let classNameRe = new RegExp('^' + spaces + "className: (.*)");

  // uncomment to visualise
  // console.log('-----')
  // for (let i = lineno - 7; i < lineno + 7; i++) {
  //   console.log('SNIP findClassNames:' + (i == lineno ? '-->' : '  '), lines[i]);
  // }

  // this loop is intentional
  // go forward in lines until we come accross shallower indentation
  do {} while (spaceRE.test(lines[++lineno]));

  // go backwards in lines so we go through all properties in the object
  while (spaceRE.test(lines[--lineno])) {
    // if we find an additional classname attribute in the object
    if (classNameRe.test(lines[lineno])) {
      // return the expression found in it and return it without the comma
      return lines[lineno].replace(classNameRe, (line, expr) => {
        // if expression is multiline, get it as below
        if (!expr.endsWith(',')) {
          expr += getRestOfExpression(lineno, spaces, lines);
        }
        lines[lineno] = ''; // delete the line containing the remaining classes
        
        return expr.replace(/,$/, '');
      });
    }
  }
 
  return '""'; 
}; 

// if the expression is more complicated, such as a function returning a string,
// then the beautifier will put it on more than one line. We can check for this
// by testing if the source line doesn't end in a comma and get the rest of the expression
// by adding all proceeding source lines which are on a deeper or equal indentation level
let getRestOfExpression = (lineno, spaces, lines) => {
  let spaceRE = new RegExp('^' + spaces);
  let spaceREExact = new RegExp('^' + spaces + '[^ ]');

  let rest = '';
 
  // uncomment to visualise
  // console.log('-----')
  // for (let i = lineno - 7; i < lineno + 7; i++) {
  //   console.log('SNIP getRestOfExpression:' + (i == lineno ? '-->' : '   '), lines[i]);
  // }

  // if the next line has less spaces in it, then we are just at the end of the object
  if (spaceRE.test(lines[++lineno])) {
    do {
      // append the whole line, since is is just the next part of the unterminated expression
      rest = rest + lines[lineno];
      // and delete line
      lines[lineno] = '';
    } while (typeof lines[lineno++] !== 'undefined' && !spaceREExact.test(lines[lineno]));
    // loop until the line ends with a comma,
    // then add it:
    rest += lines[lineno].replace(/,$/, '');
    lines[lineno] = '';
  }

  return rest;
}

let buildReplacementSourceLine = (expr, ctx, lineno, spaces, lines, isDev, customAttr) => {
  expr = '(' + expr.replace(/,$/, "") + ')';

  let warning = (item) => {
    if (!isDev) return '';
    return `
      if (c.length && typeof __k_styles[c] === "undefined") {
        console.error(
          'Warning: [klass-loader] no matching \`${ customAttr }\` attribute` + 
            ` for \\'' + ${ item } + '\\' in ${ ctx.resourcePath.replace(/.*src/, 'src') }'
        )
      }
    `
  };

  let splitExpr = `
    ${expr}.split(/ +/).map(function(c) {
        ${ warning('c') };
      return __k_styles[c];
    }).join(' ')
  `;


  return `${spaces}className: (${ splitExpr } + ' ' + ${ findClassNames(lineno, spaces, lines) }),`
}

let replaceKlassAttributes = (s, ctx, isDev, customAttr) => {
  // if the file is not minified, we can assume we're on development mode
  if (isDev === 'auto') {
    isDev = s.split(/\r?\n/).length > 3;
  } else {
    isDev = isDev === 'true';
  }

  let lines = beautify(s).split(/\r?\n/);
  
  let attrRE = new RegExp("( *)" + customAttr + ": (.*)$");

  for (let i = 0; i < lines.length; i++) {
    if (attrRE.test(lines[i])) {
      lines[i] = lines[i].replace(attrRE, (line, spaces, expr) => {
        if (!expr.endsWith(',')) {
          expr += getRestOfExpression(i, spaces, lines);
        }

        return buildReplacementSourceLine(expr, ctx, i, spaces, lines, isDev, customAttr)
      });
    }
  }

  // if the code does not appear to be minified, return unminified code
  if (isDev) {
    return lines.join('\n');
  }

  // otherwise return it minified
  return minify(lines.join('\n'), {
    mangle: {
      keepClassName: true
    }
  }).code;

}

module.exports = function(source, map) {
  //return source;
  const options = loaderUtils.getOptions(this);

  let extension = (options && options.extension) ? options.extension : 'css';
  let isDev = (options && options.isDev) ? options.isDev : 'auto';
  let customAttr = (options && options.customAttr) ? options.customAttr : 'klass';

  if (source.indexOf(`${customAttr}:`) !== -1) {
    if (fs.existsSync(this.context + "/styles." + extension)) {
      //console.log(source);
      source = replaceKlassAttributes(source, this, isDev, customAttr);
      source = "var __k_styles = require('./styles." + extension + "');\n" + source;
      //console.log(source);
    } else {
        throw new Error(`

klass-loader error:
    -> ${ this.context }/styles.${ extension } not found when \`${ customAttr }\` keyword used in associated file`);
    }
  }

  if (this.callback)
    return this.callback(null, source, map)
  else
    return source;
};
