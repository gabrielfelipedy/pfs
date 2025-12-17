import { getMonthlyEarnings } from '@/lib/db'
import { formatter } from '@/lib/utils'
import React from 'react'

const EarningResumes = async () => {

    const total = await getMonthlyEarnings()
    //console.log(total)

  return (
    <div className='p-4'>
        <p>Ganhos mensais</p>

        <h1 className='text-[2.2rem] md:text-[5rem] font-bold text-green-600'>{formatter.format(total[0].total / 100)}</h1>
    </div>
  )
}

export default EarningResumes