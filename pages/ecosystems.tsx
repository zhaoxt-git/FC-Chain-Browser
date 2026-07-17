import type { GetServerSideProps, NextPage } from 'next';

// import dynamic from 'next/dynamic';
// import React from 'react';
//
// import PageNextJs from 'nextjs/PageNextJs';
//
// const MultichainEcosystems = dynamic(() => import('ui/multichain/ecosystems/MultichainEcosystems'), { ssr: false });

const Page: NextPage = () => {
  return null;
  // return (
  //   <PageNextJs pathname="/ecosystems">
  //     <MultichainEcosystems/>
  //   </PageNextJs>
  // );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async() => {
  return { notFound: true };
};

// export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';
