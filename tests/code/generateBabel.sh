babel --plugins transform-react-jsx string.jsx  --out-file compiled/string.js
babel --plugins transform-react-jsx variable.jsx --out-file compiled/variable.js
babel --plugins transform-react-jsx expression.jsx --out-file compiled/expression.js
babel --plugins transform-react-jsx complexExpression.jsx --out-file compiled/complexExpression.js
babel --plugins transform-react-jsx longExpression.jsx --out-file compiled/longExpression.js
babel --plugins transform-react-jsx longString.jsx --out-file compiled/longString.js
babel --plugins transform-react-jsx multipleClassnames.jsx --out-file compiled/multipleClassnames.js
babel --plugins transform-react-jsx withClassNameAttribute.jsx --out-file compiled/withClassNameAttribute.js
babel --plugins transform-react-jsx complexExpression.jsx --minified --out-file compiled/minified.js
babel --plugins transform-react-jsx complexExpression.jsx --out-file compiled/noStyle/noStyle.js
babel --plugins transform-react-jsx noKlass.jsx --out-file compiled/noKlass.js
