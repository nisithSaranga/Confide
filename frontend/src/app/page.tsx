import Image from "next/image";
import Link from "next/link";
import BackToTop from "./components/BackToTop";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-[#0A306D] px-47 py-4 flex items-center">
  <div className="flex items-center gap-3 cursor-pointer">
    <Image src="/logo.png" alt="Confide" width={100} height={100} />
    <div>
      <div className="text-white font-bold text-lg leading-none cursor-pointer">Confide - Private STI Screening for Men</div>
    </div>
  </div>
  <div className="flex items-center px-6 gap-6 ml-auto">
      <Link 
        href="/login" 
        className="text-white text-sm font-medium border border-transparent rounded-lg px-4 py-2 hover:border-white/40 hover:bg-white/10 transition-all duration-300"
      >
        Log in
      </Link>
      <Link 
        href="/register" 
        className="text-white text-sm font-medium border border-transparent rounded-lg px-4 py-2 hover:border-white/40 hover:bg-white/10 transition-all duration-300"
      >
        Register
      </Link>
    </div>
</nav>

      <section className="relative overflow-hidden" style={{ backgroundColor: "#051A3D" }}>
        {/* Layered wave background */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 700"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0A306D" />
              <stop offset="100%" stopColor="#051A3D" />
            </linearGradient>
            <linearGradient id="waveFront" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B4DA2" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#051A3D" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          <rect width="1440" height="700" fill="url(#waveBack)" />

          {/* Back wave layer */}
          <path
            fill="url(#waveFront)"
            d="M0,220L80,235C160,250,320,280,480,270C640,260,800,210,960,205C1120,200,1280,240,1360,260L1440,280L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          />

          {/* Front wave layer, offset lower for depth */}
          <path
            fill="#0B4DA2"
            opacity="0.25"
            d="M0,320L80,330C160,340,320,360,480,355C640,350,800,320,960,315C1120,310,1280,330,1360,340L1440,350L1440,700L1360,700C1280,700,1120,700,960,700C800,700,640,700,480,700C320,700,160,700,80,700L0,700Z"
          />

          {/* Glow accents */}
          <circle cx="1150" cy="140" r="220" fill="#0C52B5" opacity="0.35" filter="url(#blurFilter)" />
          <circle cx="200" cy="500" r="180" fill="#0B4DA2" opacity="0.2" filter="url(#blurFilter)" />

          <filter id="blurFilter">
            <feGaussianBlur stdDeviation="60" />
          </filter>
        </svg>

        <div className="relative z-10 max-w-6xl mx-auto text-center px-6 py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Check your skin privately
          </h1>
          <p className="text-blue-100 text-base mb-12 max-w-lg mx-auto">
            Preliminary screening for HPV, HSV & Syphilis - processed entirely on your device.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 text-left">
            {[
              { n: "1", title: "Upload a photo", desc: "Choose from the gallery or take a photo of the affected area." },
              { n: "2", title: "On-device analysis", desc: "Your photos stays on your device instead of Cloud uploads." },
              { n: "3", title: "Instant result", desc: "See a result or an honest inconclusive flag." },
              { n: "4", title: "Consult a doctor", desc: "For a confirmed diagnosis, if needed." },
            ].map((step) => (
              <div key={step.n} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-[#FF2B34] text-white text-sm font-bold flex items-center justify-center mb-3">{step.n}</div>
                <div className="text-white font-semibold text-sm mb-1">{step.title}</div>
                <div className="text-blue-100 text-xs leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>

          <Link href="/classify">
            <button className="h-14 px-10 rounded-full bg-[#FF2B34] text-white font-bold text-base uppercase tracking-wide shadow-lg hover:brightness-90 transition-all cursor-pointer">
              Get Instant Result
            </button>
          </Link>
          <p className="text-blue-100 text-xs mt-4">
            This is a preliminary screening tool, not a confirmed medical diagnosis.
          </p>
        </div>
      </section>

      {/* Why Confide worth using */}
      <section className="max-w-6xl mx-auto px-15 py-10">
        <h2 className="text-2xl font-bold text-[#0A306D] mb-10 text-center">Why is Confide worth using?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-30">
          {[
            {
              title: "Private",
              desc: "Your photo is processed entirely on your device. Nothing is uploaded, stored, or transmitted.",
              icon: (
                <svg viewBox="0 0 40 40" className="w-9 h-9">
                  <path d="M20 6 L32 12 V20 C32 28 27 34 20 36 C13 34 8 28 8 20 V12 Z" fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                  <circle cx="20" cy="20" r="4" fill="white" />
                </svg>
              ),
            },
            {
              title: "No Account Needed",
              desc: "Start a screening immediately. Registration is only needed if you want to save results.",
              icon: (
                <svg viewBox="0 0 40 40" className="w-9 h-9">
                  <path d="M22 6 L12 22 H19 L17 34 L29 16 H22 Z" fill="white" />
                </svg>
              ),
            },
            {
              title: "Honest Results",
              desc: "When the model isn't confident, it says so instead of forcing a guess.",
              icon: (
                <svg viewBox="0 0 40 40" className="w-9 h-9">
                  <path d="M8 12 Q8 8 12 8 H28 Q32 8 32 12 V22 Q32 26 28 26 H18 L12 32 V26 H12 Q8 26 8 22 Z" fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M16 16 L19 19 L25 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              ),
            },
            {
              title: "Free to Use",
              desc: "No pricing tiers, no subscriptions. Screening is available to everyone at no cost.",
              icon: (
                <svg viewBox="0 0 40 40" className="w-9 h-9">
                  <path d="M20 32 C20 32 6 23 6 14 C6 9 10 6 14 6 C17 6 19 8 20 10 C21 8 23 6 26 6 C30 6 34 9 34 14 C34 23 20 32 20 32 Z" fill="white" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.title}
              className="relative pr-6 md:pr-8 md:border-r md:border-blue-200 last:border-r-0 text-center"
              >
              <div className="w-16 h-16 rounded-full bg-[#0B4DA2] flex items-center justify-center mb-4 mx-auto">
                {item.icon}
              </div>
              <h3 className="font-semibold text-[#0A306D] text-sm mb-2">{item.title}</h3>
              <p className="text-[#0A306D] text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
     
      {/* Informational section */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 py-6 grid md:grid-cols-[320px_1fr] gap-10 items-center bg-[#F3F7FF] border border-[#CFE0FF] rounded-2xl mb-10">
        <div className="bg-[#E7F0FF] rounded-2xl p-6 flex items-center justify-center min-h-[260px] ">
          <div className="relative w-56">
            <Image
              src="/body.png"
              alt="Anatomical reference figure"
              width={400}
              height={700}
              className="w-full h-auto"
            />
            {/* Popping marker — adjust the top-[57%] value below to nudge position */}
            <div className="absolute top-[50%] left-1/2 -translate-x-1/2">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2B34] opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FF2B34]" />
              </span>
            </div>
          </div>
        </div>

        <div>
         <h2 className="text-xl sm:text-2xl font-bold text-[#0A306D] mb-3">
           Stay Informed About Your Anogenital Skin
         </h2>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            Confide helps you notice and understand visible changes, privately and on your own terms.
          </p>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-[#16A34A] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ">✓</span>
              Anogenital skin changes can be uncomfortable to discuss, but frequently lead patients to seek clinical care
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-[#16A34A] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ">✓</span>
              Visible changes may develop gradually and be easy to overlook
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-[#16A34A] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ">✓</span>
              HPV, HSV & Syphilis can present with visually similar symptoms
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-[#16A34A] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ">✓</span>
              Early awareness supports a timely conversation with a healthcare provider
            </li>
          </ul>
        </div>
      </section>
      
      {/* How to use Confide */}
      <section className="max-w-6xl mx-auto px-16 pt-6 pb-16 border-t border-slate-100">
        <h2 className="text-2xl font-bold text-[#0A306D] mb-10 text-center">How to use Confide?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="relative px-8 md:border-r md:border-blue-200">
            <div className="absolute top-2 left-4 w-7 h-7 rounded-full bg-[#2864B7] text-white text-xs font-bold flex items-center justify-center">
               1
            </div>
            <div className="relative h-28 flex items-center justify-center mb-4">
              <svg viewBox="0 0 100 100" className="w-24 h-24">
                <rect x="35" y="15" width="50" height="85" rx="4" fill="none" stroke="#334155" strokeWidth="1.5" />
                <circle cx="50" cy="42" r="14" fill="none" stroke="#FF2B34" strokeWidth="1.2" strokeDasharray="3 2" />
              </svg>
            </div>
            <h3 className="font-semibold text-[#0A306D] text-sm mb-2 text-center">Capture a photo</h3>
            <p className="text-slate-600 text-xs leading-relaxed text-center">
              Get close enough that the area fills the frame, in good light, without hair or clothing in the way
            </p>
          </div>

          <div className="relative px-8 md:border-r md:border-blue-200">
            <div className="absolute top-2 left-4 w-7 h-7 rounded-full bg-[#2864B7] text-white text-xs font-bold flex items-center justify-center">
              2
            </div>
            <div className="relative h-28 flex items-center justify-center mb-4">
              <svg viewBox="0 0 100 100" className="w-24 h-24">
                <rect x="35" y="10" width="50" height="85" rx="4" fill="none" stroke="#334155" strokeWidth="1.5" />
                <path d="M38 35 C42 29 46 27 50 27 C54 27 58 29 62 35 C58 41 54 43 50 43 C46 43 42 41 38 35 Z" fill="none" stroke="#0B4DA2"strokeWidth="2" />
                <circle cx="50" cy="35" r="3.5" fill="none" stroke="#0B4DA2" strokeWidth="2" />
                <circle cx="50" cy="35" r="20" fill="none" stroke="#0B4DA2" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
              </svg>
            </div>
            <h3 className="font-semibold text-[#0A306D] text-sm mb-2 text-center">Submit privately</h3>
            <p className="text-slate-600 text-xs leading-relaxed text-center">
              Your photo stays on your device throughout.Nothing is uploaded or transmitted to anywhere.
            </p>
          </div>

          <div className="relative px-8">
            <div className="absolute top-2 left-4 w-7 h-7 rounded-full bg-[#2864B7] text-white text-xs font-bold flex items-center justify-center">
              3
            </div>
            <div className="relative h-28 flex items-center justify-center mb-4">
              <svg viewBox="0 0 100 100" className="w-24 h-24">
                <circle cx="35" cy="30" r="16" fill="none" stroke="#22C55E" strokeWidth="2" />
                <path d="M28 30 L33 35 L43 24" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <rect x="30" y="52" width="60" height="40" rx="3" fill="none" stroke="#334155" strokeWidth="1.5" />
                <line x1="36" y1="62" x2="64" y2="62" stroke="#334155" strokeWidth="1.2" />
                <line x1="36" y1="68" x2="64" y2="68" stroke="#334155" strokeWidth="1.2" />
                <line x1="36" y1="74" x2="54" y2="74" stroke="#334155" strokeWidth="1.2" />
              </svg>
            </div>
            <h3 className="font-semibold text-[#0A306D] text-sm mb-2 text-center">Receive your result</h3>
            <p className="text-slate-600 text-xs leading-relaxed text-center">
              Receive your result together with related guidance on the next steps to take.
            </p>
          </div>
        </div>
        {/*<p className="text-slate-400 text-xs mt-8">*This is a preliminary screening result, not a confirmed medical diagnosis.</p>*/}
      </section>

      {/* How Confide predicts your condition */}
      <section className="max-w-6xl mx-auto px-8 md:px-10 pt-8 pb-6 mb-8 bg-blue-50 border border-blue-100 rounded-2xl">
        <h2 className="text-xl font-bold text-[#0A306D] text-center mb-7">
          How does Confide analyze images?
        </h2>

        <div className="flex items-center justify-center gap-2 flex-wrap md:flex-nowrap">
          {[
  {
    icon: "ti-camera",
    title: "Photo Provided",
    desc: "Select or capture a photo."
  },
  {
    icon: "ti-shield-check",
    title: "Skin checked on-device",
    desc: "The app confirms the photo shows skin."
  },
  {
    icon: "ti-brain",
    title: "Two models compare",
    desc: "Their predictions are combined to produce a result."
  },
  {
    icon: "ti-file-check",
    title: "Preliminary result",
    desc: "A result or an inconclusive outcome is shown."
  },
].map((step, i, arr) => (
            <div key={step.title} className="flex items-center">

  <div className="
    relative
    w-[205px] h-[108px]
    bg-white
    border border-slate-200
    rounded-xl
    shadow-sm
    px-3 py-3
  ">

    {/* Step number */}
    <div className="
      absolute top-2 left-1
      w-6 h-6
      rounded-full
      bg-[#0BA84A]
      text-white
      text-xs font-bold
      flex items-center justify-center
    ">
      {i + 1}
    </div>

    {/* Icon + text */}
    <div className="flex items-center gap-2 h-full pt-2">

      <div className="w-10 flex-shrink-0 flex justify-center">
        <i
          className={`ti ${step.icon} text-[#10B981] text-[32px]`}
        />
      </div>

      <div className="text-left">
        <div className="text-[12px] font-bold text-[#0A306D] leading-tight mb-1">
       {step.title}
       </div>

       <div className="text-[11px] text-slate-600 leading-snug">
        {step.desc}
       </div>
      </div>

    </div>
  </div>

  {i < arr.length - 1 && (
    <div className="hidden md:flex items-center px-1">
      <i className="ti ti-arrow-right text-[#2864B7] text-xl font-bold" />
    </div>
  )}

</div>
          ))}
        </div>

        <p className="text-center text-slate-400 text-xs mt-8">
          🔒 All processing happens on your device-images are not uploaded or stored.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-[#061F46] border-t border-blue-900/40 px-8 py-5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[260px_1fr_320px] gap-8 place-items-stretch">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm self-end justify-self-start">
            <Link href="/privacy" className="text-blue-300 text-xs hover:text-blue-200">Privacy Policy</Link>
              <Link href="/terms" className="text-blue-300 text-xs hover:text-blue-200">Terms of Use</Link>
          </div>
          <div className="max-w-2xl">
            <p className="text-blue-200 text-xs leading-5 mb-2">
              Confide is not intended to provide a medical diagnosis, it provides a confidential
              preliminary screening result to help inform whether a conversation with a
              healthcare provider may be worthwhile.
           </p>
           <p className="text-blue-200 text-xs leading-5 mb-2">
              If you have any questions about our system, contact us via email{" "}
            <Link href="mailto:nisithsaranga@gmail.com" className="text-blue-300 underline">
              nisithsaranga13@gmail.com
            </Link>
           </p>
          </div>
          <div className="flex items-center gap-1 text-xs self-end justify-self-end">
             <Link
                href="https://github.com/nisithSaranga/Confide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 text-xs"
                >
                  Confide
              </Link>

              <span className="text-blue-300 text-xs"> | </span>

             <Link
               href="https://www.linkedin.com/in/nisith-saranga-0529732a5/"
               target="_blank"
               rel="noopener noreferrer"
               className="text-blue-300 text-xs"
                >
               Developed by Nisith Saranga
               </Link>

                <span className="text-blue-300 text-xs"> © 2026</span>
          </div>
        </div>
      </footer>

      <BackToTop />
    </main>
  );
}