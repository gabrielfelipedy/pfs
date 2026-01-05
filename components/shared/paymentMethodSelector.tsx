"use client";

import { useEffect, useState } from "react";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";

import { PaymentMethod } from "@/lib/definitions";
import { fetchPaymentMethodsAction } from "@/actions/payment-method-actions";

interface Props {
  payment_method_id: number | undefined;
}

const PaymentMethodSelector = ({ payment_method_id }: Props) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedValue, setSelectedValue] = useState<number | undefined>(
    payment_method_id
  );

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const data = await fetchPaymentMethodsAction();
        setPaymentMethods(data);

        if (payment_method_id) setSelectedValue(payment_method_id);
      } catch (error) {
        console.error("Error loading payment methods");
      } finally {
        setLoading(false);
        //console.log(categories)
      }
    }
    load();
  }, [payment_method_id]);

  return (
    <NativeSelect
      name="payment_method_id"
      value={selectedValue}
      onChange={(e) => setSelectedValue(Number(e.target.value))}
      disabled={loading}
    >
      <NativeSelectOption value={undefined}>
        {loading ? "Carregando..." : "Sem método de pagamento"}
      </NativeSelectOption>
      {paymentMethods.map((cat) => (
        <NativeSelectOption key={cat.id} value={cat.id}>
          {cat.name}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
};

export default PaymentMethodSelector;
