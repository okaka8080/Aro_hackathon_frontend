"use client"

import { Inter } from 'next/font/google'
import { Codebox } from '@/components/CodeBox'
import { Box } from '@mui/system'

import Cookies from 'js-cookie'
import Auth from '@/components/auth'

const inter = Inter({ subsets: ['latin'] })

export default function Main() {
  return (
    <main>
      <Auth>
        <Box>
          <Codebox />
        </Box>
      </Auth>
    </main>
  )
}
