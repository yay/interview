import { Context } from './Context';
import { UseQuery } from './UseQuery';
import ResponsiveDrawer from './ResponsiveDrawer';
import { JSX } from './NoJSX';
import { NoJSX } from './NoJSX';
import { BoxPlot } from './BoxPlot';
import { SingleBar, SingleBarFoooter, SingleBarHeader } from './SingleBar';
import { Box, Typography } from '@mui/material';
import { TestGrid } from './TestGrid';
// import { Memo } from './Memo';

const componentMap = {
  SingleBar: (
    <Box style={{ width: '700px', height: '70px' }}>
      <SingleBar
        items={[
          {
            name: 'Round1',
            value: 540,
          },
          {
            name: 'Round2',
            value: 510,
          },
          // {
          //   name: 'Round2',
          //   value: 1000,
          // },
          {
            name: 'Round3',
            value: 850,
          },
          // {
          //   name: 'Round3',
          //   value: 220,
          // },
          // {
          //   name: 'Round4',
          //   value: 150,
          // },
          // {
          //   name: 'Target',
          //   value: 820,
          // },
        ]}
        header={({ overlap }) => (
          <SingleBarHeader
            title={() => {
              return <Typography variant="h5">$250M</Typography>;
            }}
            subtitle={() => {
              return <Typography variant="body1">Dolom ipsum</Typography>;
            }}
            overlap={overlap}
            overlapNotice={<Box sx={{ color: 'purple' }}>Oversubscribed</Box>}
          />
        )}
        footer={({ overlap }) => <SingleBarFoooter overlap={overlap} />}
      />
    </Box>
  ),
  DataGrid: <TestGrid />,
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
