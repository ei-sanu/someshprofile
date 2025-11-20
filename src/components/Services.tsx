import { Shield, Users, BookOpen, Lock, Search, Code } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Search,
      title: 'Penetration Testing',
      description: 'Comprehensive security assessments to identify vulnerabilities in your systems before attackers do.'
    },
    {
      icon: Shield,
      title: 'Security Consulting',
      description: 'Expert advice on securing your digital assets and implementing robust security measures.'
    },
    {
      icon: BookOpen,
      title: 'Security Training',
      description: 'Educate your team on security best practices and ethical hacking techniques.'
    }
  ];

  const projectCategories = [
    { name: 'Net Works', icon: Lock },
    { name: 'Encryption utilities', icon: Shield },
    { name: 'Front-End Web Dev', icon: Code },
    { name: 'Secure coding templates', icon: Users }
  ];

  return (
    <>
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Exclusive <span className="text-cyan-400">Projects</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-6" />
              <p className="text-xl text-gray-300 mb-8">
                Check Out the Most Exclusive Projects
              </p>
              <p className="text-gray-400 max-w-3xl mx-auto">
                Discover a collection of powerful cybersecurity tools and Full Stack Web-Apps projects that can enhance your digital security:
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {projectCategories.map((category, index) => (
                <div
                  key={category.name}
                  className="bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/30 rounded-lg p-6 hover:border-cyan-400 transition-all hover:transform hover:scale-105 cursor-pointer text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <category.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold">{category.name}</h3>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="/projects"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50"
              >
                View Projects
              </a>
              <p className="text-gray-500 text-sm mt-4">* Sign in required to access projects</p>
            </div>

            <div className="mt-16 bg-slate-900/50 border border-blue-500/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Project Access</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-cyan-400 font-semibold mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Full Access
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3" />
                      Source Code
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3" />
                      Documentation
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3" />
                      Live Demos
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3" />
                      Updates
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-gray-400 font-semibold mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    View Only
                  </h4>
                  <ul className="space-y-2 text-gray-500">
                    <li className="flex items-center line-through">
                      <div className="w-2 h-2 bg-gray-600 rounded-full mr-3" />
                      Source Code
                    </li>
                    <li className="flex items-center line-through">
                      <div className="w-2 h-2 bg-gray-600 rounded-full mr-3" />
                      Documentation
                    </li>
                    <li className="flex items-center line-through">
                      <div className="w-2 h-2 bg-gray-600 rounded-full mr-3" />
                      Live Demos
                    </li>
                    <li className="flex items-center line-through">
                      <div className="w-2 h-2 bg-gray-600 rounded-full mr-3" />
                      Updates
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-center text-white mb-4">
              <span className="text-cyan-400">Services</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-12" />

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className="bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/30 rounded-xl p-8 hover:border-cyan-400 transition-all hover:transform hover:scale-105 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <service.icon className="w-16 h-16 text-cyan-400 mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
