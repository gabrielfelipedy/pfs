import { db } from ".";
import { paymentMethodTable } from "../schema";

export async function getPaymentMethods()
{
    return db.select().from(paymentMethodTable)
}