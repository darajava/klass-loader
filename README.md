![](https://i.imgur.com/S0v8XBG.png)
#

## About
`klass-loader` is an improvement to CSS workflow and encapsulation in React. It enforces an opinionated, yet simple and non-obtrusive structure of presentation components and corresponding stylesheets. `klass-loader` utilises `css-modules` to scope style rules and gives warnings when attempting to use a non-existent rule.

## Usage
Once the loader is correctly installed, usage is as follows:

### Component.jsx
```javascript
import React from 'react';

const Component = (props) => {
  return (
    <div klass='component'>
      <div klass={'child-' + Math.floor(Math.random() * 2)}>
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

.child-0 {
  background-color: red; 
}

.child-1 {
  background-color: blue;
}
```
 
This minimal setup will apply the corresponding classes in a file called `styles.css` in the same directory as the component. (LESS may come later, it needs experimentation). An example hierarchy is shown here:

```
src
├── App.js
│   └── views
│       ├── NoStyleButton
│       │   ├── NoStyleButton.js
│       ├── Progress
│       │   ├── Progress.js
│       │   └── styles.css
│       ├── Question
│       │   ├── Question.js
│       │   ├── Answer.js
│       │   └── styles.css
```

A component *requires* a corresponding stylesheet in the same directory only if the component declares a `klass` attribute as shown above. If there are multiple components in the same folder, they will all be based on the same stylesheet.

## Install & Configuration

#### Install
    npm i --save klass-loader # (doesn't exist yet, you need to build it from source at the moment)
    
#### Configuration

Set up and install `style-loader` and `css-loader`:

    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
        modules: true,
        localIdentName: "[name]__[local]___[hash:base64:5]",  
      },
    }, // TODO: Update example to use newer syntax
    
Make sure to set the `localIdentName` to something like the above to enable encapsulation. More details on how to install can be found on their [README](https://github.com/webpack-contrib/css-loader).

Next, set up `klass-loader` itself. To do this, place the loader just before `babel-loader` in the webpack config:

```
{
  test: /\.(js|jsx|mjs)$/,
  include: paths.appSrc,
  use: [
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

## Options
Coming soon!

## FAQ / Integration
Coming soon!

## TypeScript support
Coming soon?
