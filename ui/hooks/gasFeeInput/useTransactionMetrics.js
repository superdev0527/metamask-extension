import { useContext } from 'react';

import { MetaMetricsContext } from '../../contexts/metametrics';

export const useTransactionMetrics = ({ transaction }) => {
  const metricsEvent = useContext(MetaMetricsContext);
  const { origin, type } = transaction;

  const captureTransactionMetrics = ({ action, name, variables }) => {
    metricsEvent({
      eventOpts: {
        category: 'Transactions',
        action,
        name,
      },
      customVariables: {
        origin,
        transaction_type: type,
        source: origin === 'metamask' ? 'user' : 'dapp',
        EIP_1559_V2: true,
        ...variables,
      },
    });
  };

  return {
    captureTransactionMetrics,
  };
};
