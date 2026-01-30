export default function TestPage() {
  return (
    <div className="flex w-full justify-center items-center min-h-screen bg-gray-50 p-8">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="alphaVideo w-[480px]"
      >
        {/* Safari (HEVC + alpha) */}
        <source src="/30001-0120.hevc.mp4" type='video/mp4; codecs="hvc1"' />
        {/* Chrome / Firefox */}
        <source src="/30001-0120.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="alphaVideo w-[480px]"
      >
        {/* Safari (HEVC + alpha) */}
        <source src="/8.hevc.mp4" type='video/mp4; codecs="hvc1"' />
        {/* Chrome / Firefox */}
        <source src="/8.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
