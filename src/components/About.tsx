import { Shield, Network, Lock, Code, Cloud, Terminal } from 'lucide-react';

export default function About() {
  const skills = [
    { name: 'Network Security', icon: Network },
    { name: 'Penetration Testing', icon: Terminal },
    { name: 'Vulnerability Assessment', icon: Shield },
    { name: 'Cryptography', icon: Lock },
    { name: 'Secure Coding', icon: Code },
    { name: 'Cloud Security', icon: Cloud }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-white mb-4">
            About <span className="text-cyan-400">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-12" />

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                I'm a passionate cybersecurity specialist with expertise in ethical hacking, penetration testing, and secure system design. My mission is to make the digital world safer by identifying vulnerabilities before they can be exploited.
              </p>
              <p className="text-lg">
                With experience in various security domains and a deep understanding of hacker methodologies, I provide comprehensive security solutions that protect organizations from emerging threats.
              </p>
            </div>

            <div className="bg-slate-900 border border-blue-500/30 rounded-lg p-6 font-mono text-sm">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-gray-400">sanu@kali:~</span>
              </div>
              <div className="space-y-2">
                <div className="text-cyan-400">$ cat skills.txt</div>
                <div className="text-white pl-4">
                  - Network Security<br />
                  - Penetration Testing<br />
                  - Vulnerability Assessment<br />
                  - Security Architecture<br />
                  - Incident Response<br />
                  - Cryptography
                </div>
                <div className="text-cyan-400 mt-4">$ ls projects/</div>
                <div className="text-white pl-4">
                  secure-chat-app.py<br />
                  intrusion-detection.js<br />
                  vulnerability-scanner.go<br />
                  encryption-tool.cpp
                </div>
                <div className="text-cyan-400">$ <span className="animate-pulse">_</span></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Core Competencies</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <div
                  key={skill.name}
                  className="group bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/30 rounded-lg p-6 hover:border-cyan-400 transition-all hover:transform hover:scale-105 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <skill.icon className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-white font-semibold">{skill.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
