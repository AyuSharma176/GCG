const loaderStyles = `
  @keyframes gcg-rotate1 {
    0%   { transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg); }
    100% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg); }
  }
  @keyframes gcg-rotate2 {
    0%   { transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg); }
    100% { transform: rotateX(50deg) rotateY(-10deg) rotateZ(360deg); }
  }
  @keyframes gcg-rotate3 {
    0%   { transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg); }
    100% { transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg); }
  }
  .gcg-ring {
    width: 80px;
    height: 80px;
    border: 0px solid transparent;
    border-radius: 50%;
    position: absolute;
  }
  .gcg-ring-1 {
    border-bottom-width: 8px;
    border-color: rgb(var(--gcg-accent));
    animation: gcg-rotate1 2s linear infinite;
  }
  .gcg-ring-2 {
    border-right-width: 8px;
    border-color: rgb(var(--gcg-light) / 0.85);
    animation: gcg-rotate2 2s linear infinite;
  }
  .gcg-ring-3 {
    border-top-width: 8px;
    border-color: rgb(var(--gcg-accent) / 0.55);
    animation: gcg-rotate3 2s linear infinite;
  }
`;

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <style>{loaderStyles}</style>
      <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: 80, height: 80 }}>
        <div className="gcg-ring gcg-ring-1" />
        <div className="gcg-ring gcg-ring-2" />
        <div className="gcg-ring gcg-ring-3" />
      </div>
      <p className="text-base tracking-wide" style={{ color: "rgb(var(--gcg-light))" }}>
        {message}
      </p>
    </div>
  );
}
