import Link from 'next/link'
import React from 'react'

interface Props {
    linksClassName: string;
}

const Navbar = ({linksClassName}: Props) => {
  return (
    <div className='w-full bg-slate-200 py-8'>

        <div className={`${linksClassName} flex gap-10`}>
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
    </div>
  )
}

export default Navbar