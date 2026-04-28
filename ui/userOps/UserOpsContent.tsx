import { Box } from '@chakra-ui/react';
import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import UserOpsListItem from 'ui/userOps/UserOpsListItem';
import { USER_OPS_ITEM } from 'stubs/userOps';
import { generateListStub } from 'stubs/utils';
import UserOpsTable from 'ui/userOps/UserOpsTable';

type Props = {
  query: QueryWithPagesResult<'general:user_ops'>;
  showTx?: boolean;
  showSender?: boolean;
};

const UserOpsContent = ({ query, showTx = true, showSender = true }: Props) => {

  // Ignore error to silently fallback to empty state
  // if (query.isError) {
  //   return <DataFetchAlert/>;
  // }

  const displayData = query.isError || !query.data?.items ? generateListStub<'general:user_ops'>(
    USER_OPS_ITEM, 50, { next_page_params: { page_token: '', page_size: 50 } }
  ) : query.data;

  const content = displayData?.items ? (
    <>
      <Box hideBelow="lg">
        <UserOpsTable
          items={ displayData.items }
          top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ query.isPlaceholderData && !query.isError }
          showTx={ showTx }
          showSender={ showSender }
        />
      </Box>
      <Box hideFrom="lg">
        { displayData.items.map((item, index) => (
          <UserOpsListItem
            key={ item.hash + (query.isPlaceholderData || query.isError ? String(index) : '') }
            item={ item }
            isLoading={ query.isPlaceholderData && !query.isError }
            showTx={ showTx }
            showSender={ showSender }
          />
        )) }
      </Box>
    </>
  ) : null;

  const actionBar = query.pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ false }
      itemsNum={ displayData?.items?.length || 0 }
      emptyText="There are no user operations."
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default UserOpsContent;
