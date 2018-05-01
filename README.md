![](https://i.imgur.com/S0v8XBG.png)


![npm](https://img.shields.io/npm/v/klass-loader.svg)
![Travis](https://img.shields.io/travis/darajava/klass-loader.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/darajava/klass-loader.svg)


`klass-loader` is an improvement to CSS workflow and encapsulation in React. It enforces an opinionated, yet simple and non-obtrusive structure of presentation components and corresponding stylesheets. `klass-loader` utilises `css-modules` to scope style rules and gives warnings when attempting to use a non-existent rule.

## Usage
Once the loader is correctly installed, there is no need to import any libraries or reference CSS files. `klass` attributes are evaluated as vanilla CSS selector strings, similar to the `class` tag in HTML. This attribute can be treated as a language feature in the same way `class` was pre modern Javascript. Usage is as follows:

### Component.jsx
```javascript
import React from 'react';

let variableName = 'child';

const Component = (props) => {
  return (
    <div klass='component'>
      <div klass={variableName}>
        Hello!
      </div>
    </div>
  );
}

export default Component;
 ```
 
### styles.css
```css
.component {
  padding: 10px;
}

.child {
  background-color: red; 
}
```
 
This minimal setup will apply classes in a corresponding file called `styles.css` in the same directory as the component. (LESS might work too, but it's untested so far). An example hierarchy is shown here:

```
src/
└── App.js
    ├── NoStyleButton/
    │   └── NoStyleButton.js
    ├── Progress/
    │   ├── Progress.js
    │   └── styles.css
    └── Question/
        ├── Question.js
        ├── Answer.js
        └── styles.css
```

A component *requires* a corresponding stylesheet in the same directory only if the component declares a `klass` attribute as shown above. If there are multiple components in the same folder, they will all be based on the same stylesheet.

### Using global styles
In the `styles.css` file, the webpack implementation of `css-modules` allows us compose selectors, import selectors from other stylesheets, and more! Further info on [their README](https://github.com/css-modules/css-modules#dependencies). Alternatively, `className` can still be used alongside `klass` to reference global CSS files.

## Install & Configuration

#### Install
    npm i --save klass-loader
    
#### Configuration

Set up and install `style-loader` and `css-loader` for your CSS files (and `less-loader` too if you use less):

    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
        modules: true,
        localIdentName: "[name]__[local]___[hash:base64:5]",  
      },
    }, // TODO: Update example to use newer webpack syntax
    
Make sure to set the `localIdentName` to something like the above to enable encapsulation. More details on how to install can be found on their [README](https://github.com/webpack-contrib/css-loader).

Next, set up `klass-loader` itself. To do this, place the loader just before `babel-loader` in the webpack config:

```
{
  test: /\.(js|jsx|mjs)$/,
  include: paths.appSrc,
  use: [
    // other loaders
    {
      loader: path.resolve('klass-loader'),
    },
    {
      loader: require.resolve('babel-loader'),
      options: {
        // babel options
      },
    },
  ]
},
```

## Example repo
An example of a project using `klass-loader` can be found [here](https://github.com/darajava/language-learner).
