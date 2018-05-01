babel --plugins transform-react-jsx string.js  --out-file compiled/string.js
babel --plugins transform-react-jsx variable.js --out-file compiled/variable.js
babel --plugins transform-react-jsx expression.js --out-file compiled/expression.js
babel --plugins transform-react-jsx complexExpression.js --out-file compiled/complexExpression.js
babel --plugins transform-react-jsx longExpression.js --out-file compiled/longExpression.js
babel --plugins transform-react-jsx longString.js --out-file compiled/longString.js
babel --plugins transform-react-jsx multipleClassNames.js --out-file compiled/multipleClassNames.js
babel --plugins transform-react-jsx withClassNameAttribute.js --out-file compiled/withClassNameAttribute.js
babel --plugins transform-react-jsx complexExpression.js --minified --out-file compiled/minified.js
babel --plugins transform-react-jsx complexExpression.js --out-file compiled/noStyle/noStyle.js
babel --plugins transform-react-jsx noKlass.js --out-file compiled/noKlass.js
