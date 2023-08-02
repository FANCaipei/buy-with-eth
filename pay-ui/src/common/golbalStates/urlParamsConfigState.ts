import { create } from "zustand";

const useUrlParamsConfig = create(set => ({
    paramsFromUrl: {},
    initParamsFromUrl: (paramsObj: any) => {
        // will be called only onece
        set({ paramsFromUrl: paramsObj }, true);
    },
}));

export default useUrlParamsConfig;
