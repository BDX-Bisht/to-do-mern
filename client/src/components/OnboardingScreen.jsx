export default function OnboardingScreen({ onGetStarted }) {
  return (
    <div className="min-h-screen sm:min-h-[780px] flex flex-col bg-white">
      {/* Blue Hero Banner */}
      <div className="relative flex-1 min-h-[380px] bg-[#4461F2] overflow-hidden flex items-center justify-center">
        {/* Top-right ring accent */}
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-8 w-32 h-32 rounded-full border-[18px] border-white/10"
        />

        {/* Left decorative zigzag */}
        <svg
          aria-hidden="true"
          viewBox="0 0 120 56"
          className="absolute left-0 top-24 w-28 h-14 text-white/12"
          fill="none"
        >
          {[0, 14, 28].map((offsetY) => (
            <path
              key={offsetY}
              d={`M-8 ${14 + offsetY} L12 ${4 + offsetY} L32 ${14 + offsetY} L52 ${4 + offsetY} L72 ${14 + offsetY} L92 ${4 + offsetY} L112 ${14 + offsetY}`}
              stroke="currentColor"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>

        {/* Bottom-right decorative zigzag */}
        <svg
          aria-hidden="true"
          viewBox="0 0 120 56"
          className="absolute right-0 bottom-8 w-28 h-14 text-white/12"
          fill="none"
        >
          {[0, 14, 28].map((offsetY) => (
            <path
              key={offsetY}
              d={`M8 ${14 + offsetY} L28 ${4 + offsetY} L48 ${14 + offsetY} L68 ${4 + offsetY} L88 ${14 + offsetY} L108 ${4 + offsetY} L128 ${14 + offsetY}`}
              stroke="currentColor"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>

      {/* Bottom White Content */}
      <div className="px-7 pt-8 pb-9 bg-white">
        <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
          Manage What To Do
        </h1>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#6B7280]">
          The best way to manage what you have to do, don&apos;t forget your plans
        </p>

        <button
          type="button"
          onClick={onGetStarted}
          className="mt-9 w-full h-12 rounded-[6px] bg-[#4461F2] hover:bg-[#3551DF] active:scale-[0.99] text-white text-[15px] font-medium transition-all cursor-pointer"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

