let babel = require("babel-core");
let loaderUtils = require('loader-utils');
let fs = require('fs');
let beautify = require('js-beautify').js_beautify;


let replaceKlassAttributes = (s, ctx) => {
  let lines = beautify(s).split(/\r?\n/);
  
  for (let i = 0; i < lines.length; i++) {
    if (/^ *klass: /.test(lines[i])) {
      lines[i] = lines[i].replace(/ *klass: (.*),/, (line, expr) => {
        expr = '(' + expr + ')';
        let warning = `(() => {throw new Error('Warning: no matching klass for "' + ${ expr } + '" in ${ ctx.resourcePath }')})()`;

        // add warning inline because we can't append them since the variables will be out of scope
        return ` className: styles[${expr}] + ((typeof styles[${expr}] === 'undefined' && ${expr}.length && ${warning}) ? '' : ''),`
      });
    }
  }
  console.log(JSON.stringify(lines, null, 2))
  return lines.join('\n');

}


module.exports = function(source, map) {
  const options = loaderUtils.getOptions(this);

  if (source.indexOf("klass: ") !== -1) {
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
 
  return `${source}`;
};
