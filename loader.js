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

  for (let i = lineno - 10; i < lineno + 10; i++) {
    // uncomment to visualise
    console.log('SNIP: ', lines[i]);
  }

  // this loop is intentional
  do {} while (spaceRE.test(lines[++lineno]));

  while (spaceRE.test(lines[--lineno])) {
    if (classNameRe.test(lines[lineno])) {
      return lines[lineno].replace(classNameRe, (line, expr) => {
        lines[lineno] = ''; // delete the line containing the remaining classes
        
        return expr.replace(/,$/, '');
      });
    }
  }
 
  return '""'; 
}; 

let replaceKlassAttributes = (s, ctx) => {
  let lines = beautify(s).split(/\r?\n/);
  
  console.log(JSON.stringify(lines, null, 2))
  for (let i = 0; i < lines.length; i++) {
    if (/^ *klass: /.test(lines[i])) {
      lines[i] = lines[i].replace(/( *)klass: (.*)$/, (line, spaces, expr) => {
        
        expr = '(' + expr.replace(/,$/g, "") + ')';

        let warning = (item) => {
           return `console.warn('Warning: [klass-loader] no matching \`klass\` attribute for \\'' + ${ item } + '\\' in ${ ctx.resourcePath.replace(/.*src/, 'src') }')`;
        }

        let splitExpr = `(${expr}).split(/ +/).map(function(c){
                                                    if (typeof __k_styles[c] === "undefined")
                                                      ${ warning('c') };
                                                    return __k_styles[c] }).join(' ')`;

        return `${spaces}className: (${ splitExpr } + ' ' + ${ findClassNames(i, spaces, lines) }),`
      });
    }
  }

  // if the code does not appear to be minified
  if (s.split(/\r?\n/).length > 5) {
    return lines.join('\n');
  }

  return minify(lines.join('\n'), {
    mangle: {
      keepClassName: true
    }
  }).code;

}

module.exports = function(source, map) {
  //return source;
  const options = loaderUtils.getOptions(this);

  if (source.indexOf("klass:") !== -1) {
    if (fs.existsSync(this.context + "/styles.css")) {
      //console.log(source);
      source = replaceKlassAttributes(source, this);
      source = "import __k_styles from './styles.css';\n" + source;
      //console.log(source);
    } else {
        throw new Error(`

klass-loader error:
    -> ${this.context}/styles.css not found when \`klass\` keyword used in associated file`);
    }
  }

  return source;
};
