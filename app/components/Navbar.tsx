import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className='w-full bg-slate-200 flex p-8 gap-10'>
        <Link href={'#'}>
            Início
        </Link>

        <Link href={'#'}>
            Entradas
        </Link>

        <Link href={'#'}>
            Saídas
        </Link>

        <Link href={'#'}>
            Previsões
        </Link>
    </div>
  )
}

export default Navbar