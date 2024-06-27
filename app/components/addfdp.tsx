'use client';

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Box, FormControl, FormLabel, Input, ButtonGroup, Button, InputGroup, Textarea } from "@chakra-ui/react";
import { api } from "../services/api";

// Definir tipos para estados
interface Character {
  characterName: string;
  world: string;
  characters?: { name: string; world: string }[];
}

interface AddBanProps {}

const AddFdp: React.FC<AddBanProps> = () => {
  const [character, setCharacter] = useState<Character>({
    characterName: "",
    world: "",
    characters: [],
  });
  const [name, setName] = useState<string>('');
  const [world, setWorld] = useState<string>('');
  const [proof, setProof] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [characters, setCharacters] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);

  // Função para lidar com o submit do formulário
  const handleSubmit = async () => {

    try {
      const result = await api.post('/addfdp', {
        player: name,
        world: world,
        reason: reason,
        characters: characters,
        proof: proof,
      });

      console.log(result.data);

    
    } catch (error) {
      console.error("Erro ao enviar o banimento:", error);

    }
  };

  // Função para obter informações do personagem
  const getCharacter = async () => {
    setLoading(true);
    try {
      const result = await api.post('/character', { name: name });
      setCharacter(result.data);
      setDisable(true);
  
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  // Efeito para atualizar campos quando o personagem é carregado
  useEffect(() => {
    if (character && Object.keys(character).length > 0) {
      setName(character.characterName || '');
      setWorld(character.world || '');
      let textarea = character.characters?.map(char => `${char.name} - ${char.world}`).join('\n') || '';
      setCharacters(textarea);
    }
  }, [character]);

  return (
    <>
      <Toaster position="top-right" />
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <FormControl width="100%">
          <FormLabel>Nome do Player</FormLabel>
          <InputGroup>
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome do Player" type="text" />
            <Button isLoading={loading} disabled={disable} onClick={() => {
              toast.promise(
                getCharacter(),
                {
                  loading: 'Procurando...',
                  success: <b>Encontrado com sucesso!</b>,
                  error: <b>Algo deu errado.</b>,
                }
              );
            }} variant="outline" ml="5px">Procurar</Button>
          </InputGroup>

          <FormLabel mt="15px">Mundo</FormLabel>
          <Input value={world} onChange={(event) => setWorld(event.target.value)} placeholder="Mundo" type="text" />

          <FormLabel mt="15px">Prova</FormLabel>
          <Input value={proof} onChange={(event) => setProof(event.target.value)} placeholder="Prova" type="url" />

          <FormLabel mt="15px">Motivo</FormLabel>
          <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Motivo" type="text" />

          <FormLabel mt="15px">Characters</FormLabel>
          <Textarea value={characters} onChange={(event) => setCharacters(event.target.value)} />

          <ButtonGroup mt="10px">
            <Button onClick={() => {
              toast.promise(
                handleSubmit(),
                {
                  loading: 'Banindo...',
                  success: <b>Banido com sucesso!</b>,
                  error: <b>Algo deu errado.</b>,
                }
              );
            }}>Banir</Button>
          </ButtonGroup>
        </FormControl>
      </Box>
    </>
  );
};

export default AddFdp;
