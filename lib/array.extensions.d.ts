import { Operation } from "./definitions";

declare global {
    interface Array<T> {
        filterComprasParceladas(this: Operation[]): Operation[];
    }
}

export {}