import type { NextPage } from 'next';
import React from 'react';

import { AssetsPage } from 'ui/assets/AssetsPage';
import PageTitle from 'ui/shared/Page/PageTitle';

const AssetsNextPage: NextPage = () => {
  return (
    <>
      <PageTitle title="GLOBAL ASSET DIRECTORY" />
      <AssetsPage />
    </>
  );
};

export default AssetsNextPage;
//
