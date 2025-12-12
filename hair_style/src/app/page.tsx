




import Option from "@/components/Option";


export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primaryColor/10 via-white to-white relative overflow-hidden py-10 px-4">

      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primaryColor/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="z-10 w-full max-w-md flex flex-col items-center gap-8 animate-fadeIn">

        {/* Header / Logo Area */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primaryColor tracking-tight">HairStyle AI</h1>
          <p className="text-gray-500 text-sm">Discover your perfect look instantly</p>
        </div>

        <div className="w-full bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl p-6">
          <Option />
        </div>

      </div>

    </div>
  );
}

