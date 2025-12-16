import React from 'react'
import Costs from './costs'
import { getDailyCosts, getMonthlyCosts, getWeeklyCosts, Operation } from '@/lib/db';

const CostsResume = async () => {

  const dailydata: Operation[] = await getDailyCosts();
  const dailysum  = dailydata.length === 0 ? 0 : dailydata.reduce((sum, item) => sum + item.valor, 0)

  const weeklydata: Operation[] = await getWeeklyCosts();
  const weeklysum  = weeklydata.length === 0 ? 0 : weeklydata.reduce((sum, item) => sum + item.valor, 0)

  const monthlydata: Operation[] = await getMonthlyCosts();
  const monthlysum  = monthlydata.length === 0 ? 0 : monthlydata.reduce((sum, item) => sum + item.valor, 0)

  
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-4 p-4">
        <div className="row-span-2">
          <Costs title="Gastos Diários" currencyValue={dailysum/100} currencyTextClassName="text-[5rem]" />
        </div>
        <div className="text-right">
          <Costs title="Gastos da semana" currencyValue={weeklysum/100} currencyTextClassName="text-4xl text-slate-500" />
        </div>
        <div className="col-start-2 row-start-2 text-right">
          <Costs title="Gastos do mês" currencyValue={monthlysum/100} currencyTextClassName="text-4xl text-slate-500" />
        </div>
      </div>
  )
}

export default CostsResume