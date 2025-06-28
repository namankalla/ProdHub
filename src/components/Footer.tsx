import React from 'react';
import { Github, Music, Heart } from 'lucide-react';
import { Link } from './ui/Link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 py-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Music className="h-6 w-6 text-purple-500" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-400">
                ProdHub
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              The platform where FL Studio producers collaborate, version control their projects, and share their music with the world.
            </p>
            <div className="flex space-x-4 text-gray-500">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <Music className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-white font-medium">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/docs" className="hover:text-purple-400 transition-colors">Documentation</Link>
              </li>
              <li>
                <Link href="/tutorials" className="hover:text-purple-400 transition-colors">Tutorials</Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-purple-400 transition-colors">API</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-purple-400 transition-colors">Blog</Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-white font-medium">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-purple-400 transition-colors">About</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-purple-400 transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-purple-400 transition-colors">Terms</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ProdHub. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for music producers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
