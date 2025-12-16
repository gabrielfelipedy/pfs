//import Image from "next/image";
import OperationDataTable from "@/components/data-table/columns";
import Navbar from "../components/Navbar";
import OperationsTable from "@/components/OperationsTable";
import DataTablePage from "@/components/data-table/DataTablePage";

export default function Home() {

  return (
    <>

    <section className="mt-20">
      <DataTablePage />
      </section>
    </>
  );
}
