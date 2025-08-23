import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Users, MessageCircle, Video, CheckCircle, Star, Zap, ArrowRight, Play } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Sign up with Google or email and build your profile. Tell us about the skills you want to teach and learn. Our AI will understand your preferences, goals, and availability to find the perfect matches.",
      icon: <UserPlus className="w-8 h-8" />,
      features: ["Quick Google OAuth signup", "Add unlimited skills", "Set availability preferences", "AI analyzes your profile"]
    },
    {
      number: "02", 
      title: "Get Matched with Perfect Partners",
      description: "Our intelligent matching algorithm goes beyond keywords. It considers your location, skill levels, teaching style, availability, and even personality compatibility to connect you with ideal learning partners.",
      icon: <Users className="w-8 h-8" />,
      features: ["AI-powered matching", "Location-based suggestions", "Skill level compatibility", "Personality matching"]
    },
    {
      number: "03",
      title: "Connect & Plan Together",
      description: "Message your matches through our real-time chat system. Discuss what you'll learn, set expectations, and schedule your first session using our integrated Google Calendar system.",
      icon: <MessageCircle className="w-8 h-8" />,
      features: ["Real-time messaging", "Session planning tools", "Google Calendar sync", "Goal setting together"]
    },
    {
      number: "04",
      title: "Learn Through Video Sessions",
      description: "Join HD video calls with built-in screen sharing, whiteboards, and recording capabilities. Learn at your own pace while building meaningful connections through shared knowledge.",
      icon: <Video className="w-8 h-8" />,
      features: ["HD video calls", "Screen sharing", "Session recording", "Interactive whiteboards"]
    }
  ];

  const learningModes = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Teach & Learn",
      subtitle: "Mutual Exchange",
      description: "The heart of SkillSwap. Exchange skills directly with other users. Teach guitar and learn Spanish, share coding knowledge for cooking tips. No points required—just mutual learning and growth.",
      benefits: ["100% free skill exchange", "Build lasting connections", "Learn diverse skills", "Earn bonus rewards"],
      color: "#a855f7"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Learn Only",
      subtitle: "Premium Learning",
      description: "Want to focus purely on learning? Use points to access expert teachers and dive deep into new skills. Perfect for intensive learning or when you need structured guidance.",
      benefits: ["Access to expert teachers", "Structured learning paths", "Personalized attention", "Flexible scheduling"],
      color: "#06b6d4"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Teach Only", 
      subtitle: "Share & Earn",
      description: "Share your expertise and earn points while helping others grow. Great for experts who want to monetize their knowledge and build a teaching reputation on the platform.",
      benefits: ["Earn points for teaching", "Build your reputation", "Help others succeed", "Flexible teaching schedule"],
      color: "#10b981"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1625' }}>
      {/* Header */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How SkillSwap Works
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            From signing up to mastering new skills, here's your complete journey on SkillSwap. 
            It's designed to be simple, effective, and enjoyable.
          </p>
          <div className="flex justify-center">
            <button className="px-6 py-3 rounded-lg border border-gray-600 text-white font-medium hover:border-gray-500 transition-colors flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Watch Demo Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto space-y-20">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col lg:flex-row items-center gap-12">
              <div className={`flex-1 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="flex items-center mb-6">
                  <span 
                    className="text-6xl font-bold mr-6"
                    style={{ color: '#a855f7' }}
                  >
                    {step.number}
                  </span>
                  <div 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: '#a855f7' }}
                  >
                    {React.cloneElement(step.icon, { className: "w-8 h-8 text-white" })}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">{step.description}</p>
                
                <div className="space-y-3">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#a855f7' }} />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`flex-1 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="w-full h-80 rounded-xl border border-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#a855f7' }}>
                      {React.cloneElement(step.icon, { className: "w-8 h-8 text-white" })}
                    </div>
                    <div className="text-gray-400 text-lg">Step {step.number} Illustration</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Modes */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Three Ways to Learn
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the learning mode that fits your goals, schedule, and preferences. 
              You can switch between modes anytime.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {learningModes.map((mode, index) => (
              <div key={index} className="p-8 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="text-center mb-6">
                  <div 
                    className="w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: mode.color }}
                  >
                    {React.cloneElement(mode.icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{mode.title}</h3>
                  <p className="text-sm font-medium" style={{ color: mode.color }}>{mode.subtitle}</p>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">{mode.description}</p>
                
                <div className="space-y-3">
                  {mode.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: mode.color }} />
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Preview */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Common Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">How does the matching work?</h3>
              <p className="text-gray-300">Our AI analyzes your skills, preferences, location, and availability to find compatible learning partners who complement your goals.</p>
            </div>
            
            <div className="p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">Is it really free?</h3>
              <p className="text-gray-300">Yes! Teach & Learn mode is completely free. You only use points for Learn Only sessions, and you can earn points by teaching.</p>
            </div>
            
            <div className="p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">What if I'm not satisfied with a session?</h3>
              <p className="text-gray-300">We have a review system and money-back guarantee. If you're not satisfied, we'll refund your points or help you find a better match.</p>
            </div>
            
            <div className="p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">Can I teach multiple skills?</h3>
              <p className="text-gray-300">Absolutely! Add as many skills as you want to your profile. The more skills you offer, the more matching opportunities you'll have.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of learners and teachers sharing knowledge every day. 
            Your learning journey starts with a single click.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup"
              className="px-8 py-4 rounded-lg text-white font-medium text-lg transition-all hover:opacity-90 inline-flex items-center justify-center"
              style={{ backgroundColor: '#a855f7' }}
            >
              Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/about"
              className="px-8 py-4 rounded-lg border border-gray-600 text-white font-medium text-lg hover:border-gray-500 transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;