import { Context } from './Context';
import { UseQuery } from './UseQuery';
import ResponsiveDrawer from './ResponsiveDrawer';

const componentMap = {
  useQuery: <UseQuery />,
  Context: <Context />,
};

function App() {
  return <ResponsiveDrawer componentMap={componentMap} />;
}

export default App;
