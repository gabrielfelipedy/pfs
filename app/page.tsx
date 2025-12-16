//import Image from "next/image";
import Navbar from "../components/Navbar";
import OperationsTable from "@/components/OperationsTable";

export default function Home() {

  return (
    <main>
      <nav>
        <Navbar />
      </nav>
      
      <OperationsTable />
    </main> 
  );
}
