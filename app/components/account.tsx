'use client';

import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Flex, Spinner, Text, Button, FormControl, FormLabel, Input, NumberInputField, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputStepper, Select } from '@chakra-ui/react';
import { api } from '@/app/services/api';

interface Props {
    name: string;
    role: string;
}

const Accounts = () => {
  const [users, setUsers] = useState<Props[]>([]);
  const [loading, setLoading] = useState(true);
  const [discordName, setDiscordName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admins');
      setUsers(response.data.result.reverse());
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    try {
      await api.post('/addadmin', { name: discordName, role });
      fetchAdmins();
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  const handleRemoveUser = async (name: string) => {
    try {
      await api.post(`/deladmin`, {name});
      fetchAdmins();
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  return (
    <>
      <FormControl>
        <FormLabel>Key:</FormLabel>
        <Input 
          type="text" 
          placeholder="Key" 
          value={discordName}
          onChange={(e) => setDiscordName(e.target.value)}
        />
        <Select 
          mt={"22px"} 
          placeholder='Selecione um Cargo'
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value='Admin'>Admin</option>
          <option value='Owner'>Owner</option>
        </Select>
        <Button mt={5} onClick={handleCreateAccount}>Criar Conta</Button>
      </FormControl>
      
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Table mt={5}>
          <Thead>
            <Tr>
              <Th>Index</Th>
              <Th>Key</Th>
              <Th>Cargo</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user, index) => (
              <Tr key={index}>
                <Td>{index}</Td>
                <Td>{user.name}</Td>
                <Td>{user.role}</Td>
                <Td>
                  <Button colorScheme="red" onClick={() => handleRemoveUser(user.name)}>Remover</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </>
  );
};

export default Accounts;
