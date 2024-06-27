import { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Box, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { api } from "../services/api";

const fetchBans = async () => {
  try {
    const res = await api.get('/getday');
    console.log("🚀 ~ fetchBans ~ return res.data.result[0].bans:", res.data.result[0].bans);
    // Ensure the response structure is as expected
    if (res.data && res.data.result && res.data.result[0] && res.data.result[0].bans) {
      return res.data.result[0].bans;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Error fetching bans:", error);
    throw error;
  }
};

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

  useEffect(() => {
    fetchBans()
      .then((data) => {
        setBansData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
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
