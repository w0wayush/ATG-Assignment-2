import { atom } from "recoil";

export const postState = atom({
  key: "postState",
  default: {
    isLoading: true,
    post: null,
  },
});
