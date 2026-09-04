"use client";

import { useEffect, useState } from "react";

import { PaymentMethod } from "@/lib/definitions";
import { fetchPaymentMethodsAction } from "@/actions/selectors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  payment_method_id: number | undefined;
}

const PaymentMethodSelector = ({ payment_method_id }: Props) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    payment_method_id?.toString()
  );

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const data = await fetchPaymentMethodsAction();
        setPaymentMethods(data);

        if (payment_method_id) setSelectedValue(payment_method_id.toString());
      } catch {
        console.error("Error loading payment methods");
      } finally {
        setLoading(false);
        //console.log(paymentMethods)
      }
    }
    load();
  }, [payment_method_id]);

  return (
    <Select
      name="payment_method_id"
      value={selectedValue}
      onValueChange={setSelectedValue}
      disabled={loading}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={loading ? "Carregando..." : "Sem método de pagamento"}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Sem método de pagamento</SelectItem>
        {paymentMethods.map((paymentMethod) => (
          <SelectItem key={paymentMethod.id} value={String(paymentMethod.id)}>
            {paymentMethod.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PaymentMethodSelector;