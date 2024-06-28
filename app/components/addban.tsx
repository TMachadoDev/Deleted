'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Box, FormControl, FormLabel, Input, ButtonGroup, Button, InputGroup, Textarea } from "@chakra-ui/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ms from "ms";
import { api } from "../services/api";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Character {
  characterName: string;
  world: string;
  characters?: { name: string; world: string }[];
}

interface AddBanProps {}

const AddBan: React.FC<AddBanProps> = () => {
  const router = useRouter();
  const [character, setCharacter] = useState<Character>({
    characterName: "",
    world: "",
    characters: [],
  });
  const [name, setName] = useState<string>('');
  const [world, setWorld] = useState<string>('');
  const [proof, setProof] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [characters, setCharacters] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);

  const handleSubmit = async () => {
    const durationMs = ms(duration);
    const durationSeconds = Math.floor(durationMs / 1000);

    try {
      const result = await api.post('/addban', {
        player: name,
        world: world,
        reason: reason,
        characters: characters,
        proof: proof,
        duration: durationSeconds,
      });

      console.log(result.data);
      toast.success("Banido com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar o banimento:", error);
      toast.error("Algo deu errado.");
    }
  };

  const getCharacter = async () => {
    setLoading(true);
    try {
      const result = await api.post('/character', { name: name });
      setCharacter(result.data);
      setDisable(true);
      if (result.status == 404) {
        toast.error("Personagem Não Encontrado")
      } else {
        toast.success("Encontrado com sucesso!");
      }
    } catch (error: any) {
      console.error("Erro ao obter informações do personagem:", error);
      toast.error("Algo deu errado.");
    } finally {
      setLoading(false);
    }
  };

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
            <Button isLoading={loading} disabled={disable} onClick={getCharacter} variant="outline" ml="5px">Procurar</Button>
          </InputGroup>

          <FormLabel mt="15px">Mundo</FormLabel>
          <Input value={world} onChange={(event) => setWorld(event.target.value)} placeholder="Mundo" type="text" />

          <FormLabel mt="15px">Prova</FormLabel>
          <Input value={proof} onChange={(event) => setProof(event.target.value)} placeholder="Prova" type="url" />

          <FormLabel mt="15px">Motivo</FormLabel>
          <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Motivo" type="text" />

          <FormLabel mt="15px">Duração</FormLabel>
          <Input value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="1d, 1h, 1m, etc." type="text" />

          <FormLabel mt="15px">Characters</FormLabel>
          <Textarea value={characters} onChange={(event) => setCharacters(event.target.value)} />

          <ButtonGroup mt="10px">
            <Button onClick={handleSubmit}>Banir</Button>
          </ButtonGroup>
        </FormControl>
      </Box>
    </>
  );
};

export default AddBan;
