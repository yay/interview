import React, { FC, useRef, useState } from 'react';

// Note: Strict Mode checks run in dev mode and double-invoke function component bodies.

// Q: Will ChildComponent render when parent re-renders?
// A: Yes, even though its props are not changed and no state is present.

// Q: Will ChildComponent render when parent re-renders if we remove the 'text' prop?
// A: Yes, even though ChildComponent doesn't accept any props and doesn't have any state.

// Q: How to prevent ChildComponent from re-rendering?
// A: By using a higher-order component (HOC) React.memo()

// Q: What does React.memo() do?
// A: If your component renders the same result given the same props, you can wrap it in a call to React.memo
//    for a performance boost in some cases by memoizing the result.
//    This means that React will skip rendering the component, and reuse the last rendered result.
//    React.memo only checks for prop changes. If your function component wrapped in React.memo has a useState,
//    useReducer or useContext Hook in its implementation, it will still rerender when state or context change.
//    By default it will only shallowly compare complex objects in the props object.
//    If you want control over the comparison, you can also provide a custom comparison function as the second argument.
//
//    React.memo(MyComponent, function areEqual(prevProps, nextProps) { });

// Q: Does React still perform diffing when using React.memo?
// A: Yes, it does.

// Q: What is a class based equivalent of React.memo()?
// A: React.PureComponent (implements shouldComponentUpdate() with a shallow prop and state comparison)

type ChildComponentProps = {
  value: number;
};

const ChildComponent: FC<ChildComponentProps> = (props) => {
  // Something expensive to compute:
  const elements = ' '
    .repeat(255)
    .split('')
    .map((_, i) => <div key={i} style={{ backgroundColor: `rgb(${i},${props.value},0)`, height: '1px' }}></div>);

  return <>{elements}</>;
};

function IncrementCounterOnRender() {
  const counter = useRef(0); // in dev mode the render is called twice

  return (
    <div>
      <p>Render #: {counter.current++}</p>
    </div>
  );
}

const ChildComponentMemo = React.memo(ChildComponent);
// const ChildComponentMemo = myMemo(ChildComponent);

export function ParentComponent() {
  const [counter, setCounter] = useState(0);
  const value = 255;

  return (
    <div>
      <p>Parent Render #: {counter}</p>
      <p>
        <button onClick={() => setCounter(counter + 1)}>Increment</button>
      </p>
      <ChildComponent value={value} />
    </div>
  );
}

// My take at React.memo() implementation (for function components only)
function myMemo(Component: FC, compare: (prevProps: object, currProps: object) => boolean) {
  let prevProps: object;
  let prevResult: object;

  compare =
    compare ||
    function (prevProps, currProps) {
      prevProps = prevProps || {};
      currProps = currProps || {};

      const prevKeys = Object.keys(prevProps);
      const nextKeys = Object.keys(currProps);

      if (prevKeys.length !== nextKeys.length) {
        return false;
      }

      for (const key of prevKeys) {
        if (prevProps[key] !== currProps[key]) {
          return false;
        }
      }

      return true;
    };

  return function (currProps) {
    if (compare(prevProps, currProps) && prevResult !== undefined) {
      return prevResult;
    }
    const result = Component(currProps);
    prevProps = currProps;
    prevResult = result;
    return result;
  };
}
