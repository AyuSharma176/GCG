// Shared page loader — dual-ring spinner with theme colours
export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="relative w-20 h-20">
        {/* Track */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "3px solid rgb(var(--gcg-accent) / 0.15)" }}
        />
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            border: "3px solid transparent",
            borderTopColor: "rgb(var(--gcg-accent))",
          }}
        />
        {/* Inner ring (reverse) */}
        <div
          className="absolute inset-2 rounded-full animate-spin"
          style={{
            border: "2px solid transparent",
            borderTopColor: "rgb(var(--gcg-light))",
            animationDirection: "reverse",
            animationDuration: "0.8s",
          }}
        />
      </div>
      <p
        className="text-base animate-pulse tracking-wide"
        style={{ color: "rgb(var(--gcg-light) / 0.5)" }}
      >
        {message}
      </p>
    </div>
  );
}
