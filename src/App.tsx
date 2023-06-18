import { Context } from './Context';
import { UseQuery } from './UseQuery';
import ResponsiveDrawer from './ResponsiveDrawer';
import { JSX } from './NoJSX';
import { NoJSX } from './NoJSX';

const componentMap = {
  useQuery: <UseQuery />,
  Context: <Context />,
  'No JSX': (
    <>
      <JSX />
      <NoJSX />
    </>
  ),
};

function App() {
  return <ResponsiveDrawer componentMap={componentMap} />;
}

export default App;
