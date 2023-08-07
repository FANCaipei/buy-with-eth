import { create } from "zustand";
import { User } from "firebase/auth";

const useFirebaseAuth = create(set => ({
    isReady: false,
    user: null,
    setReady: (_isReady: boolean) => {
        set({ isReady: true });
    },
    setCurrentUser: (user: User | null) => {
        set({ user: user });
    },
}));

export default useFirebaseAuth;
