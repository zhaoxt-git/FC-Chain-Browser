import { Box, Flex, Grid, Input, Text } from '@chakra-ui/react';
import React from 'react';

import { Checkbox } from 'toolkit/chakra/checkbox';

import { AssetCard } from './AssetCard';

const ASSET_CATEGORIES = [ 'All Assets', 'Real Estate', 'Identity & Edu', 'Vehicles', 'Financial' ];

const mockAssets = [
  {
    id: 'A7091B',
    name: 'XinZhu Commercial Real Estate Fund',
    type: 'Real Estate',
    imageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
    volume: '24,500 MRD',
    items: '210 Units',
    floor: '1,500 MRD',
    status: 'SYS_VERIFIED',
  },
  {
    id: 'ED4492',
    name: 'Global CS Degree Certs 2026',
    type: 'Identity & Edu',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
    volume: 'N/A',
    items: '15,000 Certs',
    floor: 'NON_TRANSFERABLE',
    status: 'ACTIVE',
  },
  {
    id: 'V9921C',
    name: 'Tesla Cybertruck 2026 Batch',
    type: 'Vehicles',
    imageUrl:
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400&q=80',
    volume: '450,000 MRD',
    items: '5,000 Vehicles',
    floor: '85,000 MRD',
    status: 'SYS_VERIFIED',
  },
  {
    id: 'RE1088',
    name: 'Sector 4 Industrial Land Registry',
    type: 'Real Estate',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
    volume: '1,200,000 MRD',
    items: '45 Plots',
    floor: '120,000 MRD',
    status: 'LOCKED',
  },
  {
    id: 'F33DA1',
    name: 'National Treasury Bonds Series C',
    type: 'Financial',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80',
    volume: '5,500,000 MRD',
    items: '100,000 Bonds',
    floor: '100 MRD',
    status: 'SYS_VERIFIED',
  },
  {
    id: 'V1109B',
    name: 'LuxYacht Global Registry',
    type: 'Vehicles',
    imageUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=400&q=80',
    volume: '890,000 MRD',
    items: '420 Yachts',
    floor: '450,000 MRD',
    status: 'ACTIVE',
  },
];

interface AssetCategoryFilterProps {
  readonly category: string;
  readonly filterType: string;
  readonly onChange: (category: string) => void;
}

const AssetCategoryFilter = ({ category, filterType, onChange }: AssetCategoryFilterProps) => {
  const handleCheckedChange = React.useCallback(() => {
    onChange(category);
  }, [ category, onChange ]);

  return (
    <Checkbox
      colorScheme="red"
      size="md"
      borderRadius="0"
      checked={ filterType === category }
      onCheckedChange={ handleCheckedChange }
    >
      <Text fontSize="sm" color={ filterType === category ? 'white' : 'gray.400' } fontFamily="monospace">
        { category }
      </Text>
    </Checkbox>
  );
};

export const AssetsPage = () => {
  const [ filterType, setFilterType ] = React.useState<string>('All Assets');
  const [ searchQuery, setSearchQuery ] = React.useState<string>('');

  const filteredAssets = React.useMemo(() => {
    return mockAssets.filter((asset) => {
      const matchType = filterType === 'All Assets' || asset.type === filterType;
      const matchSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [ filterType, searchQuery ]);

  const handleSearchQueryChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap={ 8 } w="100%" pt={ 4 }>
      { /* Sidebar Filter Menu */ }
      <Box w={{ base: '100%', md: '260px' }} flexShrink={ 0 } pl={ 2 } pr={ 6 }>
        <Text color="red.400" fontWeight="800" mb={ 4 } opacity={ 0.8 } fontFamily="monospace" fontSize="sm">&gt; INIT_SEARCH_QUERY_</Text>
        <Input
          placeholder="ENTER ASSET HASH..."
          bg="black"
          value={ searchQuery }
          onChange={ handleSearchQueryChange }
          border="1px solid"
          borderColor="whiteAlpha.300"
          borderRadius="0"
          color="white"
          mb={ 8 }
          fontFamily="monospace"
          fontSize="sm"
          _focus={{ borderColor: 'red.500', outline: 'none', boxShadow: 'none' }}
          _hover={{ borderColor: 'whiteAlpha.500' }}
        />

        <Box borderTop="1px dashed" borderColor="whiteAlpha.200" pt={ 6 } mb={ 8 }>
          <Text color="gray.500" fontSize="xs" fontWeight="bold" mb={ 4 } letterSpacing="0.15em">CATEGORY_FILTER</Text>
          <Flex direction="column" gap={ 4 }>
            { ASSET_CATEGORIES.map((category) => (
              <AssetCategoryFilter
                key={ category }
                category={ category }
                filterType={ filterType }
                onChange={ setFilterType }
              />
            )) }
          </Flex>
        </Box>

        <Box p={ 4 } border="1px dashed rgba(255, 66, 66, 0.4)" bg="rgba(255, 0, 0, 0.02)">
          <Text color="red.400" fontSize="xs" fontWeight="bold" mb={ 2 }>SYS_NOTICE</Text>
          <Text color="gray.500" fontSize="xs" lineHeight="1.6" fontFamily="monospace">
            RWA module is currently in read-only visual presentation mode. Assets displayed are fetched from the local mock
            registry buffer to ensure node stability.
          </Text>
        </Box>
      </Box>

      { /* Main Grid Area */ }
      <Box flexGrow={ 1 } borderLeft={{ md: '1px solid rgba(255,255,255,0.05)' }} pl={{ md: 8 }}>
        <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={ 6 }>
          { filteredAssets.map((asset) => (
            <AssetCard key={ asset.id } { ...asset }/>
          )) }
        </Grid>
        { filteredAssets.length === 0 && (
          <Flex justify="center" align="center" h="200px" border="1px dashed rgba(255,255,255,0.1)">
            <Text color="gray.500" fontFamily="monospace">ERR: NO_ASSET_FOUND_FOR_QUERY</Text>
          </Flex>
        ) }
      </Box>
    </Flex>
  );
};
