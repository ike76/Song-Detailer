export const SET_CURRENT = "SET_CURRENT";
export const setCurrent = (attrName, currentObj) => {
  return {
    type: SET_CURRENT,
    payload: { attrName, currentObj }
  };
};
export const OPEN_MODAL = "OPEN_MODAL";
export const openModal = name => ({
  type: OPEN_MODAL,
  name
});
export const CLOSE_MODAL = "CLOSE_MODAL";
export const closeModal = () => ({
  type: CLOSE_MODAL
});
