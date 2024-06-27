'use client'

import { Container, Text, Tabs, Tab, TabList, TabPanel, TabPanels, Button, Avatar, Box, Center, Input } from '@chakra-ui/react';
import Ban from './components/ban';
import Fdp from './components/fdp';
import Deleted from './components/deleted';
import Expired from './components/expired';
import Online from './components/online';
import { SameDay } from './components/sameday';
import { useState } from 'react';
import { api } from './services/api';
import Accounts from './components/account';

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [owner, setOwner] = useState(false);
  const [key, setKey] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleKeySubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/isadmin', { name: key });
      if (response.data.Authorized) {
        if (response.data.result.role == "Owner") {
          setOwner(true)
        } else {
          setOwner(false)
        }
        setAuthorized(true);
      } else {
        setError('Essa key é invalida, mas vlw pela tentativa.');
      }
    } catch (err) {
      console.log(err)
      setError('Algo Correu Mal');
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) {
    return (
      <Container>
        <Center flexDirection="column" mt="5em">
          <Text mb="1em">Para utilizar o site precisa de se autenticar:</Text>
          <Input
            placeholder="Enter key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            mb="1em"
          />
          <Button onClick={handleKeySubmit} isLoading={loading}>Entrar</Button>
          {error && <Text color="red.500" mt="1em">{error}</Text>}
        </Center>
      </Container>
    );
  }

  return (
    <Container>
      <Center flexDirection="column">
      </Center>
      <Tabs isFitted variant='enclosed' mt="1em">
        <TabList>
          <Tab>Bans</Tab>
          <Tab>Fdp</Tab>
          <Tab>Deletados</Tab>
          <Tab>Expirados</Tab>
          <Tab>Hoje</Tab>
          <Tab>Online</Tab>
          <Tab isDisabled={!owner}>Contas</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Ban owner={owner} />
          </TabPanel>
          <TabPanel>
            <Fdp owner={owner} />
          </TabPanel>
          <TabPanel>
            <Deleted owner={owner} />
          </TabPanel>
          <TabPanel>
            <Expired owner={owner} />
          </TabPanel>
          <TabPanel>
            <SameDay />
          </TabPanel>
          <TabPanel>
            <Online />
          </TabPanel>
          <TabPanel>
            <Accounts />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default Home;
