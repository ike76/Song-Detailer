import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
//
import OverwriteWithGroup from "./WhiteOutMessages/OverwriteWithGroup.jsx";
import AreYouSure from "./WhiteOutMessages/AreYouSure.jsx";
import NameThisGroup from "./WhiteOutMessages/NameThisGroup.jsx";
import GroupOrCustom from "./WhiteOutMessages/GroupOrCustom.jsx";
import { closeWhiteout } from "../../actions/currentActions";

const WhiteBackground = styled.div`
  ${p =>
    p.whiteout
      ? `
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #ffffffcc;
  height: 100%;
  z-index: 2;
  `
      : ""}
  transition: all .3s;
`;
const MessageDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
`;
const BlurDiv = styled.div`
  transition: 0.3s all;
  ${p => (p.whiteout ? "filter: blur(2px)" : "")};
`;
const WhiteOut = ({ children, whiteout, closeWhiteout, whiteoutProps }) => {
  const whiteoutMap = {
    overwriteWithGroup: (
      <OverwriteWithGroup {...whiteoutProps} cancel={closeWhiteout} />
    ),

    areYouSure: <AreYouSure {...whiteoutProps} cancel={closeWhiteout} />,
    nameThisGroup: <NameThisGroup {...whiteoutProps} cancel={closeWhiteout} />,
    groupOrCustom: <GroupOrCustom {...whiteoutProps} cancel={closeWhiteout} />
  };
  return (
    <>
      <BlurDiv whiteout={whiteout}>{children}</BlurDiv>
      <WhiteBackground whiteout={whiteout} />
      {whiteout && (
        <MessageDiv
          onClick={whiteoutProps.noBackgroundCancel ? null : closeWhiteout}
        >
          <div onClick={e => e.stopPropagation()}>{whiteoutMap[whiteout]}</div>
        </MessageDiv>
      )}
    </>
  );
};
const mapState = state => ({
  whiteout: state.current.whiteout,
  whiteoutProps: state.current.whiteoutProps
});
const mapDispatch = {
  closeWhiteout
};
export default connect(
  mapState,
  mapDispatch
)(WhiteOut);
