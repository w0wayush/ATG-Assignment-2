import { selector } from "recoil";
import { postState } from "../atoms/post";

export const isPostLoading = selector({
  key: "isPostLoadingState",
  get: ({ get }) => {
    const state = get(postState);

    return state.isLoading;
  },
});

export const postDetails = selector({
  key: "postDetailsState",
  get: ({ get }) => {
    const state = get(postState);

    return state.post || "";
  },
});

export const postTitle = selector({
  key: "postTitleState",
  get: ({ get }) => {
    const state = get(postState);
    if (state.post) {
      //@ts-ignore
      return state.post.title || "";
    }
    return "";
  },
});

export const postDescription = selector({
  key: "postDescriptionState",
  get: ({ get }) => {
    const state = get(postState);
    if (state.post) {
      //@ts-ignore
      return state.post.description || "";
    }
    return "";
  },
});

export const postPrice = selector({
  key: "postPriceState",
  get: ({ get }) => {
    const state = get(postState);
    if (state.post) {
      //@ts-ignore
      return state.post.price || "";
    }
    return "";
  },
});

export const postImage = selector({
  key: "postImageState",
  get: ({ get }) => {
    const state = get(postState);
    if (state.post) {
      //@ts-ignore
      return state.post.imageLink;
    }
    return "";
  },
});
