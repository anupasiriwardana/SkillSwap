// pages/auth/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#1a1625' }}>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-white mb-8">About SkillSwap</h1>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            At SkillSwap, we believe that everyone has something valuable to teach and something meaningful to learn.
                            Our platform connects curious minds worldwide, creating a vibrant community where knowledge flows freely
                            and personal growth is a shared journey.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">How We're Different</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-xl border border-gray-700">
                                <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Matching</h3>
                                <p className="text-gray-300">
                                    Our intelligent matching system doesn't just look at keywords. It understands your learning style,
                                    availability, and goals to connect you with the perfect learning partner.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl border border-gray-700">
                                <h3 className="text-xl font-semibold text-white mb-3">Flexible Learning Modes</h3>
                                <p className="text-gray-300">
                                    Whether you want to trade skills, focus on learning, or share your expertise for points,
                                    we adapt to your preferences and schedule.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl border border-gray-700">
                                <h3 className="text-xl font-semibold text-white mb-3">Integrated Experience</h3>
                                <p className="text-gray-300">
                                    From discovery to video calls to scheduling, everything happens in one place.
                                    No more juggling multiple apps and platforms.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl border border-gray-700">
                                <h3 className="text-xl font-semibold text-white mb-3">Global Community</h3>
                                <p className="text-gray-300">
                                    Connect with learners and teachers from around the world. Share not just skills,
                                    but cultures, perspectives, and life experiences.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Our Story</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-4">
                            SkillSwap was born from a simple observation: in our connected world, the most valuable resource isn't
                            information—it's the human connection that transforms information into wisdom.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            We've experienced the magic that happens when someone passionate about a skill meets someone eager to learn it.
                            That spark of connection, the joy of teaching, the excitement of mastering something new—that's what SkillSwap
                            is designed to create, at scale.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Join Our Community</h2>
                        <div className="p-8 rounded-xl border border-gray-700 text-center">
                            <p className="text-gray-300 text-lg mb-6">
                                Ready to share your skills and discover new ones? Join thousands of learners and teachers
                                who are already part of the SkillSwap community.
                            </p>
                            <Link
                                to="/signup"
                                className="px-8 py-4 rounded-lg text-white font-medium text-lg transition-all hover:opacity-90 inline-flex items-center"
                                style={{ backgroundColor: '#a855f7' }}
                            >
                                Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;