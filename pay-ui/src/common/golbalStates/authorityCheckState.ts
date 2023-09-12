import { create } from "zustand";

const useAuthorityCheck = create(set => ({
    canAccessProject: {},
    setCanAccessProject: (canAccess: boolean) => {
        // will be called only onece
        set({ canAccessProject: canAccess });
    },
}));

export default useAuthorityCheck;
