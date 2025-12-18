import { getMonthlyIncomes } from '@/db/queries/income'
import { formatter } from '@/lib/utils'

interface TotalIncomes {
  total_incomes: number;
}

const EarningResumes = async () => {

    const [total] = await getMonthlyIncomes()
    //console.log(total)

  return (
    <div className='p-4'>
        <p>Ganhos mensais</p>

        <h1 className='text-[2.2rem] md:text-[5rem] font-bold text-green-600'>{formatter.format((total as TotalIncomes).total_incomes / 100)}</h1>
    </div>
  )
}

export default EarningResumes