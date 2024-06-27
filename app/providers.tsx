'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
interface Props { children: React.ReactNode; }

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

export default function Providers({ children }: Props) {

  return (
    //@ts-ignore
    <ChakraProvider theme={theme}>
      {children}
      </ChakraProvider>
  )
    
}