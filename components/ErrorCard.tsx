import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Social } from "./Social";

export const ErrorCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="text-destructive ml-2 flex gap-2 items-center">
        <ExclamationTriangleIcon className="text-destructive" />
        {children}
      </div>
      <Social />
    </div>
  );
};
