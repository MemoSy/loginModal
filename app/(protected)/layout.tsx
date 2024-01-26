import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};



const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return ( 
    <div className="h-[100%] w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-400 to-green-800">
      <Navbar />
      {children}
    </div>
   );
}

export default ProtectedLayout;