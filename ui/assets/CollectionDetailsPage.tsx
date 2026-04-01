import {
  Box,
  Flex,
  Grid,
  Input,
  Text,
  HStack,
  chakra,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

import { CONTENT_MAX_WIDTH } from "ui/shared/layout/utils";

// Mock data specific to a collection
const mockItems = [
  {
    id: "100",
    name: "Cybertruck #100",
    type: "Vehicle",
    imageUrl:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400&q=80",
    floor: "85,000 FCC",
    owner: "0x1F2...AE9",
    status: "SYS_VERIFIED",
  },
  {
    id: "101",
    name: "Cybertruck #101",
    type: "Vehicle",
    imageUrl:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400&q=80",
    floor: "86,000 FCC",
    owner: "0xC99...F10",
    status: "ACTIVE",
  },
  {
    id: "102",
    name: "Cybertruck #102",
    type: "Vehicle",
    imageUrl:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400&q=80",
    floor: "85,500 FCC",
    owner: "0x32A...8B1",
    status: "LOCKED",
  },
  {
    id: "103",
    name: "Cybertruck #103",
    type: "Vehicle",
    imageUrl:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400&q=80",
    floor: "84,900 FCC",
    owner: "0xEE1...00A",
    status: "SYS_VERIFIED",
  },
];

export const CollectionDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Box
      w="100%"
      bg="#000"
      minH="100vh"
      color="white"
      fontFamily="'Space Mono', monospace"
    >
      {/* 1. HERO BANNER SECTION */}
      <Box
        position="relative"
        w="100%"
        h={{ base: "260px", md: "320px" }}
        bg="gray.900"
        borderBottom="1px solid rgba(255,255,255,0.1)"
      >
        {/* Banner Background */}
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          background="linear-gradient(rgba(10, 10, 10, 0.5) 40%, rgba(0, 0, 0, 0.9) 100%), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200')"
          backgroundSize="cover"
          backgroundPosition="center"
          filter="grayscale(80%) sepia(120%)"
        />
        {/* CRT Scanline Overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          pointerEvents="none"
          zIndex={0}
          css={{
            background:
              "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
            backgroundSize: "100% 2px, 3px 100%",
          }}
        />

        {/* Profile Image & Titling */}
        <Box
          maxW={`${CONTENT_MAX_WIDTH}px`}
          m="0 auto"
          h="100%"
          position="relative"
          zIndex={1}
        >
          <Flex
            position="absolute"
            bottom="-50px"
            left={{ base: 4, xl: 8 }}
            align="flex-end"
            gap={{ base: 4, md: 8 }}
          >
            <Box
              w={{ base: "100px", md: "140px" }}
              h={{ base: "100px", md: "140px" }}
              bg="black"
              border="2px solid"
              borderColor="gray.500"
              p={1}
              boxShadow="0 0 20px rgba(255,255,255,0.1)"
              position="relative"
            >
              <Box
                position="absolute"
                top="-2px"
                left="-2px"
                w="10px"
                h="10px"
                borderTop="2px solid red"
                borderLeft="2px solid red"
                zIndex={2}
              />
              <Box
                position="absolute"
                bottom="-2px"
                right="-2px"
                w="10px"
                h="10px"
                borderBottom="2px solid red"
                borderRight="2px solid red"
                zIndex={2}
              />
              <chakra.img
                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=200&q=80"
                w="100%"
                h="100%"
                objectFit="cover"
                filter="grayscale(50%)"
              />
            </Box>
            <Box mb={{ base: 2, md: 4 }}>
              <HStack mb={2} wrap="wrap">
                <Text
                  color="white"
                  fontSize={{ base: "2xl", md: "4xl" }}
                  fontWeight="900"
                  fontFamily="'Orbitron', sans-serif"
                  textTransform="uppercase"
                  letterSpacing="0.1em"
                  textShadow="0 0 10px rgba(255,255,255,0.3)"
                >
                  [{id || "POOL_A7091B"}] COLLECTION
                </Text>
                <Box
                  as="span"
                  bg="green.500"
                  color="black"
                  px={2}
                  py={0.5}
                  fontSize="xs"
                  fontWeight="900"
                  letterSpacing="0.1em"
                  transform="skewX(-10deg)"
                >
                  <Text transform="skewX(10deg)">SYS_VERIFIED</Text>
                </Box>
              </HStack>
              <HStack>
                <Text
                  color="red.400"
                  fontSize="sm"
                  fontFamily="'Space Mono', monospace"
                  letterSpacing="0.05em"
                >
                  &gt; CREATOR:
                </Text>
                <Text
                  color="gray.300"
                  fontSize="sm"
                  fontFamily="'Space Mono', monospace"
                >
                  AUTHORIZED_NODE_01
                </Text>
              </HStack>
            </Box>
          </Flex>
        </Box>
      </Box>

      <Box maxW={`${CONTENT_MAX_WIDTH}px`} m="0 auto" px={{ base: 4, xl: 8 }}>
        {/* 2. STATS ROW */}
        <Grid
          mt={{ base: "80px", md: "100px" }}
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          gap={6}
          border="1px solid rgba(255,255,255,0.1)"
          bg="rgba(255,255,255,0.02)"
        >
          {[
            { label: "FLOOR_PRICE", value: "85,000 FCC" },
            { label: "TOTAL_VOLUME", value: "450,000 FCC" },
            { label: "TOTAL_ITEMS", value: "5,000" },
            { label: "UNIQUE_OWNERS", value: "3,214 (64%)" },
          ].map((stat, idx) => (
            <Box
              key={stat.label}
              p={4}
              borderRight={
                idx < 3
                  ? { base: "none", md: "1px solid rgba(255,255,255,0.1)" }
                  : "none"
              }
              borderBottom={{
                base: idx < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
                md: "none",
              }}
              position="relative"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                w="2px"
                h="100%"
                bg={idx === 0 ? "red.500" : "transparent"}
              />
              <Text
                color="gray.500"
                fontSize="xs"
                fontFamily="'Space Mono', monospace"
                letterSpacing="0.1em"
                mb={1}
              >
                {stat.label}
              </Text>
              <Text
                color="white"
                fontSize="xl"
                fontWeight="900"
                fontFamily="'Orbitron', sans-serif"
                letterSpacing="0.05em"
              >
                {stat.value}
              </Text>
            </Box>
          ))}
        </Grid>

        <Box w="100%" h="1px" bg="whiteAlpha.100" my={10} position="relative">
          <Box
            position="absolute"
            left="0"
            top="-2px"
            w="10px"
            h="5px"
            bg="red.500"
          />
        </Box>

        {/* 3. MAIN CONTENT (Filter + Grid) */}
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 8, lg: 12 }}
        >
          {/* Left Filter Sidebar */}
          <Box w={{ base: "100%", lg: "280px" }} flexShrink={0}>
            <Flex align="center" mb={6}>
              <Box
                w="8px"
                h="8px"
                bg="red.500"
                mr={3}
                animation="pulse 2s infinite"
              />
              <style>{`
                @keyframes pulse {
                  0% { opacity: 1; }
                  50% { opacity: 0.3; }
                  100% { opacity: 1; }
                }
              `}</style>
              <Text
                color="gray.300"
                fontSize="sm"
                fontWeight="bold"
                fontFamily="'Space Mono', monospace"
                letterSpacing="0.1em"
              >
                &gt; PROPERTIES_FILTER_
              </Text>
            </Flex>

            <VStack align="stretch" gap={6}>
              <Box
                border="1px solid rgba(255,255,255,0.15)"
                p={5}
                bg="rgba(0,0,0,0.5)"
                position="relative"
              >
                <Box
                  position="absolute"
                  top="-1px"
                  left="-1px"
                  w="6px"
                  h="6px"
                  borderTop="2px solid gray"
                  borderLeft="2px solid gray"
                />
                <Text
                  color="white"
                  fontSize="xs"
                  mb={4}
                  fontWeight="bold"
                  letterSpacing="0.1em"
                >
                  COLOR_TRIM
                </Text>

                <Flex
                  as="button"
                  w="100%"
                  border="1px solid rgba(255,255,255,0.1)"
                  color="gray.400"
                  mb={3}
                  p={2}
                  justify="space-between"
                  align="center"
                  _hover={{
                    bg: "rgba(255,255,255,0.05)",
                    borderColor: "gray.500",
                    color: "white",
                  }}
                  transition="all 0.2s"
                  borderRadius="0"
                >
                  <Text fontSize="xs">Matte Black</Text>
                  <Box
                    as="span"
                    bg="transparent"
                    border="1px solid rgba(255,255,255,0.2)"
                    color="gray.300"
                    px={2}
                    py={0.5}
                    fontSize="2xs"
                  >
                    1,200
                  </Box>
                </Flex>
                <Flex
                  as="button"
                  w="100%"
                  border="1px solid rgba(255,255,255,0.1)"
                  color="gray.400"
                  p={2}
                  justify="space-between"
                  align="center"
                  _hover={{
                    bg: "rgba(255,255,255,0.05)",
                    borderColor: "gray.500",
                    color: "white",
                  }}
                  transition="all 0.2s"
                  borderRadius="0"
                >
                  <Text fontSize="xs">Silver Steel</Text>
                  <Box
                    as="span"
                    bg="transparent"
                    border="1px solid rgba(255,255,255,0.2)"
                    color="gray.300"
                    px={2}
                    py={0.5}
                    fontSize="2xs"
                  >
                    3,800
                  </Box>
                </Flex>
              </Box>

              <Box
                border="1px dashed rgba(255, 66, 66, 0.4)"
                bg="rgba(255,0,0,0.03)"
                p={5}
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  w="3px"
                  h="100%"
                  bg="red.500"
                />
                <Text
                  color="red.400"
                  fontSize="xs"
                  mb={2}
                  fontWeight="bold"
                  letterSpacing="0.1em"
                >
                  [ SYS_NOTICE ]
                </Text>
                <Text color="gray.400" fontSize="xs" lineHeight="1.6">
                  Access to individual asset details requires authorization
                  level 2. Unauthorized probing will be logged.
                </Text>
              </Box>
            </VStack>
          </Box>

          {/* Right Assets Grid */}
          <Box flexGrow={1} pb={20}>
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "flex-start", md: "center" }}
              mb={8}
              gap={4}
            >
              <Box position="relative">
                <Input
                  placeholder="SEARCH TOKEN ID..."
                  w={{ base: "100%", md: "300px" }}
                  bg="transparent"
                  border="1px solid rgba(255,255,255,0.2)"
                  borderRadius="0"
                  color="white"
                  fontSize="sm"
                  fontFamily="'Space Mono', monospace"
                  py={5}
                  pl={4}
                  _focus={{ borderColor: "red.500", boxShadow: "none" }}
                  _hover={{ borderColor: "gray.400" }}
                />
                <Box
                  position="absolute"
                  right={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.500"
                  pointerEvents="none"
                >
                  _
                </Box>
              </Box>
              <Flex
                align="center"
                border="1px solid rgba(255,255,255,0.1)"
                px={4}
                py={2}
                bg="rgba(255,255,255,0.02)"
              >
                <Text color="red.400" fontSize="xs" fontWeight="bold" mr={2}>
                  [&gt;]
                </Text>
                <Text color="gray.300" fontSize="xs">
                  {mockItems.length} ENTRIES FOUND
                </Text>
              </Flex>
            </Flex>

            <Grid
              templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
              gap={6}
            >
              {mockItems.map((item) => (
                <Box
                  key={item.id}
                  bg="rgba(10,10,10,0.8)"
                  border="1px solid rgba(255,255,255,0.1)"
                  role="group"
                  _hover={{
                    borderColor: "red.500",
                    transform: "translateY(-2px)",
                    boxShadow: "0 5px 15px rgba(255,0,0,0.1)",
                  }}
                  transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
                  cursor="pointer"
                  position="relative"
                >
                  <Box
                    position="absolute"
                    top="-1px"
                    left="-1px"
                    w="10px"
                    h="10px"
                    borderTop="2px solid transparent"
                    borderLeft="2px solid transparent"
                    _groupHover={{ borderColor: "red.500" }}
                    transition="all 0.2s"
                    zIndex={2}
                  />

                  <Box
                    h="180px"
                    overflow="hidden"
                    position="relative"
                    borderBottom="1px solid rgba(255,255,255,0.1)"
                  >
                    <chakra.img
                      src={item.imageUrl}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      filter="grayscale(50%) contrast(110%)"
                      _groupHover={{
                        filter: "grayscale(0%) contrast(120%)",
                        transform: "scale(1.05)",
                      }}
                      transition="all 0.5s ease"
                    />

                    <Box
                      position="absolute"
                      top={3}
                      right={3}
                      bg={
                        item.status === "SYS_VERIFIED"
                          ? "green.500"
                          : "transparent"
                      }
                      border={
                        item.status !== "SYS_VERIFIED"
                          ? "1px solid currentColor"
                          : "none"
                      }
                      color={
                        item.status === "SYS_VERIFIED" ? "black" : "orange.400"
                      }
                      fontWeight="900"
                      px={2}
                      py={0.5}
                      fontSize="10px"
                      letterSpacing="0.05em"
                      backdropFilter="blur(4px)"
                    >
                      {item.status}
                    </Box>

                    {/* Glitch Overlay on Hover */}
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      w="100%"
                      h="100%"
                      bg="red.500"
                      opacity={0}
                      mixBlendMode="overlay"
                      _groupHover={{ opacity: 0.2 }}
                      transition="opacity 0.2s"
                      pointerEvents="none"
                    />
                  </Box>

                  <Box p={5} position="relative">
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text color="red.400" fontSize="xs" fontWeight="bold">
                        REF: #{item.id}
                      </Text>
                      <Text color="gray.500" fontSize="2xs">
                        CLASS: {item.type.toUpperCase()}
                      </Text>
                    </Flex>

                    <Text
                      color="white"
                      fontSize="lg"
                      fontWeight="900"
                      fontFamily="'Orbitron', sans-serif"
                      letterSpacing="0.05em"
                      lineClamp={1}
                      mb={4}
                      _groupHover={{ color: "red.100" }}
                      transition="color 0.2s"
                    >
                      {item.name}
                    </Text>

                    <Box w="100%" h="1px" bg="rgba(255,255,255,0.05)" mb={4} />

                    <Flex justify="space-between" align="flex-end">
                      <Box>
                        <Text color="gray.500" fontSize="2xs" mb={0.5}>
                          LAST_PRICE
                        </Text>
                        <Text color="white" fontSize="sm" fontWeight="bold">
                          {item.floor}
                        </Text>
                      </Box>
                      <Box textAlign="right">
                        <Text color="gray.500" fontSize="2xs" mb={0.5}>
                          OWNER
                        </Text>
                        <Text color="gray.300" fontSize="xs">
                          {item.owner}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                </Box>
              ))}
            </Grid>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
