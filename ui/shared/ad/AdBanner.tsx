import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { BannerFormat } from './types';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';

import AdBannerContent from './AdBannerContent';

const feature = config.features.adsBanner;

interface Props {
  className?: string;
  isLoading?: boolean;
  format?: BannerFormat;
}

const AdBanner = ({ className, isLoading, format }: Props) => {
  return null; // Disabled globally for FC Chain to maintain enterprise branding
};

export default chakra(AdBanner);
