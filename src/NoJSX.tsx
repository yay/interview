import React, { FC } from 'react';

type CustomComponentProps = {
  text: string;
};

const Component: FC<CustomComponentProps> = (props) => {
  return <div>{props?.text ?? 'Custom Component'}</div>;
};

export function JSX() {
  return (
    <header className="app-header">
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a className="app-link" href="https://react.dev" rel="noopener noreferrer" target="_blank">
        Learn React
      </a>
      <Component text="Or Die Trying" />
    </header>
  );
}

export function NoJSX() {
  return React.createElement(
    'header',
    { className: 'app-header' },
    React.createElement('p', null, 'Edit ', React.createElement('code', null, 'src/App.tsx'), ' and save to reload.'),
    React.createElement(
      'a',
      { className: 'app-link', href: 'https://react.dev', target: '_blank', rel: 'noopener noreferrer' },
      'Learn React'
    ),
    React.createElement(Component, { text: 'Or Die Trying' })
  );
}
