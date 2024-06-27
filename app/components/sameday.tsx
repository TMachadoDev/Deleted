import { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Box, Spinner, Alert, AlertIcon, Button } from "@chakra-ui/react";
import { api } from "../services/api";



interface Props {
  id: string;
  player: string;
  world: string;
  expire: number;
  reason: string;
  proof: string;
  createdAt: string;
}

export function SameDay() {
  const [bansData, setBansData] = useState<Props[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBans = async () => {
    try {
    setLoading(true)
    const res = await api.get('/getday');
    setBansData(res.data.bans.reverse());
    setLoading(false);
  } catch (error) {
    console.error("Error fetching bans:", error);
    throw error;
  }
};

  useEffect(() => {
    fetchBans()
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt="10">
        <Spinner size="xl" />
      </Box>
    );
  }


  return (
    <Box p="5">
      <Button onClick={fetchBans}>Refresh</Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Player</Th>
            <Th>World</Th>
            <Th>Created At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {bansData.length === 0 ? (
            <Tr>
              <Td colSpan={3} style={{ textAlign: 'center' }}>Nenhum ban vai expirar hoje</Td>
            </Tr>
          ) : (
            bansData.map((ban: Props) => (
              <Tr key={ban.id}>
                <Td>{ban.player}</Td>
                <Td>{ban.world}</Td>
                <Td>{new Date(ban.createdAt).toLocaleString()}</Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
