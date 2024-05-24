import styled from "styled-components";

const LoadingDiv = styled.div`
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

interface Props {
  imageOnly?: boolean;
  rounded?: boolean;
}

function SpotifyObjectCardSkeleton({ imageOnly, rounded }: Props) {
  return (
    <div className={`flex flex-col p-2 overflow-hidden rounded-sm gap-2`}>
      <LoadingDiv
        className={`max-w-full max-h-full w-full pb-[100%] ${
          rounded ? "rounded-full" : "rounded-md"
        }`}
      ></LoadingDiv>
      {!imageOnly && (
        <>
          <LoadingDiv className='font-bold text-base bg-gray-500 w-full h-4 rounded-lg'></LoadingDiv>
          <LoadingDiv className='font-light text-sm bg-gray-500 w-1/2 h-[0.875rem] rounded-lg'></LoadingDiv>
        </>
      )}
    </div>
  );
}

export default SpotifyObjectCardSkeleton;
