import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { Lock, Github, ExternalLink, Filter } from 'lucide-react';
import { projects } from '../data/projects';

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                My <span className="text-cyan-400">Projects</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-6" />
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Explore my collection of cybersecurity tools and applications
              </p>
            </div>

            <SignedOut>
              <div className="max-w-2xl mx-auto text-center py-20">
                <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-12">
                  <Lock className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Authentication Required
                  </h2>
                  <p className="text-gray-300 mb-8 text-lg">
                    Please sign in to view my exclusive projects and access detailed documentation.
                  </p>
                  <SignInButton mode="modal">
                    <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50">
                      Sign In to Continue
                    </button>
                  </SignInButton>
                  <p className="text-gray-500 text-sm mt-6">
                    By signing in, you agree to our Terms & Conditions and Privacy Policy
                  </p>
                </div>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
                <Filter className="w-5 h-5 text-cyan-400" />
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                        : 'bg-slate-900 border border-blue-500/30 text-gray-300 hover:border-cyan-400'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="group bg-slate-900 border border-blue-500/30 rounded-xl overflow-hidden hover:border-cyan-400 transition-all hover:transform hover:scale-105 cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-48 overflow-hidden bg-slate-950">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-cyan-600 text-white text-xs font-semibold rounded-full">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Tech Stack:</p>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-blue-950 border border-blue-500/30 text-cyan-400 text-xs rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-blue-500/30">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-950 border border-blue-500/30 text-gray-300 rounded-lg hover:border-cyan-400 hover:text-cyan-400 transition-all"
                          >
                            <Github className="w-4 h-4" />
                            <span className="text-sm font-medium">Code</span>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm font-medium">Live</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No projects found in this category.</p>
                </div>
              )}
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}
