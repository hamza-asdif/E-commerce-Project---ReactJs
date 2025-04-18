import { useContext } from "react";
import { GlobalContextExport as GlobalContext } from "./GlobalContext";

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
