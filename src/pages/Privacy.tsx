import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Lock className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Privacy <span className="text-cyan-400">Policy</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-6" />
              <p className="text-gray-400">Last updated: January 2025</p>
            </div>

            <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-8 md:p-12 space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                <p className="leading-relaxed">
                  This Privacy Policy explains how Sanu (Somesh Ranjan Biswal) collects, uses, and protects your personal information when you visit and use this portfolio website. Your privacy is important, and we are committed to protecting your personal data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-400 mb-2">2.1 Authentication Information</h3>
                    <p className="leading-relaxed">
                      When you sign in to access projects, we collect authentication data through Clerk, including your email address, name, and profile information. This information is necessary to provide you access to protected content.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-400 mb-2">2.2 Device Information</h3>
                    <p className="leading-relaxed">
                      We may collect information about your device including browser type, IP address, operating system, and device identifiers for security and analytics purposes.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-400 mb-2">2.3 Usage Data</h3>
                    <p className="leading-relaxed">
                      We collect information about how you interact with the website, including pages visited, time spent, and navigation patterns.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-400 mb-2">2.4 Contact Information</h3>
                    <p className="leading-relaxed">
                      When you submit a contact form or subscribe to the newsletter, we collect your name, email address, and message content.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                <p className="leading-relaxed mb-4">We use the collected information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>To provide access to authenticated project content</li>
                  <li>To respond to your inquiries and communication requests</li>
                  <li>To send newsletter updates if you have subscribed</li>
                  <li>To improve website functionality and user experience</li>
                  <li>To ensure security and prevent unauthorized access</li>
                  <li>To analyze usage patterns and optimize content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Data Protection and Security</h2>
                <p className="leading-relaxed">
                  We implement industry-standard security measures to protect your personal information. All authentication is handled through Clerk, which uses secure encryption protocols. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Services</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-400 mb-2">5.1 Clerk Authentication</h3>
                    <p className="leading-relaxed">
                      We use Clerk for user authentication and account management. Clerk's privacy policy applies to the data they process on our behalf.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-400 mb-2">5.2 External Links</h3>
                    <p className="leading-relaxed">
                      This website may contain links to external sites (GitHub, etc.). We are not responsible for the privacy practices of these external sites.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
                <p className="leading-relaxed">
                  We use cookies and similar tracking technologies to maintain session information and improve user experience. You can control cookie settings through your browser preferences, though this may affect website functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
                <p className="leading-relaxed mb-4">You have the following rights regarding your personal data:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Access: Request a copy of your personal data</li>
                  <li>Correction: Request correction of inaccurate data</li>
                  <li>Deletion: Request deletion of your personal data</li>
                  <li>Opt-out: Unsubscribe from newsletters at any time</li>
                  <li>Data portability: Request your data in a portable format</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
                <p className="leading-relaxed">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
                <p className="leading-relaxed">
                  This website is not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Your continued use of the website after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                <p className="leading-relaxed mb-4">
                  If you have any questions or concerns about this Privacy Policy or wish to exercise your rights, please contact:
                </p>
                <div className="p-4 bg-slate-950 border border-blue-500/30 rounded-lg">
                  <p className="text-cyan-400">Email: someshranjanbiswal13678@gmail.com</p>
                  <p className="text-cyan-400">Location: Odisha, India</p>
                </div>
              </section>

              <div className="border-t border-blue-500/30 pt-8 text-center">
                <p className="text-gray-400 mb-4">
                  By using this website, you consent to the collection and use of information as described in this Privacy Policy.
                </p>
                <Link
                  to="/"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
