import { motion } from "framer-motion";

interface Props {
  label: string;
  value: string | number;
  big?: boolean;
}

const Stat = ({ label, value, big }: Props) => {
  if (big) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="inline-flex flex-col justify-center items-center gap-2 sm:gap-3 mx-auto my-auto rounded-2xl border border-white/10 shadow-lg text-center font-medium text-black backdrop-blur-lg transition-all duration-300 hover:shadow-2xl w-[110px] h-[110px] sm:w-[170px] sm:h-[170px] sm:shrink-0 p-4 sm:p-10"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(255,255,255,0.18)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(255,255,255,0.08)";
        }}
      >
        <span className="text-xs sm:text-sm md:text-base font-normal text-black whitespace-normal sm:whitespace-nowrap sm:truncate sm:overflow-hidden text-center leading-tight">
          {label}
        </span>
        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black mt-1 sm:mt-2 font-mono w-full text-center">
          {value}
        </div>
      </motion.div>
    );
  }
  return (
    <div className="bg-white p-2 sm:p-4 rounded-lg">
      <div className="text-xs sm:text-sm text-gray-700">{label}</div>
      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black mt-1">
        {value}
      </div>
    </div>
  );
};

export default Stat;
