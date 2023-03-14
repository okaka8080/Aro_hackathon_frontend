"use client"

import { Inter } from 'next/font/google'
import { Codebox } from '@/components/CodeBox'
import { Box } from '@mui/system'
const inter = Inter({ subsets: ['latin'] })


export default function Main() {
  return (
    <main>
        <Box>
          <Codebox />
        </Box>
    </main>
  )
}
