import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IntegrationCard } from '@/components/dashboard/integrations/integrations-card';



export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Integrations</Typography>
        </Stack>

      </Stack>
      <IntegrationCard />
    </Stack>
  );
}
