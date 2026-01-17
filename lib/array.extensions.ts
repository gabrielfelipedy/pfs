import { Operation } from "./definitions";

Array.prototype.filterComprasParceladas = function (): Operation[] {
  return this.filter((o) => o.parcelas > 1);
};
