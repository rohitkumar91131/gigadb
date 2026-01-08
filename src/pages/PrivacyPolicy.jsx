import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="space-y-4 border-b pb-8">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg">
              Last updated: January 8, 2026
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8 text-zinc-700 dark:text-zinc-300 leading-relaxed">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">1. Introduction</h2>
              <p>
                Welcome to GigaDB. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit our website 
                and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">2. Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                <li><strong>Usage Data:</strong> includes information about how you use our website and database services.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">3. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. 
                In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">5. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at: 
                <a href="mailto:support@gigadb.com" className="text-blue-600 hover:underline ml-1">support@gigadb.com</a>
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}