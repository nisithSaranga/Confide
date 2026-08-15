import Image from "next/image";
import Link from "next/link";

export default function Terms() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-[#0A306D] px-6 py-4 flex items-center gap-3">
        <Link href="/">
          <Image src="/logo.png" alt="Confide" width={100} height={100}/>
        </Link>
        <span className="text-white font-bold text-lg">Confide - Confidential Medical Screening for Men</span>
        
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="text-[#0B4DA2] text-sm hover:underline mb-6 inline-block">← Back</Link>
        <h1 className="text-3xl font-bold text-[#0A306D] mb-2">Terms of Use</h1>
        <p className="text-slate-400 text-sm mb-8">Effective Date:August 14, 2026 </p>

        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">1. Acceptance of these terms</h2>
            <p>
              By using Confide, you agree to these Terms of Use. If you don&apos;t agree, please
              don&apos;t use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">2. Eligibility</h2>
            <p className="italic text-slate-400">
             Confide is intended for use by individuals aged 18 and over. This age requirement
             reflects the capacity to independently accept these Terms, and reflects that a
             health-screening tool involving image capture is not designed for use by minors
             at this stage of development.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">3. What Confide is and isn&apos;t</h2>
            <p>
              Confide is a final-year academic project providing preliminary, on-device visual
              screening for HPV, HSV & Syphilis. It is <strong>not a medical device</strong> and
              does <strong>not provide a diagnosis</strong>. Results are not reviewed by a medical
              professional. Always consult a qualified healthcare provider for diagnosis or treatment,
              regardless of what result Confide shows you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">4. How the service works</h2>
            <p>
              Photos you submit are processed entirely on your own device and are never transmitted
              to any server. If you register an account, only your email, a securely hashed password
              & any results you choose to save (condition name and confidence score only, never
              the image) are stored — see our{" "}
              <Link href="/privacy" className="text-[#0B4DA2] hover:underline">Privacy Policy</Link> for details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">5. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Attempt to access, disrupt, or reverse-engineer the service beyond fair academic review</li>
              <li>Use automated tools (bots, scrapers) to interact with the service</li>
              <li>Submit content you don&apos;t have the right to submit</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">6. No cost</h2>
            <p>Confide is free to use. There are no fees, subscriptions, or paid tiers.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">7. Disclaimer</h2>
            <p>
              Confide is provided &quot;as is,&quot; as an academic prototype. We don&apos;t guarantee it will
              be error-free, uninterrupted, or that any result is accurate. It is not a substitute
              for professional medical advice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">8. Changes to these terms</h2>
            <p>These terms may be updated as the project develops. Continued use after a change means you accept the update.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#0A306D] mb-2">9. Contact</h2>
            <p>
              If you have any questions or concerns about these Terms or the Services, please contact us by e-mail at: {" "}
              <Link href="mailto:nisithsaranga13@gmail.com" className="font-medium text-[#0A306D]">
                nisithsaranga@gmail.com
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}