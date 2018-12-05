export const SET_CURRENT = "SET_CURRENT";
export const setCurrent = (attrName, attrId) => {
  return {
    type: SET_CURRENT,
    payload: { attrName, attrId }
  };
};
