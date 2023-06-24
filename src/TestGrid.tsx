import { DataGrid } from '@mui/x-data-grid';
import { FC } from 'react';

export const TestToolbar: FC = () => {
  return <div>Test Toolbar</div>;
};

export const TestGrid: FC = () => {
  return (
    <DataGrid
      slots={{
        toolbar: TestToolbar,
      }}
      slotProps={{
        toolbar: {},
      }}
      columns={[
        {
          field: 'name',
          headerName: 'Name',
        },
      ]}
      rows={[
        {
          id: 0,
          name: 'Vitaly',
        },
      ]}
    />
  );
};
