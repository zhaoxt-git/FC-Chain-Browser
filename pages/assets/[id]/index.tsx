import type { NextPage } from 'next';
import React from 'react';
import PageNextJs from 'nextjs/PageNextJs';
import { CollectionDetailsPage } from 'ui/assets/CollectionDetailsPage';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname={"/assets/[id]" as any}>
      <CollectionDetailsPage />
    </PageNextJs>
  );
};

export default Page;
