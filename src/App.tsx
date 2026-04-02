import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner";
import { PetHouseProvider } from "./components/PetHouseContext";

export default function App() {
  return (
    <PetHouseProvider>
      <RouterProvider router={router} />
      <Toaster />
    </PetHouseProvider>
  );
}