import { Table, Thead, Tbody, Tr, Th, Td, Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, ButtonGroup } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import jsonexport from 'jsonexport';
import AddBan from './addban'; // Make sure this path is correct

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

const Ban: React.FC<BanProps> = ({ owner }) => {
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
    const [isAddBanModalOpen, setIsAddBanModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchBans = async () => {
            try {
                const res = await api.get('/getbans');
                setBans(res.data.result);
            } catch (error) {
                console.error('Error fetching bans:', error);
            }
    };
    
    useEffect(() => {
        fetchBans();
    }, []);

    const handleRowClick = (ban: Props) => {
        setSelectedBan(ban);
        setIsModalOpen(true);
    };

    const handleDelete = async (ban: Props) => {
        await api.post(`/delplayer`, { player: ban.id });
        fetchBans();
    };

    const handleExclude = async (ban: Props) => {
        await api.post(`/excluirban`, { player: ban.id });
        fetchBans();
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openAddBanModal = () => {
        setIsAddBanModalOpen(true);
    };

    const closeAddBanModal = () => {
        setIsAddBanModalOpen(false);
    };

    const openConfirmationModal = () => {
        setIsConfirmationModalOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
    };

    const downloadCSV = () => {
        const indexedBans = bans.map((ban, index) => ({ index: index + 1, ...ban }));
        jsonexport(indexedBans, function (err, csv) {
            if (err) return console.error('Error exporting to CSV:', err);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'bans.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
    };

    const removeAllElements = async () => {
        setLoading(true);
        await api.get('/delban');
        setLoading(false);
        setIsConfirmationModalOpen(false);
    };

    return (
        <Box p={4}>
            <Button size="sm" onClick={openAddBanModal} mr={4}>Adicionar</Button>
            <Button  size="sm" isDisabled={!owner} isLoading={loading} onClick={openConfirmationModal}>Remover Todos</Button>
            <Button size="sm" onClick={downloadCSV} ml={4}>Download CSV</Button>
            <Button size="sm" onClick={fetchBans} ml={4}>Refresh</Button>
            <Table mt="10px" variant="simple">
                <Thead>
                    <Tr>
                        <Th>Nº</Th>
                        <Th>Player</Th>
                        <Th>Expire</Th>
                        <Th>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                   {bans.slice().reverse().map((ban, index) => (
            <Tr key={bans.length - index}>
                <Td>{bans.length - index}</Td>
                <Td>{ban.player}</Td>
                <Td>{new Date(ban.expire * 1000).toLocaleString()}</Td>
                <Td>
                    <ButtonGroup>
                        <Button onClick={() => handleRowClick(ban)}>Detalhes</Button>
                        <Button onClick={() => handleDelete(ban)}>Deletar</Button>
                        <Button onClick={() => handleExclude(ban)}>Excluir</Button>
                    </ButtonGroup>
                </Td>
            </Tr>
        ))}
                </Tbody>
            </Table>

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
                                <p><strong>Expire:</strong> {new Date(selectedBan.expire * 1000).toLocaleString()}</p>
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

            <Modal isOpen={isAddBanModalOpen} onClose={closeAddBanModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Adicionar Ban</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <AddBan />
                    </ModalBody>
                </ModalContent>
            </Modal>

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

export default Ban;
