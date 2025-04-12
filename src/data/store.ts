import { AuthState, SettingsState } from "@/types";
import { getCookie, deleteCookie } from "cookies-next";
// import { Values } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      currentSignupData: null,
      paymentMethods: [],
      setCurrentSignupData: (data) => set({ currentSignupData: data }),
      checkAuth: async () => {
        const token = await getCookie("accessToken");
        const isAuthenticated = await getCookie("isAuthenticated");
        set({ isAuthenticated: !!(token && isAuthenticated) });
        return !!(token && isAuthenticated);
      },
      resetSignupState: () => set({ currentSignupData: null }),
    }),
    {
      name: "auth-storage",
      storage:
        typeof window !== "undefined"
          ? {
            getItem: (name) => {
              const item = localStorage.getItem(name);
              return item ? JSON.parse(item) : null;
            },
            setItem: (name, value) => {
              localStorage.setItem(name, JSON.stringify(value));
            },
            removeItem: (name) => {
              localStorage.removeItem(name);
            },
          }
          : undefined, // Fix Next.js hydration issue
    }
  )
);

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "settings-storage",
    }
  )
);

interface SavedLists {
  id: string;
  name: string;
  users: number;
  posts: number;
}

// Massage component states
interface globalStates {
  clickedMsg: string | null;
  isPinned: boolean;
  likedList: string[];
  savedList: SavedLists[];
  hiddenMassages: string[];
  pinnedList: string[];
  savedDialogOpen: boolean;
  isReplied: boolean;
  restricted: string[];
  popUpactions: { isReport: boolean; isBlock: boolean; isDelete: boolean };
  popUpOpen: boolean;
  replying: { targetId: string; repliedText: string };
  isGallery: boolean;
  isMobile: boolean;
  hasHydrated: boolean;
  setHasHydrated: (Value: boolean) => void;
  setIsMobile: (value: boolean) => void;
  setISGallery: (value: boolean) => void;
  setPopupOpen: (value: boolean) => void;
  addRestricted: (value: string) => void;
  remnoveRestricted: (value: string) => void;
  addReplying: (key: "targetId" | "repliedText", value: string) => void;
  setpopUpactions: (
    key: "isReport" | "isBlock" | "isDelete",
    value: boolean
  ) => void;
  setIsReplied: (value: boolean) => void;
  addSavedList: (newList: SavedLists) => void;
  SetSavedDialogOpen: (value: boolean) => void;
  setClikedMsg: (value: string) => void;
  setIsPinned: (value: boolean) => void;
  addPinned: (id: string) => void;
  removePinned: (value: string) => void;
  addLiked: (id: string) => void;
  removeLiked: (id: string) => void;
  addHidden: (id: string) => void;
  clearClickedMsg: () => void;
}

export const useMassageStore = create<globalStates>()(
  persist(
    (set) => ({
      isPinned: false,
      likedList: [],
      savedList: [],
      replying: { targetId: "", repliedText: "" },
      hiddenMassages: [],
      pinnedList: [],
      pinnedMassages: {},
      isReplied: false,
      restricted: [],
      savedDialogOpen: false,
      popUpactions: { isReport: false, isBlock: false, isDelete: false },
      popUpOpen: false,
      isGallery: false,
      isMobile: false,
      hasHydrated: false,
      clickedMsg:
        typeof window !== "undefined"
          ? localStorage.getItem("clickedMsg") || null
          : null,
      setClikedMsg: (msg) => {
        set({ clickedMsg: msg });
        if (typeof window !== "undefined" && msg) {
          localStorage.setItem("clickedMsg", msg);
        }
      },
      setHasHydrated: (val: boolean) => set({ hasHydrated: val }),
      setIsMobile: (value) => set({ isMobile: value }),
      setISGallery: (value) => set({ isGallery: value }),
      setPopupOpen: (value) => set({ popUpOpen: value }),
      setpopUpactions: (key, value) =>
        set((state) => ({
          popUpactions: { ...state.popUpactions, [key]: value },
        })),
      addRestricted: (id) =>
        set((state) => ({ restricted: [...state.restricted, id] })),
      remnoveRestricted: (id) =>
        set((state) => ({
          restricted: state.restricted.filter((res) => res !== id),
        })),
      SetSavedDialogOpen: (value) => set({ savedDialogOpen: value }),
      // setClikedMsg: (value) => set({ clickedMsg: value }),
      setIsPinned: (value) => set({ isPinned: value }),
      setIsReplied: (value) => set({ isReplied: value }),
      addPinned: (id) =>
        set((state) => ({ pinnedList: [...state.pinnedList, id] })),
      removePinned: (id) =>
        set((state) => ({
          pinnedList: state.pinnedList.filter((pinned) => pinned !== id),
        })),
      addLiked: (id) =>
        set((state) => ({ likedList: [...state.likedList, id] })),
      addReplying: (key, value) =>
        set((state) => ({ replying: { ...state.replying, [key]: value } })),
      removeLiked: (id) =>
        set((state) => ({
          likedList: state.likedList.filter((liked) => liked !== id),
        })),
      addHidden: (id) =>
        set((state) => ({ hiddenMassages: [...state.hiddenMassages, id] })),
      addSavedList: (newList) =>
        set((state) => ({ savedList: [...state.savedList, newList] })),
      clearClickedMsg: () => {
        set({ clickedMsg: null });
        if (typeof window !== "undefined") {
          localStorage.removeItem("clickedMsg");
        }
      },
    }),
    {
      name: "massage-states",
    }
  )
);

interface LightboxState {
  images: string | string[];
  isOpen: boolean;
  openLightbox: (images: string | string[]) => void;
  closeLightbox: () => void;
}

export const useLightboxStore = create<LightboxState>((set) => ({
  images: "",
  isOpen: false,

  openLightbox: (images) =>
    set({
      images,
      isOpen: true,
    }),

  closeLightbox: () => set({ images: "", isOpen: false }),
}));

interface useProfileStore {
  isLiked: boolean;
  setIsLiked: (value: boolean) => void;
  isCommented: boolean;
  setIsCommented: (value: boolean) => void;
}

export const useProfileStore = create<useProfileStore>()(
  persist(
    (set) => ({
      isLiked: false,
      setIsLiked: (value) => set({ isLiked: value }),
      isCommented: false,
      setIsCommented: (value) => set({ isCommented: value }),
    }),
    {
      name: "massage-states",
    }
  )
);

/**
 * Resets all stores to their initial state.
 * This function can be called from anywhere in the application,
 * typically used during logout or when needing to clear all application state.
 */
export const resetAllStores = () => {
  // Reset auth store
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    currentSignupData: null,
    paymentMethods: [],
  });

  // Reset settings store
  useSettingsStore.setState({
    theme: "light",
  });

  // Reset massage store
  useMassageStore.setState({
    isPinned: false,
    likedList: [],
    savedList: [],
    replying: { targetId: "", repliedText: "" },
    hiddenMassages: [],
    pinnedList: [],
    // Remove pinnedMassages as it's not defined in the globalStates interface
    isReplied: false,
    restricted: [],
    savedDialogOpen: false,
    popUpactions: { isReport: false, isBlock: false, isDelete: false },
    popUpOpen: false,
    isGallery: false,
    isMobile: false,
    hasHydrated: false,
    clickedMsg: null,
  });

  // Reset lightbox store
  useLightboxStore.setState({
    images: "",
    isOpen: false,
  });

  // Reset profile store
  useProfileStore.setState({
    isLiked: false,
    isCommented: false,
  });

  // Clear cookies
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  deleteCookie("isAuthenticated");

  // Clear localStorage if needed
  if (typeof window !== "undefined") {
    localStorage.removeItem("clickedMsg");
  }
};
