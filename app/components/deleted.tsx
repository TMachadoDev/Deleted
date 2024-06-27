import { Table, Thead, Tbody, Tr, Th, Td, Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useRouter } from 'next/navigation';
import jsonexport from 'jsonexport';
import AddDel from './adddel';


interface Props {
    id: string;
    player: string;
    world: string;
    expire: number;
    reason: string;
    proof: string;
    createdAt: string;
}

interface BanProps {
  owner: boolean;
}

const Deleted: React.FC<BanProps> = ({owner}) => {
    const router = useRouter();
    const [bans, setBans] = useState<Props[]>([]);
    const [isDelBanModalOpen, setIsDelBanModalOpen] = useState(false);
    const [selectedBan, setSelectedBan] = useState<Props>({
        id: '',
        player: '',
        expire: 0,
        proof: '',
        world: '',
        reason: '',
        createdAt: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

       const fetchDel = async () => {
            try {
                const res = await api.get('/getdel');
                setBans(res.data.result.reverse());
            } catch (error) {
                console.error('Error fetching bans:', error);
            }
    };
    
    useEffect(() => {
        fetchDel();
    }, []);

    // Function to handle when a row (ban) is clicked
    const handleRowClick = (ban: Props) => {
        setSelectedBan(ban);
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const exclude = async (ban: Props) => {
        await api.post('/excluirdel', { player: ban.id })
        fetchDel();
    }

    // Function to open the confirmation modal
    const openConfirmationModal = () => {
        setIsConfirmationModalOpen(true);
    };

    // Function to close the confirmation modal
    const closeConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
    };

      const openAddDelModal = () => {
        setIsDelBanModalOpen(true);
    };

    const closeAddDelModal = () => {
        setIsDelBanModalOpen(false);
    };

    // Function to remove all bans
    const removeAllElements = async () => {
        setLoading(true);
        await api.get('/deldel');
        fetchDel();
        setLoading(false);
        setIsConfirmationModalOpen(false); // Close confirmation modal after removing all bans
    };

    // Function to download table data as CSV
   const downloadCSV = () => {
    // Adiciona um índice numérico às linhas antes de exportar para CSV
    const indexedBans = bans.map((ban, index) => ({  index: index + 1, ...ban}));

    jsonexport(indexedBans, function(err, csv) {
        if (err) return console.error('Error exporting to CSV:', err);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'deleted.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
};

    return (
        <Box p={4}>
            <Button size="sm" onClick={openAddDelModal} mr={4}>Adicionar</Button>
            <Button  size="sm" isDisabled={!owner} isLoading={loading} onClick={openConfirmationModal}>Remover Todos</Button>
            <Button size="sm" onClick={downloadCSV} ml={4}>Download CSV</Button>
            <Button size="sm" onClick={fetchDel} ml={4}>Refresh</Button>
            <Table mt="10px" variant="simple">
                <Thead>
                    <Tr>
                        <Th>Index</Th>
                        <Th>Player</Th>
                        <Th>Criado em </Th>
                        <Th>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {bans.map((ban, index) => (
                        <Tr key={index}>
                            <Td>{index}</Td>
                            <Td>{ban.player}</Td>
                            <Td>{ban.createdAt}</Td>
                            <Td>
                                <Button size="sm"  onClick={() => exclude(ban)}>Excluir</Button>
                                <Button size="sm" mt={2} onClick={() => handleRowClick(ban)}>Detalhes</Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            {/* Modal to display player details */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Player Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedBan && (
                            <div>
                                <p><strong>Player:</strong> {selectedBan.player}</p>
                                <p><strong>World:</strong> {selectedBan.world}</p>
                                <p><strong>Prova:</strong> {selectedBan.proof}</p>
                                <p><strong>Motivo:</strong> {selectedBan.reason}</p>
                                <p><strong>Criado em:</strong> {selectedBan.createdAt}</p>
                                {/* Add more details as needed */}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={closeModal}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

                   <Modal isOpen={isDelBanModalOpen} onClose={closeAddDelModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Adicionar Deletado</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <AddDel />
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Confirmation Modal for removing all elements */}
            <Modal isOpen={isConfirmationModalOpen} onClose={closeConfirmationModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Removal</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to remove all bans?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" onClick={removeAllElements}>Remove All</Button>
                        <Button onClick={closeConfirmationModal}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Deleted;
