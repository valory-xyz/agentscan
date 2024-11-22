import { motion } from "framer-motion";

interface AnimatedRobotProps {
  scale?: number;
}

export default function AnimatedRobot({ scale = 1 }: AnimatedRobotProps) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ transform: `scale(${scale})` }}
    >
      <motion.svg
        width="100"
        height="100"
        viewBox="20 20 160 160"
        animate={{
          y: [-11, 11, -11],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Robot Head */}
        <rect x="40" y="40" width="120" height="120" rx="20" fill="#9333EA" />

        {/* Eyes */}
        <circle cx="80" cy="90" r="15" fill="white" />
        <circle cx="120" cy="90" r="15" fill="white" />
        <circle cx="80" cy="90" r="8" fill="black" />
        <circle cx="120" cy="90" r="8" fill="black" />

        {/* Smile */}
        <path
          d="M70 120 Q100 140 130 120"
          fill="none"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Decorative bolts */}
        <circle cx="50" cy="50" r="5" fill="#7C3AED" />
        <circle cx="150" cy="50" r="5" fill="#7C3AED" />
        <circle cx="50" cy="150" r="5" fill="#7C3AED" />
        <circle cx="150" cy="150" r="5" fill="#7C3AED" />
      </motion.svg>
    </div>
  );
}
