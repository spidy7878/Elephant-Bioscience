
interface Props {
  label: string;
  value: string | number;
  big?: boolean;
}

const Stat = ({ label, value, big }: Props) => {
  return (
    <div
      className={`${
        big
          ? "bg-[#b7bcc2] px-12 py-5 gap-4 mr-5 rounded-xl text-center shadow-md w-full"
          : "bg-white p-4 rounded-lg"
      }`}
    >
      <div className="text-sm text-gray-700">{label}</div>
      <div className="text-3xl font-bold text-black mt-1">{value}</div>
    </div>
  );
};

export default Stat;