import { CategoryDataTable } from '@/components/data-table/CategoryDataTable';
import ErrorLoading from '@/components/error/ErrorLoading';
import { getCategories } from '@/db/queries/category';
import { filterExpenseCategories, filterIncomeCategories } from '@/lib/categories';
import { Category } from '@/lib/definitions';
import React from 'react'

export default async function page() {

  let categories: Category[];

  try {
    categories = await getCategories();
  }
  catch (error) {
    console.error(error)
    return <ErrorLoading />;
  }

  return (
    <div>
      <h1 className='text-[2rem] font-bold'>Perfil</h1>
      <h1 className='text-sm text-black/60 dark:text-white/70 '>ALTERAR NOME DE USUÁRIO</h1>
      <h1 className='text-sm text-black/60 dark:text-white/70 '>ALTERAR SENHA</h1>

      <h1 className='text-[2rem] font-bold'>Categorias</h1>

      <p className='text-sm mt-6'>CATEGORIAS DE ENTRADAS</p>
      <CategoryDataTable categories={filterIncomeCategories(categories)} />

      <p className='text-sm mt-6'>CATEGORIAS DE GASTOS</p>
      <CategoryDataTable categories={filterExpenseCategories(categories)} />
    </div>
  )
}