import { Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { VALIDATORS_STABILITY_COUNTERS } from 'stubs/validators';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const ValidatorsCounters = () => {
  const countersQuery = useApiQuery('general:validators_stability_counters', {
    queryOptions: {
      enabled: config.features.validators.isEnabled,
      placeholderData: VALIDATORS_STABILITY_COUNTERS,
    },
  });

  const activeData = countersQuery.data || VALIDATORS_STABILITY_COUNTERS;

  if (!activeData) {
    return null;
  }

  return (
    <Box columnGap={ 3 } rowGap={ 3 } mb={ 6 } display="grid" gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}>
      <StatsWidget
        label="Total validators"
        value={ Number(activeData.validators_count).toLocaleString() }
        diff={ Number(activeData.new_validators_count_24h).toLocaleString() }
        isLoading={ countersQuery.isPlaceholderData || (countersQuery.isError && false) }
      />
      <StatsWidget
        label="Active validators"
        value={ `${ Number(activeData.active_validators_percentage).toLocaleString() }%` }
        isLoading={ countersQuery.isPlaceholderData || (countersQuery.isError && false) }
      />
    </Box>
  );
};

export default React.memo(ValidatorsCounters);
