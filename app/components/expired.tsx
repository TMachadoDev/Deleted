import { Table, Thead, Tbody, Tr, Th, Td, Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, ButtonGroup } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import ms from "ms";
import jsonexport from 'jsonexport';

interface Props {
    id: string;
    player: string;
    world: string;
    expire: number;
    reason: string;
    proof: string;
    characters: string;
    createdAt: string;
}
interface BanProps {
  owner: boolean;
}

const Expired: React.FC<BanProps> = ({owner}) => {
    const [bans, setBans] = useState<Props[]>([]);
    const [selectedBan, setSelectedBan] = useState<Props>({
        id: '',
        player: '',
        expire: 0,
        proof: '',
        world: '',
        characters: '',
        reason: '',
        createdAt: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

     const fetchExpired = async () => {
            try {
                const res = await api.get('/getexpired');
                setBans(res.data.result);;
            } catch (error) {
                console.error('Error fetching bans:', error);
            }
        };

    
    useEffect(() => {
        fetchExpired();
    }, []);

    const handleRowClick = (ban: Props) => {
        setSelectedBan(ban);
        setIsModalOpen(true);
    };

    const exclude = async (ban: Props) => {
        await api.post('/excluirexpired', { player: ban.id })
        fetchExpired();
    }

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openConfirmationModal = () => {
        setIsConfirmationModalOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
    };

    const removeAllElements = async () => {
        setLoading(true);
        await api.get('/delexpired');
        fetchExpired();
        setLoading(false);
        setIsConfirmationModalOpen(false);
    };

    const RenovarBan = async (ban: Props) => {
        const duration = prompt('Qual será a duração, 1d 1h 1m 1s');

        if (!duration) {
            return;
        }
        const durationMs = ms(duration);

        const durationSeconds = Math.floor(durationMs / 1000);
        await api.post(`/renovarban`, {
            player: ban.id,
            duration: durationSeconds
        });

        fetchExpired();
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
            <Button size="sm" isDisabled={!owner} isLoading={loading} onClick={openConfirmationModal}>Remover Todos</Button>
            <Button size="sm" onClick={downloadCSV} ml={4}>Download CSV</Button>
            <Button size="sm" onClick={fetchExpired} ml={4}>Refresh</Button>
            <Table mt="10px" variant="simple">
                <Thead>
                    <Tr>
                        <Th>Nº</Th>
                        <Th>Player</Th>
                        <Th>Criado em</Th>
                        <Th>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {bans.slice().reverse().map((ban, index) => (
            <Tr key={bans.length - index}>
                <Td>{bans.length - index}</Td>
                            <Td>{ban.player}</Td>
                            <Td>{ban.createdAt}</Td>
                            <Td>
                                <ButtonGroup>
                                    <Button size="sm" onClick={() => handleRowClick(ban)}>Detalhes</Button>
                                    <Button size="sm" onClick={() => RenovarBan(ban)}>Renovar Ban</Button>
                                    <Button size="sm" onClick={() => exclude(ban)}>Excluir</Button>
                                </ButtonGroup>
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
                                <p><strong>Characters:</strong> {selectedBan.characters}</p>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={closeModal}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Confirmation Modal for removing all elements */}
            <Modal isOpen={isConfirmationModalOpen} onClose={closeConfirmationModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmar Remoção?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Tem certeza que quer remover tudo?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" onClick={removeAllElements}>Remover</Button>
                        <Button onClick={closeConfirmationModal}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Expired;
