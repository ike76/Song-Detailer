export const mapStateWhenReady = (state, names) => {
  const adminId = state.current.adminId;
  const readyDataPaths = names.reduce((obj, name) => {
    const path = `accounts/${adminId}/${name}`;
    if (state.firestore.status.requested[path])
      obj[name] = state.firestore.data.accounts[adminId][name];
    return obj;
  }, {});
  return { ...readyDataPaths, adminId: state.current.adminId };
};
