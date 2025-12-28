import { ExpenseLimit, OperationBalance } from '@/lib/definitions'

interface Props {
    expenseLimits: ExpenseLimit[]
    expensesBalance: OperationBalance[]
}

const LimitsResume = ({expenseLimits, expensesBalance}: Props) => {
  return (
    <div>LimitsResume</div>
  )
}

export default LimitsResume