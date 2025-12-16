import { getMonthlyBalance } from '@/lib/db'
import { formatter } from '@/lib/utils'
import React from 'react'

const Balance = async () => {

    const data = await getMonthlyBalance()
    const balance = data[0].saldo  / 100

  return (
    <div className='p-4 rounded-lg border-2'>
            <p>Saldo Mensal</p>
    
            <h1 className={`${(balance <= 0 ? 'text-red-600' : 'text-green-600')} text-[5rem] font-bold`}>{formatter.format(balance)}</h1>
        </div>
  )
}

export default Balance