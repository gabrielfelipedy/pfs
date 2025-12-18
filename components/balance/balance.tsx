import { getMonthlyBalance } from '@/db/queries/balance'
import { formatter } from '@/lib/utils'

interface Balance {
  saldo: number;
}

const Balance = async () => {

    const [data] = await getMonthlyBalance()
    //console.log(data)
    const balance = (data as Balance).saldo  / 100

  return (
    <div className='p-4 rounded-lg border-2'>
            <p>Saldo Mensal</p>
    
            <h1 className={`${(balance <= 0 ? 'text-red-600' : 'text-green-600')} text-[2.2rem] md:text-[5rem] font-bold`}>{formatter.format(balance)}</h1>
        </div>
  )
}

export default Balance