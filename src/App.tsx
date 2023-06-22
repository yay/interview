import { Context } from './Context';
import { UseQuery } from './UseQuery';
import ResponsiveDrawer from './ResponsiveDrawer';
import { JSX } from './NoJSX';
import { NoJSX } from './NoJSX';
import { BoxPlot } from './BoxPlot';
// import { Memo } from './Memo';

const componentMap = {
  BoxPlot: <BoxPlot />,
  useQuery: <UseQuery />,
  Context: <Context />,
  // 'React.memo': <Memo />,
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
