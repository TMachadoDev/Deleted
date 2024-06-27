import { Table, Thead, Tbody, Tr, Th, Td, Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useRouter } from 'next/navigation';
import jsonexport from 'jsonexport';
import AddFdp from './addfdp';

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

const Fdp: React.FC<BanProps> = ({owner}) => {
    const router = useRouter();
    const [bans, setBans] = useState<Props[]>([]);
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
    const [isAddFdpModalOpen, setIsFdpBanModalOpen] = useState(false);

    const fetchFdp = async () => {
            try {
                const res = await api.get('/getfdp');
                setBans(res.data.result);
            } catch (error) {
                console.error('Error fetching bans:', error);
            }
    };
    
    useEffect(() => {
        fetchFdp();
    }, []);

    const exclude = async (ban: Props) => {
        await api.post(`/excluirfdp`, { player: ban.id });
        fetchFdp()

    }


    const handleRowClick = (ban: Props) => {
        setSelectedBan(ban);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openConfirmationModal = () => {
        setIsConfirmationModalOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
    };

      const openAddFdpnModal = () => {
        setIsFdpBanModalOpen(true);
    };

    const closeAddFdpnModal = () => {
        setIsFdpBanModalOpen(false);
    };

    const removeAllElements = async () => {
        setLoading(true);
        await api.get('/delfdp');
        fetchFdp();
        setLoading(false);
        setIsConfirmationModalOpen(false);
    };

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
        a.download = 'fdp.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
};

    return (
        <Box p={4}>
          <Button size="sm" onClick={openAddFdpnModal} mr={4}>Adicionar</Button>
            <Button  size="sm" isDisabled={!owner} isLoading={loading} onClick={openConfirmationModal}>Remover Todos</Button>
            <Button size="sm" onClick={downloadCSV} ml={4}>Download CSV</Button>
            <Button size="sm" onClick={fetchFdp} ml={4}>Refresh</Button>
            <Table mt="10px" variant="simple">
                <Thead>
                    <Tr>
                        <Th>Player</Th>
                        <Th>Criado Em</Th>
                        <Th>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {bans.map((ban, index) => (
                        <Tr key={index}>
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
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={closeModal}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

       

                 <Modal isOpen={isAddFdpModalOpen} onClose={closeAddFdpnModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Adicionar Fdp</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <AddFdp />
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
                        Are you sure you want to remove all expired bans?
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

export default Fdp;
