import React from 'react';

const Component = props => {

  return React.createElement('div', { klass: ['but', 'ton'].map(item => {
      return item;
    }).join('') });
};

export default Component;
