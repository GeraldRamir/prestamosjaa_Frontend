import { useContext } from "react";
import PagosContext from "../context/PagosProvider";

const usePagos = () => {
    return useContext(PagosContext);
};

export default usePagos;
