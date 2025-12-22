import LimitDialog from '@/components/shared/LimitDialog'
import React from 'react'
import { createExpenseLimit } from './actions'

const page = () => {
  return (
    <div>
        <LimitDialog
                  openDialogText="Novo limite de gasto"
                  dialogTitle="Limite de gasto"
                  dialogDescription="Preencha as informações do limite"
                  buttonText="Adicionar"
                  operation={undefined}
                  actionFunction={createExpenseLimit}
                />
        <p>Definir limite total</p>
        <p>Limites por categoria</p>
    </div>
  )
}

export default page