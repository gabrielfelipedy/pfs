import { Operation } from "./definitions";

const INVESTIMENTO_CATEGORY_ID = 6;
const MONTHLY_PERIOD_ID = 3

Array.prototype.filterFixedOperations = function(): Operation[]
{
  return this.filter((o) => o.period_id === MONTHLY_PERIOD_ID)
}

Array.prototype.filterVariableOperations = function(): Operation[]
{
  return this.filter((o) => o.period_id === null)

}

Array.prototype.filterComprasParceladas = function (): Operation[] {
  return this.filter((o) => o.parcelas > 1);
};

Array.prototype.filterInvestimentos = function (): Operation[] {
  return this.filter((o) => o.category_id === INVESTIMENTO_CATEGORY_ID);
};