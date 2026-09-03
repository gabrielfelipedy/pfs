import { getExpensesLimit } from "@/db/queries/limits";
import ErrorLoading from "@/components/error/ErrorLoading";
import LimitsPageContent from "./components/LimitsPageContent";

const page = async () => {
  let limits;

  try {
    limits = await getExpensesLimit();
  } catch (error) {
    console.error(error);
    return <ErrorLoading />;
  }

  return (
    <div>
      <h1 className="title">Limites por categoria</h1>

      <LimitsPageContent limits={limits} className="mt-10" />
    </div>
  );
};

export default page;
