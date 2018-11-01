let React = require('react');

const Component = (props) => {

  return (
      <div klass={['but', 'ton'].map((item) => {
        for (let i = 0; i < 100; i++) {
          console.log(i);
          console.log(i);
          console.log(i);
          console.log(i);
          console.log(i);
        }

        item = item + item;

        function hello() {
          return null;
        }

        return item;
      }).join('')}>

      </div>
  );
        
}

 