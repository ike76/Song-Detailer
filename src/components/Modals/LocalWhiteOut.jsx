import React from "react";
import styled from "styled-components";
//

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
  ${p =>
    p.whiteout
      ? `
  filter: blur(2px);
  transform: scale(0.95);
  `
      : ""}
`;
const LocalWhiteOut = ({ children, showWhiteOut, message }) => {
  return (
    <>
      <BlurDiv whiteout={showWhiteOut}>{children}</BlurDiv>
      <WhiteBackground whiteout={showWhiteOut} />
      {showWhiteOut && <MessageDiv>{message}</MessageDiv>}
    </>
  );
};

export default LocalWhiteOut;
