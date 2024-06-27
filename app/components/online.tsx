'use client';

import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Flex, Spinner, Text, Button, FormControl, FormLabel, Input, NumberInputField, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputStepper } from '@chakra-ui/react';
import { api } from '@/app/services/api'

const Online = () => {
  const [nibiruPlayers, setNibiruPlayers] = useState([]);
  const [pandoraPlayers, setPandoraPlayers] = useState([]);
  const [loadingNibiru, setLoadingNibiru] = useState(false);
  const [numSearches, setNumSearches] = useState(0);
  const [loadingPandora, setLoadingPandora] = useState(false);
  const [error, setError] = useState('');

    const fetchPlayers = async () => {
    setLoadingNibiru(true);
    setLoadingPandora(true);

      try {
      const response = await api.post(`/online`, {num: numSearches});
      const { nibiru, pandora } = response.data;

      setNibiruPlayers(nibiru);
      setPandoraPlayers(pandora);
    } catch (error) {

      setError('Algo correu mal');
    } finally {
      setLoadingNibiru(false);
      setLoadingPandora(false);
    }
  };
  

  

  return (
     <Flex direction="column" alignItems="center" mt={4}>
      <FormControl>
        <FormLabel>Quantidade de Buscas:</FormLabel>
        <NumberInput onChange={(valueString) => setNumSearches(parseInt(valueString))} defaultValue={180} min={1} max={180}>
  <NumberInputField />
  <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>
      </FormControl>

      <Button isLoading={loadingNibiru} mt={2} onClick={fetchPlayers}>Procurar Players</Button>

      {error && <Text color="red" mt={2}>{error}</Text>}


      <Flex mt={4}>
        <Table variant="simple" size="sm" mr={4} display={loadingNibiru ? 'none' : 'table'}>
          <Thead>
            <Tr>
              <Th>Nibiru Players</Th>
            </Tr>
          </Thead>
          <Tbody>
            {nibiruPlayers.map((player, index) => (
              <Tr key={index}>
                <Td>{player}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {loadingNibiru && (
          <Flex align="center">
            <Spinner mr={2} />
            <Text>Loading Nibiru players...</Text>
          </Flex>
        )}
      </Flex>

      <Flex mt={4}>
        <Table variant="simple" size="sm" display={loadingPandora ? 'none' : 'table'}>
          <Thead>
            <Tr>
              <Th>Pandora Players</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pandoraPlayers.map((player, index) => (
              <Tr key={index}>
                <Td>{player}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {loadingPandora && (
          <Flex align="center">
            <Spinner mr={2} />
            <Text>Loading Pandora players...</Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default Online;
