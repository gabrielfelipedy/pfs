import { Operation } from "./definitions";

declare global {
    interface Array<T> {
        filterComprasParceladas(this: Operation[]): Operation[];

        filterInvestimentos(this: Operation[]): Operation[];

        filterFixedOperations(this: Operation[]): Operation[];

        filterVariableOperations(this: Operation[]): Operation[];
    }
}

export {}