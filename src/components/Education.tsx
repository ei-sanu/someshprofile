import { GraduationCap, Award, Users, Globe } from 'lucide-react';

export default function Education() {
  const highlights = [
    { icon: Award, text: 'NAAC A++ accredited institution' },
    { icon: Users, text: 'Ranked among Top 50 Universities in India' },
    { icon: Globe, text: 'Collaborations with 300+ global universities' },
    { icon: GraduationCap, text: 'Strong focus on research and innovation' }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 p-1 rounded-full mb-4">
              <div className="bg-slate-900 rounded-full px-6 py-2">
                <span className="text-cyan-400 font-semibold">Cybersecurity Specialist</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-blue-500/30 rounded-2xl p-8 hover:border-cyan-400 transition-all">
            <div className="flex items-start space-x-6 mb-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  B.Tech in Computer Science & Engineering
                </h3>
                <div className="flex items-center space-x-3 text-cyan-400 mb-2">
                  <span className="font-semibold">Lovely Professional University</span>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-400">2024 - 2028</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Pursuing my B.Tech degree at LPU, one of India's largest private universities known for its innovative approach to education and industry integration.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <highlight.icon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{highlight.text}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-blue-500/30 pt-6">
              <p className="text-gray-400 text-sm mb-4">
                LPU features a 700+ acre high-tech campus with world-class infrastructure and industry-focused curriculum.
              </p>
              <a
                href="https://www.lpu.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105"
              >
                APPLY FOR LPUNEST
              </a>
              <p className="text-gray-500 text-xs mt-2">
                After LPUNEST, proceed to the official LPU website for admission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
