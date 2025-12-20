import Link from 'next/link'
import React from 'react'

interface Props {
    linksClassName: string;
}

const Navbar = ({linksClassName}: Props) => {
  return (
    <nav className='fixed top-0 left-0 z-50 w-full flex py-3 justify-center'>

        <div className={`${linksClassName} text-[0.8rem] md:text-md py-3 flex gap-6 md:gap-10 bg-white/40 rounded-full backdrop-blur-xs`}>
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
    </nav>
  )
}

export default Navbar