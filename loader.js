var babel = require("babel-core");
var loaderUtils = require('loader-utils');
var fs = require('fs');
var beautify = require('js-beautify').js_beautify;

function replaceKlassAttributes(source) {
  var source = (beautify(source));

  var lines = source.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (/^ *klass: /.test(lines[i])) {
      lines[i] = lines[i].replace(/ *klass: (.*),/, function(a, b) {
        return ` className: styles[${b}],`
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
      source = replaceKlassAttributes(source);
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
