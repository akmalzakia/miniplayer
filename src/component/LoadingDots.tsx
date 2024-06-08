import styled from "styled-components";

const LoadingDots = styled.div`
  width: 15px;
  aspect-ratio: 1;
  border-radius: 50%;
  animation: x 1s infinite linear alternate;

  @keyframes x {
    0%  {box-shadow: 20px 0 #fff, -20px 0 #fff2;background: #fff }
    33% {box-shadow: 20px 0 #fff, -20px 0 #fff2;background: #fff2}
    66% {box-shadow: 20px 0 #fff2,-20px 0 #fff; background: #fff2}
    100%{box-shadow: 20px 0 #fff2,-20px 0 #fff; background: #fff }
  }
`

export default LoadingDots;