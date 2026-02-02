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
        className="inline-flex flex-col justify-center items-center gap-2 sm:gap-3 mx-auto my-auto rounded-2xl border border-white/10 shadow-lg text-center font-medium text-black backdrop-blur-lg transition-all duration-300 hover:shadow-2xl aspect-square min-w-[90px] min-h-[90px] sm:min-w-[110px] sm:min-h-[110px] md:min-w-[130px] md:min-h-[130px] p-2 sm:p-4"
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
        <span className="text-xs sm:text-sm md:text-base font-normal text-black truncate whitespace-nowrap overflow-hidden">
          {label}
        </span>
        <div className="text-2xl sm:text-3xl md:text-4xl font-normal text-black mt-1 sm:mt-2">
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
