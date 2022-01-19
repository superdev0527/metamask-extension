import { useContext } from 'react';

import { useGasFeeContext } from '../contexts/gasFee';
import { MetaMetricsContext } from '../contexts/metametrics';

export const useTransactionMetrics = () => {
  const { transaction } = useGasFeeContext();
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

  const captureTransactionMetricsForEIP1559V2 = ({
    action,
    name,
    variables,
  }) => {
    captureTransactionMetrics({
      action,
      name,
      variables: { ...variables, EIP_1559_V2: true },
    });
  };

  return {
    captureTransactionMetrics,
    captureTransactionMetricsForEIP1559V2,
  };
};
