// ...existing code...
export default function TestPage() {
  return (
    <div className="flex flex-row gap-4 w-full justify-center items-center min-h-screen bg-gray-50 p-8">
      <video controls width="480" className="rounded shadow">
        <source src="/30001-0120.hevc.mp4" type="video/mp4; codecs=hevc" />
        Your browser does not support the video tag.
      </video>
      <video controls width="480" className="rounded shadow">
        <source src="/30001-0120.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
