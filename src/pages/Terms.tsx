import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Terms & <span className="text-cyan-400">Conditions</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-6" />
              <p className="text-gray-400">Last updated: January 2025</p>
            </div>

            <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-8 md:p-12 space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="leading-relaxed">
                  By accessing and using this portfolio website and viewing the projects contained herein, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Intellectual Property Rights</h2>
                <p className="leading-relaxed mb-4">
                  All projects, code, documentation, and content displayed on this website are the intellectual property of Sanu (Somesh Ranjan Biswal) unless otherwise stated. This includes but is not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Source code and software applications</li>
                  <li>Documentation and technical materials</li>
                  <li>Design elements and visual content</li>
                  <li>Written content and descriptions</li>
                  <li>Cybersecurity tools and utilities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Copyright Protection</h2>
                <p className="leading-relaxed mb-4">
                  All projects and materials on this website are protected by copyright law. Unauthorized reproduction, distribution, or commercial use of any content without explicit written permission is strictly prohibited and may result in legal action.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Use Restrictions</h2>
                <p className="leading-relaxed mb-4">You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Copy, reproduce, or republish any project code or materials without permission</li>
                  <li>Use any projects or code for commercial purposes without authorization</li>
                  <li>Claim authorship or ownership of any projects displayed</li>
                  <li>Remove or alter any copyright notices or attributions</li>
                  <li>Distribute, sell, or license any content from this website</li>
                  <li>Use the projects in any way that violates applicable laws or regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Authentication and Access</h2>
                <p className="leading-relaxed">
                  Access to certain projects requires authentication. By creating an account, you agree to provide accurate information and maintain the security of your account credentials. You are responsible for all activities that occur under your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Educational and Portfolio Purpose</h2>
                <p className="leading-relaxed">
                  The projects displayed on this website are primarily for educational and portfolio demonstration purposes. While some projects may be available for reference, any use beyond personal education requires explicit permission from the owner.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Security Tools Disclaimer</h2>
                <p className="leading-relaxed">
                  Any cybersecurity tools, penetration testing utilities, or security-related code displayed on this website are intended for ethical and legal security research only. Users must comply with all applicable laws and regulations when using or referencing these tools.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Liability Disclaimer</h2>
                <p className="leading-relaxed">
                  The projects and code are provided "as is" without warranty of any kind. The owner is not liable for any damages or losses arising from the use or inability to use the content on this website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Modifications to Terms</h2>
                <p className="leading-relaxed">
                  These terms and conditions may be updated at any time without prior notice. Continued use of this website after any changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Contact Information</h2>
                <p className="leading-relaxed">
                  For questions about these Terms & Conditions, permissions, or licensing inquiries, please contact:
                </p>
                <div className="mt-4 p-4 bg-slate-950 border border-blue-500/30 rounded-lg">
                  <p className="text-cyan-400">Email: someshranjanbiswal13678@gmail.com</p>
                  <p className="text-cyan-400">GitHub: github.com/ei-sanu</p>
                </div>
              </section>

              <div className="border-t border-blue-500/30 pt-8 text-center">
                <p className="text-gray-400 mb-4">
                  By using this website and viewing the projects, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
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
//terms page
