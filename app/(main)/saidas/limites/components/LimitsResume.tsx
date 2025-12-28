import { DataProportion, ExpenseLimit } from '@/lib/definitions'
import React from 'react'

interface Props {
    expenseLimits: ExpenseLimit[]
    expensesBalance: DataProportion[]
}

const LimitsResume = ({expenseLimits, expensesBalance}: Props) => {
  return (
    <div>LimitsResume</div>
  )
}

export default LimitsResume