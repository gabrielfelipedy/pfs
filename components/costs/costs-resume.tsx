import React from 'react'
import Costs from './costs'
import { getDailyCosts, getMonthlyCosts, getWeeklyCosts } from '@/lib/db';
import { Operation } from '@/lib/definitions';

const CostsResume = async () => {

  const dailydata: Operation[] = await getDailyCosts();
  const dailysum  = dailydata.length === 0 ? 0 : dailydata.reduce((sum, item) => sum + item.valor, 0)

  const weeklydata: Operation[] = await getWeeklyCosts();
  const weeklysum  = weeklydata.length === 0 ? 0 : weeklydata.reduce((sum, item) => sum + item.valor, 0)

  const monthlydata: Operation[] = await getMonthlyCosts();
  const monthlysum  = monthlydata.length === 0 ? 0 : monthlydata.reduce((sum, item) => sum + item.valor, 0)

  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 grid-rows-3 gap-4 mt-4 p-4">
        <div className="md:row-span-2">
          <Costs title="Gastos Diários" currencyValue={dailysum/100} currencyTextClassName="text-[2.2rem] md:text-[5rem]" />
        </div>
        <div className="md:text-right">
          <Costs title="Gastos da semana" currencyValue={weeklysum/100} currencyTextClassName="text-[2.2rem] md:text-4xl text-slate-500" />
        </div>
        <div className="md:col-start-2 md:row-start-2 md:text-right">
          <Costs title="Gastos do mês" currencyValue={monthlysum/100} currencyTextClassName="text-[2.2rem] md:text-4xl text-slate-500" />
        </div>
      </div>
  )
}

export default CostsResume