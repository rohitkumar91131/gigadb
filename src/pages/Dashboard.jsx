import { DashboardProvider } from "@/context/DashboardContext";
import { useParams } from "react-router-dom";
import DashboardHeader from "./dashboard/DashboardHeader";
import CollectionContent from "./dashboard/ModelContent";
import CollectionSidebar from "./dashboard/ModelSidebar";



export default function Dashboard() {
  const { userid } = useParams();

  return (
    <DashboardProvider>

      <div className="grid h-screen w-full grid-rows-[auto_1fr] md:grid-cols-[250px_1fr] overflow-hidden bg-background">
        
        {/* --- Area 1: Header (Spans across full width on desktop) --- */}
        <div className="md:col-span-2 border-b z-20">
          <DashboardHeader />
        </div>

        {/* --- Area 2: Sidebar (Hidden on mobile, Fixed on Desktop) --- */}
        {/* overflow-y-auto yahan lagaya hai taki sirf sidebar scroll ho */}
        <div className="hidden md:block border-r bg-muted/10 overflow-y-auto overflow-x-hidden">
          < CollectionSidebar/>
        </div>

        {/* --- Area 3: Main Content --- */}
        {/* overflow-y-auto yahan lagaya hai taki sirf content scroll ho */}
        <div className="overflow-y-auto bg-muted/20">
          <CollectionContent />
        </div>
        
      </div>
    </DashboardProvider>
  );
}