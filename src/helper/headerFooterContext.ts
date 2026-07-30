import { createContext } from "react";

export const HeaderFooterContext = createContext({
    disabled: false,
    setDisabled: (_: boolean) => { }
});