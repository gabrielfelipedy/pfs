import Link from 'next/link'
import React from 'react'

interface Props {
    linksClassName: string;
}

const Navbar = ({linksClassName}: Props) => {
  return (
    <div className='w-full bg-slate-200 py-8 flex justify-center'>

        <div className={`${linksClassName} flex gap-10`}>
        <Link href={'/'}>
            Dashborad
        </Link>

        <Link href={'/entradas'}>
            Entradas
        </Link>

        <Link href={'/saidas'}>
            Saídas
        </Link>
        </div>
    </div>
  )
}

export default Navbar