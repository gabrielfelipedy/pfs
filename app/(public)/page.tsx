import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col items-center'>
      <h1 className='title text-center w-100'>Insights inteligentes sobre o seu dinheiro!</h1>


      <div className='flex flex-col gap-4 mt-20'>
        <Button variant="secondary" disabled={true} className='w-100'>Criar conta</Button>
        <Link href="/login">
        <Button 
        variant="secondary" className='w-100'>Fazer login</Button>
        </Link>
      </div>
    </div>
  )
}

export default page