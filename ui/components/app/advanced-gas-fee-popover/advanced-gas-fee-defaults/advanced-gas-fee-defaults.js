import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Box from '../../../ui/box';
import Typography from '../../../ui/typography';
import CheckBox from '../../../ui/check-box';
import {
  COLORS,
  DISPLAY,
  FLEX_DIRECTION,
  TYPOGRAPHY,
} from '../../../../helpers/constants/design-system';
import { getAdvancedGasFeeValues } from '../../../../selectors';
import { setAdvancedGasFee } from '../../../../store/actions';
import { useTransactionMetrics } from '../../../../hooks/useTransactionMetrics';

import { useAdvancedGasFeePopoverContext } from '../context';
import { useI18nContext } from '../../../../hooks/useI18nContext';

const AdvancedGasFeeDefaults = () => {
  const t = useI18nContext();
  const dispatch = useDispatch();

  const {
    hasErrors,
    maxBaseFee,
    maxPriorityFeePerGas,
  } = useAdvancedGasFeePopoverContext();
  const advancedGasFeeValues = useSelector(getAdvancedGasFeeValues);
  const { captureTransactionMetricsForEIP1559V2 } = useTransactionMetrics();

  const isDefaultSettingsSelected =
    Boolean(advancedGasFeeValues) &&
    advancedGasFeeValues.maxBaseFee === maxBaseFee &&
    advancedGasFeeValues.priorityFee === maxPriorityFeePerGas;

  const handleUpdateDefaultSettings = () => {
    if (isDefaultSettingsSelected) {
      dispatch(setAdvancedGasFee(null));
    } else {
      const defaults = {
        maxBaseFee,
        priorityFee: maxPriorityFeePerGas,
      };
      captureTransactionMetricsForEIP1559V2({
        action: 'Advanced gas fee modal',
        name: 'Saved Advanced Defaults',
        variables: {
          defaults,
        },
      });
      dispatch(setAdvancedGasFee(defaults));
    }
  };

  return (
    <Box
      display={DISPLAY.FLEX}
      flexDirection={FLEX_DIRECTION.ROW}
      marginRight={4}
      className="advanced-gas-fee-defaults"
    >
      <CheckBox
        checked={isDefaultSettingsSelected}
        className="advanced-gas-fee-defaults__checkbox"
        onClick={handleUpdateDefaultSettings}
        disabled={hasErrors}
      />
      <Typography variant={TYPOGRAPHY.H7} color={COLORS.UI4} margin={0}>
        {!isDefaultSettingsSelected && Boolean(advancedGasFeeValues)
          ? t('advancedGasFeeDefaultOptIn', [
              <strong key="default-value-change">{t('newValues')}</strong>,
            ])
          : t('advancedGasFeeDefaultOptOut')}
      </Typography>
    </Box>
  );
};

export default AdvancedGasFeeDefaults;
