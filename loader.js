let babel = require("babel-core");
let loaderUtils = require('loader-utils');
let fs = require('fs');
let beautify = require('js-beautify').js_beautify;
let minify = require("babel-minify");


let replaceKlassAttributes = (s, ctx) => {
  let lines = beautify(s).split(/\r?\n/);
  
  console.log(JSON.stringify(lines, null, 2))
  for (let i = 0; i < lines.length; i++) {
    if (/^ *klass: /.test(lines[i])) {
      lines[i] = lines[i].replace(/( *)klass: (.*)$/, (line, spaces, expr) => {
        
        expr = '(' + expr.replace(/(^,)|(,$)/g, "") + ')';

        let warning = (item) => {
           return `console.warn('Warning: [klass-loader] no matching \`klass\` attribute for \\'' + ${ item } + '\\' in ${ ctx.resourcePath.replace(/.*src/, 'src') }')`;
        }
        let splitExpr = `(${expr}).split(/ +/).map(function(c){
                                                    if (typeof styles[c] === "undefined")
                                                      ${ warning('c') };
                                                    return styles[c] }).join(' ')`;
        let isUndefined = `(typeof styles[${expr}] === 'undefined' && ${expr}.length )`;

        // add warning inline because we can't append them since the variables will be out of scope
        return `${spaces}className: (${ splitExpr }),`
      });
    }
  }
  console.log( minify(lines.join('\n'), {
    mangle: {
      keepClassName: true
    }
  }).code);
  return minify(lines.join('\n'), {
    mangle: {
      keepClassName: true
    }
  }).code;

}


module.exports = function(source, map) {
  const options = loaderUtils.getOptions(this);

  if (source.indexOf("klass") !== -1) {
    if (fs.existsSync(this.context + "/styles.css")) {
      //console.log(source);
      source = replaceKlassAttributes(source, this);
      source = "import styles from './styles.css';\n" + source;
      //console.log(source);
    } else {
        throw new Error(`

klass-loader error:
    -> ${this.context}/styles.css not found when \`klass\` keyword used in associated file`);
    }
  }
 
  return source;
};
