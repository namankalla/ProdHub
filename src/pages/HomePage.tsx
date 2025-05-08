import React from 'react';
import { motion } from 'framer-motion';
import { GitMerge, GitBranch, Users, Music2 } from 'lucide-react';
import RepositoryCard from '../components/Repository/RepositoryCard';
import { Link } from '../components/ui/Link';

const HomePage: React.FC = () => {
  // Mock data for featured repositories
  const featuredRepos = [
    {
      title: "Deep-House-Project",
      description: "A deep house track with complex layering and custom synths. Ready for collaboration on the drop section.",
      username: "beatmaker99",
      stars: 154,
      forks: 28,
      lastUpdated: "3 days ago",
      genre: "Deep House",
      bpm: 124
    },
    {
      title: "Trap-Beat-Collection",
      description: "A collection of trap beats with heavy 808s and unique percussion. Looking for vocal collaborators.",
      username: "trapgod5000",
      stars: 89,
      forks: 12,
      lastUpdated: "5 days ago",
      genre: "Trap",
      bpm: 140
    },
    {
      title: "Synthwave-80s-Tribute",
      description: "A synthwave project inspired by the 80s with analog synth modeling and retro drums.",
      username: "retrowave",
      stars: 212,
      forks: 34,
      lastUpdated: "1 week ago",
      genre: "Synthwave",
      bpm: 110
    }
  ];

  const features = [
    {
      icon: <GitBranch className="h-8 w-8 text-purple-500" />,
      title: "Branch & Experiment",
      description: "Create branches to experiment with different arrangements, sounds, and mixing without affecting your main project."
    },
    {
      icon: <GitMerge className="h-8 w-8 text-cyan-400" />,
      title: "Merge & Collaborate",
      description: "Collaborate with other producers, merge your ideas, and create something better together."
    },
    {
      icon: <Users className="h-8 w-8 text-amber-400" />,
      title: "Build a Community",
      description: "Connect with producers worldwide, share your work, and get feedback from the community."
    },
    {
      icon: <Music2 className="h-8 w-8 text-green-400" />,
      title: "Showcase Your Music",
      description: "Present your finished tracks with style, complete with waveform previews and audio playback."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-20 px-4 overflow-hidden relative"
      >
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500"
          >
            GitHub for FL Studio Producers
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
          >
            Version control your FL Studio projects, collaborate with other producers,
            and build your music portfolio with ProdHub.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth/signup" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-medium text-white hover:from-purple-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-purple-500/20">
              Get Started
            </Link>
            <Link href="/explore" className="px-8 py-3 bg-gray-800 rounded-lg font-medium text-white hover:bg-gray-750 transition-colors">
              Explore Projects
            </Link>
          </motion.div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-600/10 to-cyan-500/10"
              style={{
                height: 100 + Math.random() * 400,
                width: 100 + Math.random() * 400,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                opacity: [0, 0.2, 0.1]
              }}
              transition={{
                delay: 0.5 + i * 0.1,
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
      </motion.section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-950/80">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Why ProdHub?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A platform built by producers, for producers. Manage your FL Studio projects like never before.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-purple-900/10 hover:translate-y-[-4px] transition-all"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Projects Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Featured Projects</h2>
            <Link href="/explore" className="text-purple-400 hover:text-purple-300 transition-colors">
              View all →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRepos.map((repo, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <RepositoryCard {...repo} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-gray-800 to-gray-850 p-8 md:p-12 rounded-2xl shadow-lg border border-gray-700 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to elevate your music production?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of FL Studio producers who are already using ProdHub to manage their projects, collaborate with others, and showcase their work.
            </p>
            <Link href="/auth/signup" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-medium text-white hover:from-purple-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-purple-500/20">
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;