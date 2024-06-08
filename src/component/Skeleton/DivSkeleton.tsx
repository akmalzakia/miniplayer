import styled from "styled-components";

const DivSkeleton = styled.div`
  background: linear-gradient(to right, #6b7280, #90959d, #6b7280);
  background-size: 600% 600%;
  animation: loading 3s ease infinite;

  @keyframes loading {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

export default DivSkeleton;
