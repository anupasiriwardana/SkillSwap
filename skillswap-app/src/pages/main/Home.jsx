// pages/main/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Video, Star, Calendar, MessageCircle, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1625' }}>
      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Share Skills,
            <span style={{ color: '#a855f7' }}> Learn Together</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with people worldwide to exchange knowledge. Teach what you know, learn what you want, 
            and build meaningful connections through skill sharing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup"
              className="px-8 py-4 rounded-lg text-white font-medium text-lg transition-all hover:opacity-90 flex items-center justify-center"
              style={{ backgroundColor: '#a855f7' }}
            >
              Start Learning <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/how-it-works"
              className="px-8 py-4 rounded-lg border border-gray-600 text-white font-medium text-lg hover:border-gray-500 transition-colors"
            >
              How it Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Three Ways to Share Knowledge
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Teach & Learn */}
            <div className="p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: '#a855f7' }}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Teach & Learn</h3>
              <p className="text-gray-300">
                Exchange skills directly with others. Teach guitar, learn Spanish. 
                No points needed - just pure knowledge sharing.
              </p>
            </div>

            {/* Learn Only */}
            <div className="p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: '#a855f7' }}>
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Learn Only</h3>
              <p className="text-gray-300">
                Want to focus on learning? Use points to access expert teachers 
                and dive deep into new skills.
              </p>
            </div>

            {/* Teach Only */}
            <div className="p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: '#a855f7' }}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Teach Only</h3>
              <p className="text-gray-300">
                Share your expertise and earn points. Help others grow while 
                building your teaching reputation.
              </p>
            </div>
          </div>

          {/* Platform Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <Video className="w-8 h-8" style={{ color: '#a855f7' }} />
              <div>
                <h4 className="font-semibold text-white">HD Video Calls</h4>
                <p className="text-gray-300 text-sm">Built-in video with screen sharing</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Calendar className="w-8 h-8" style={{ color: '#a855f7' }} />
              <div>
                <h4 className="font-semibold text-white">Smart Scheduling</h4>
                <p className="text-gray-300 text-sm">Google Calendar integration</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <MessageCircle className="w-8 h-8" style={{ color: '#a855f7' }} />
              <div>
                <h4 className="font-semibold text-white">Real-time Chat</h4>
                <p className="text-gray-300 text-sm">Stay connected with your matches</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Getting Started is Simple
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: '#a855f7' }}>
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Sign Up</h3>
              <p className="text-gray-300 text-sm">Create your profile and add your skills</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: '#a855f7' }}>
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Matched</h3>
              <p className="text-gray-300 text-sm">AI finds your perfect learning partners</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: '#a855f7' }}>
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Connect</h3>
              <p className="text-gray-300 text-sm">Chat and schedule your sessions</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: '#a855f7' }}>
                4
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Learn</h3>
              <p className="text-gray-300 text-sm">Start your learning journey</p>
            </div>
          </div>
          
          <Link 
            to="/how-it-works"
            className="text-lg hover:text-white transition-colors flex items-center justify-center"
            style={{ color: '#a855f7' }}
          >
            Learn more about how it works <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-gray-300">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-300">Skills Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-gray-300">Sessions Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of learners and teachers sharing knowledge every day.
          </p>
          <Link 
            to="/signup"
            className="px-8 py-4 rounded-lg text-white font-medium text-lg transition-all hover:opacity-90 inline-flex items-center"
            style={{ backgroundColor: '#a855f7' }}
          >
            Join Skillswap <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;