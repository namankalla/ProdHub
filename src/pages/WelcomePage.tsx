import React from 'react';
import { GitMerge, GitBranch, Users, Music2 } from 'lucide-react';
import { Link } from '../components/ui/Link';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <GitBranch className="h-8 w-8 text-purple-500" />,
      title: 'Branch & Experiment',
      description: 'Create branches to experiment with different arrangements, sounds, and mixing without affecting your main project.'
    },
    {
      icon: <GitMerge className="h-8 w-8 text-cyan-400" />,
      title: 'Merge & Collaborate',
      description: 'Collaborate with other producers, merge your ideas, and create something better together.'
    },
    {
      icon: <Users className="h-8 w-8 text-amber-400" />,
      title: 'Build a Community',
      description: 'Connect with producers worldwide, share your work, and get feedback from the community.'
    },
    {
      icon: <Music2 className="h-8 w-8 text-green-400" />,
      title: 'Showcase Your Music',
      description: 'Present your finished tracks with style, complete with waveform previews and audio playback.'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Enhanced Hero Section */}
      <section className="pt-24 pb-32 px-4 overflow-hidden relative">
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8">
            <Music2 className="h-16 w-16 mx-auto text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-300 to-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            Version Control for FL Studio Producers
          </h1>

          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-10 leading-relaxed font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            Version control your projects, collaborate with other producers,
            and build your music portfolio with ProdHub.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold text-white hover:from-purple-400 hover:to-cyan-400 transition-all shadow-lg hover:shadow-purple-500/20 text-lg"
            >
              <span className="flex items-center gap-2">
                Get Started
                <span className="text-white">→</span>
              </span>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Active Producers', value: '10,000+' },
              { label: 'Projects Created', value: '25,000+' },
              { label: 'Collaborations', value: '5,000+' },
              { label: 'Daily Updates', value: '1,000+' }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all group">
                <div className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-white/90 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated Track Lanes Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Color cycling overlay */}
          <motion.div 
            className="absolute inset-0 z-0"
            animate={{
              background: [
                'linear-gradient(to bottom right, rgba(147, 51, 234, 0.25), rgba(34, 211, 238, 0.15))',
                'linear-gradient(to bottom right, rgba(168, 85, 247, 0.25), rgba(6, 182, 212, 0.15))',
                'linear-gradient(to bottom right, rgba(192, 132, 252, 0.25), rgba(8, 145, 178, 0.15))',
                'linear-gradient(to bottom right, rgba(217, 70, 239, 0.25), rgba(14, 165, 233, 0.15))',
                'linear-gradient(to bottom right, rgba(147, 51, 234, 0.25), rgba(34, 211, 238, 0.15))'
              ]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Animated Track Lanes */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-16"
              style={{
                top: `${i * 64}px`,
                backdropFilter: 'blur(8px)',
              }}
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ 
                x: "100%",
                opacity: [0, 0.7, 0.7, 0],
                background: [
                  `linear-gradient(to right, ${i % 2 
                    ? 'rgba(147, 51, 234, 0.25)' 
                    : 'rgba(34, 211, 238, 0.25)'} 0%, transparent 100%)`,
                  `linear-gradient(to right, ${i % 2 
                    ? 'rgba(168, 85, 247, 0.25)' 
                    : 'rgba(6, 182, 212, 0.25)'} 0%, transparent 100%)`,
                  `linear-gradient(to right, ${i % 2 
                    ? 'rgba(192, 132, 252, 0.25)' 
                    : 'rgba(8, 145, 178, 0.25)'} 0%, transparent 100%)`,
                  `linear-gradient(to right, ${i % 2 
                    ? 'rgba(217, 70, 239, 0.25)' 
                    : 'rgba(14, 165, 233, 0.25)'} 0%, transparent 100%)`,
                  `linear-gradient(to right, ${i % 2 
                    ? 'rgba(147, 51, 234, 0.25)' 
                    : 'rgba(34, 211, 238, 0.25)'} 0%, transparent 100%)`
                ]
              }}
              transition={{
                x: {
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.3
                },
                opacity: {
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.3,
                  times: [0, 0.1, 0.9, 1]
                },
                background: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            />
          ))}

          {/* Pattern Blocks */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-14 rounded-lg backdrop-blur-md"
              style={{
                width: '200px',
                top: `${(i * 128) + 1}px`,
                left: `${((i % 3) * 33) + 10}%`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1],
                y: [0, -5, 0],
                background: [
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.25), rgba(34, 211, 238, 0.25))',
                  'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(6, 182, 212, 0.25))',
                  'linear-gradient(135deg, rgba(192, 132, 252, 0.25), rgba(8, 145, 178, 0.25))',
                  'linear-gradient(135deg, rgba(217, 70, 239, 0.25), rgba(14, 165, 233, 0.25))',
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.25), rgba(34, 211, 238, 0.25))'
                ],
                boxShadow: [
                  '0 0 20px rgba(147, 51, 234, 0.15)',
                  '0 0 20px rgba(168, 85, 247, 0.15)',
                  '0 0 20px rgba(192, 132, 252, 0.15)',
                  '0 0 20px rgba(217, 70, 239, 0.15)',
                  '0 0 20px rgba(147, 51, 234, 0.15)'
                ]
              }}
              transition={{
                duration: 3,
                background: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                },
                boxShadow: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                },
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
                times: [0, 0.5, 1]
              }}
            />
          ))}

          {/* Animated Playhead */}
          <motion.div
            className="absolute top-0 bottom-0 w-1"
            initial={{ x: "-100vw", opacity: 0 }}
            animate={{ 
              x: "100vw",
              opacity: [0, 0.7, 0.7, 0],
              background: [
                'linear-gradient(to bottom, transparent, rgba(147, 51, 234, 0.4), rgba(34, 211, 238, 0.4), transparent)',
                'linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.4), rgba(6, 182, 212, 0.4), transparent)',
                'linear-gradient(to bottom, transparent, rgba(192, 132, 252, 0.4), rgba(8, 145, 178, 0.4), transparent)',
                'linear-gradient(to bottom, transparent, rgba(217, 70, 239, 0.4), rgba(14, 165, 233, 0.4), transparent)',
                'linear-gradient(to bottom, transparent, rgba(147, 51, 234, 0.4), rgba(34, 211, 238, 0.4), transparent)'
              ],
              boxShadow: [
                '0 0 30px rgba(147, 51, 234, 0.25)',
                '0 0 30px rgba(168, 85, 247, 0.25)',
                '0 0 30px rgba(192, 132, 252, 0.25)',
                '0 0 30px rgba(217, 70, 239, 0.25)',
                '0 0 30px rgba(147, 51, 234, 0.25)'
              ]
            }}
            transition={{
              duration: 6,
              background: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              },
              boxShadow: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              },
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.1, 0.9, 1]
            }}
          />

          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 0.6, 0],
                background: i % 2 ? [
                  'rgba(147, 51, 234, 0.2)',
                  'rgba(168, 85, 247, 0.2)',
                  'rgba(192, 132, 252, 0.2)',
                  'rgba(217, 70, 239, 0.2)',
                  'rgba(147, 51, 234, 0.2)'
                ] : [
                  'rgba(34, 211, 238, 0.2)',
                  'rgba(6, 182, 212, 0.2)',
                  'rgba(8, 145, 178, 0.2)',
                  'rgba(14, 165, 233, 0.2)',
                  'rgba(34, 211, 238, 0.2)'
                ]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                background: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                },
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-950/80">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
              Why ProdHub?
            </h2>
            <p className="text-gray-200 max-w-2xl mx-auto text-lg font-medium">
              A platform built by producers, for producers. Manage your FL Studio projects like never before.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:border-purple-500/50 transition-all group"
              >
                <div className="mb-4 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 mix-blend-overlay" />
            <div className="bg-gradient-to-r from-gray-800 to-gray-850 p-12 md:p-16 rounded-2xl shadow-lg border border-gray-700 text-center relative">
              <div>
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                  Ready to elevate your music production?
                </h2>
                <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto font-medium">
                  Join thousands of FL Studio producers using ProdHub to manage projects, collaborate, and showcase their work.
                </p>
                <Link
                  href="/auth/signup"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-medium text-white hover:from-purple-500 hover:to-cyan-400 transition-all shadow-lg hover:shadow-purple-500/20"
                >
                  Join Now
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
