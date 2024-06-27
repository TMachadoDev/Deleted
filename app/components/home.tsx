import { Center, Tabs, TabList, Tab, TabPanels, TabPanel, Container } from '@chakra-ui/react'
import React from 'react'
import Accounts from './account'
import Ban from './ban'
import Deleted from './deleted'
import Expired from './expired'
import Fdp from './fdp'
import Online from './online'
import { SameDay } from './sameday'

interface HomeProps {
    owner: boolean
}

const HomeComponent = ({owner}: HomeProps) => {
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
  )
}

export default HomeComponent