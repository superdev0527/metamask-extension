import React from 'react';
import BigNumber from 'bignumber.js';

import { PRIORITY_LEVELS } from '../../../../../shared/constants/gas';
import { useTransactionModalContext } from '../../../../contexts/transaction-modal';
import { useGasFeeContext } from '../../../../contexts/gasFee';
import Button from '../../../ui/button';
import I18nValue from '../../../ui/i18n-value';

import { useAdvancedGasFeePopoverContext } from '../context';
import { decGWEIToHexWEI } from '../../../../../shared/modules/conversion.utils';

const getDifference = (num1, num2) =>
  new BigNumber(num1, 10).minus(new BigNumber(num2, 10)).toNumber();

const AdvancedGasFeeSaveButton = () => {
  const { closeAllModals } = useTransactionModalContext();
  const { captureTransactionMetrics, updateTransaction } = useGasFeeContext();
  const {
    gasLimit,
    hasErrors,
    initialGasValues,
    maxFeePerGas,
    maxPriorityFeePerGas,
  } = useAdvancedGasFeePopoverContext();

  const onSave = () => {
    const gasValues = {
      maxFeePerGas: decGWEIToHexWEI(maxFeePerGas),
      maxPriorityFeePerGas: decGWEIToHexWEI(maxPriorityFeePerGas),
      gasLimit,
    };
    updateTransaction({
      estimateUsed: PRIORITY_LEVELS.CUSTOM,
      ...gasValues,
    });
    captureTransactionMetrics({
      action: 'Advance gas fee modal',
      name: 'Transaction Approved',
      variables: gasValues,
    });
    captureTransactionMetrics({
      action: 'Advance gas fee modal',
      name: 'Transaction Added',
      variables: {
        differences: {
          gasLimit: getDifference(gasLimit, initialGasValues.gasLimit),
          maxFeePerGas: getDifference(
            maxFeePerGas,
            initialGasValues.maxFeePerGas,
          ),
          maxPriorityFeePerGas: getDifference(
            maxPriorityFeePerGas,
            initialGasValues.maxPriorityFeePerGas,
          ),
        },
      },
    });
    closeAllModals();
  };

  return (
    <Button type="primary" disabled={hasErrors} onClick={onSave}>
      <I18nValue messageKey="save" />
    </Button>
  );
};

export default AdvancedGasFeeSaveButton;
