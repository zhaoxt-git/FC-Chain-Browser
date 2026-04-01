import React from 'react';

import type { TransactionType } from 'types/api/transaction';

import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';

export interface Props extends BadgeProps {
  types: Array<TransactionType>;
  isLoading?: boolean;
}

const TYPES_ORDER: Array<TransactionType> = [
  'blob_transaction',
  'rootstock_remasc',
  'rootstock_bridge',
  'token_creation',
  'contract_creation',
  'token_transfer',
  'contract_call',
  'coin_transfer',
];

const TxType = ({ types, isLoading, ...rest }: Props) => {
  const typeToShow = types.sort((t1, t2) => TYPES_ORDER.indexOf(t1) - TYPES_ORDER.indexOf(t2))[0];

  let label;
  let colorPalette: BadgeProps['colorPalette'];

  switch (typeToShow) {
    case 'contract_call':
      label = 'Contract call';
      colorPalette = 'gray';
      break;
    case 'blob_transaction':
      label = 'Blob txn';
      colorPalette = 'gray';
      break;
    case 'contract_creation':
      label = 'Contract creation';
      colorPalette = 'gray';
      break;
    case 'token_transfer':
      label = 'Token transfer';
      colorPalette = 'gray';
      break;
    case 'token_creation':
      label = 'Token creation';
      colorPalette = 'gray';
      break;
    case 'coin_transfer':
      label = 'Coin transfer';
      colorPalette = 'gray';
      break;
    case 'rootstock_remasc':
      label = 'REMASC';
      colorPalette = 'gray';
      break;
    case 'rootstock_bridge':
      label = 'Bridge';
      colorPalette = 'gray';
      break;
    default:
      label = 'Transaction';
      colorPalette = 'gray';
  }

  if (!label) {
    return null;
  }

  return (
    <Badge colorPalette={ colorPalette } loading={ isLoading } { ...rest }>
      { label }
    </Badge>
  );
};

export default TxType;
