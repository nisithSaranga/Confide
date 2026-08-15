import Image from "next/image";
import Link from "next/link";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-[#0A306D] px-47 py-4 flex items-center gap-3 w-full">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Confide"
          width={100}
          height={100}
        />
      <span className="text-white font-bold text-lg">
        Confide - Private STI Screening for Men
      </span>
          </Link>
    </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="text-[#0B4DA2] text-sm hover:underline mb-6 inline-block">← Back</Link>
        <h1 className="text-3xl font-bold text-[#0A306D] mb-2">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-8">Last updated: August 14, 2026</p>

        <div className="bg-blue-50 rounded-xl p-5 mb-10">
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>The short version:</strong> your photo is analyzed entirely on your own device
            and is never uploaded, transmitted, or stored anywhere. We don&apos;t see it. This isn&apos;t
            a policy promise — it&apos;s how the system is built.
          </p>
        </div>

        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">1. What Confide is</h2>
            <p>
              Confide is a final-year academic project: an on-device tool for preliminary visual
              screening of HPV, HSV, and syphilis. It is not a commercial medical product and is
              not reviewed or endorsed by any healthcare authority. It does not provide a diagnosis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">2. Your photo</h2>
            <p>
              When you submit a photo, it is processed by classification models running directly
              in your browser, on your own device. The photo is never sent to any server, never
              stored, and never seen by anyone — including us. Closing the tab or navigating away
              discards it completely.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">3. What we do collect</h2>
            <p className="mb-2">
              You can use Confide&apos;s screening feature without creating an account. If you choose
              to register, we collect and store:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your email address</li>
              <li>A securely hashed version of your password — we never store or see your actual password</li>
              <li>
                If you choose to save a result: the predicted condition name and confidence
                score. The image itself is never part of this — it was already discarded before
                the result was shown to you.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">4. Where this is stored</h2>
            <p>
              Account and saved-result data is stored in a database used solely to operate this
              project. It is not shared with, or sold to, any third party.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">5. Your rights</h2>
            <p>
              You can delete your account and all associated saved results at any time from your
              account settings. This permanently removes your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">6. Age eligibility</h2>
            <p className="italic text-slate-400">
                Confide is intended for use by individuals aged 18 and over. This age requirement
                reflects the capacity to independently accept these Terms, and reflects that a
                health-screening tool involving image capture is not designed for use by minors
                at this stage of development.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">7. Changes to this policy</h2>
            <p>
              As this project develops, this policy may be updated to reflect changes. Continued
              use after an update means you accept the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">8. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please feel free to contact us.: {" "}
             <Link href="mailto:nisithsaranga13@gmail.com" className="font-medium text-[#0A306D]">nisithsaranga@gmail.com</Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}