// app/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import {
  Trophy,
  Users,
  Calendar,
  Award,
  ArrowRight,
  Star,
  Shield,
  Clock,
  MapPin,
  ChevronRight,
  Play,
  BarChart3,
  Briefcase,
  Target,
  Sparkles,
  CheckCircle,
  UserPlus,
  MessageCircle,
  TrendingUp,
  Zap,
  Crown,
  Medal,
  Globe,
  Heart,
  Phone,
  Mail,
  MapPin as MapPinIcon,

} from "lucide-react";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FcSportsMode } from "react-icons/fc";

export default function HomePage() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Trophy,
      title: "Track Performance",
      description: "Monitor your stats, analyze progress, and achieve new personal bests with detailed analytics.",
      color: "from-[#d4af64] to-[#c49a40]"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Manage training sessions, matches, and events with an intelligent calendar system.",
      color: "from-[#d4af64] to-[#c49a40]"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Connect with teammates, share strategies, and build a winning culture together.",
      color: "from-[#d4af64] to-[#c49a40]"
    },
    {
      icon: Award,
      title: "Achievement Hub",
      description: "Earn badges, track milestones, and celebrate your journey to excellence.",
      color: "from-[#d4af64] to-[#c49a40]"
    }
  ];

  const stats = [
    { value: "500+", label: "Active Athletes", icon: Users },
    { value: "50+", label: "Professional Coaches", icon: Briefcase },
    { value: "1000+", label: "Training Sessions", icon: Calendar },
    { value: "95%", label: "Success Rate", icon: TrendingUp }
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Cricket Athlete",
      content: "Veritas transformed my training experience. The analytics and scheduling features helped me improve my game significantly.",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Football Coach",
      content: "The platform is incredible for managing my team. Easy to use, great features, and amazing support.",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      rating: 5
    },
    {
      name: "Vikram Singh",
      role: "Athlete",
      content: "Best sports management platform I've used. The performance tracking is top-notch and very intuitive.",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      rating: 5
    }
  ];

  const upcomingEvents = [
    {
      title: "National Cricket Championship",
      sport: "Cricket",
      date: "June 15, 2026",
      location: "Mumbai Cricket Stadium",
      participants: 120,
      type: "Tournament"
    },
    {
      title: "Football Training Camp",
      sport: "Football",
      date: "June 20, 2026",
      location: "Sports Complex, Delhi",
      participants: 45,
      type: "Training"
    },
    {
      title: "Athletics Meet 2026",
      sport: "Athletics",
      date: "June 25, 2026",
      location: "Jawaharlal Nehru Stadium",
      participants: 200,
      type: "Competition"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0e] font-['DM_Sans',sans-serif]">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0f0f12]/95 backdrop-blur-md border-b border-[rgba(212,175,100,0.1)]" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
             <div className="relative z-10 flex items-center gap-2.5">
                       <div className="w-9 h-9 bg-gradient-to-br from-[#504a3d] to-[#6e5f40] rounded-lg flex items-center justify-center">
                         <FcSportsMode className="w-5 h-5" />
                       </div>
                       <span className="font-['Cormorant_Garamond',serif] text-xl font-semibold text-[#f0e6c8] tracking-wide">Sportz</span>
                     </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-[rgba(240,230,200,0.6)] hover:text-[#d4af64] transition-colors text-sm font-body">
                Features
              </Link>
              <Link href="#about" className="text-[rgba(240,230,200,0.6)] hover:text-[#d4af64] transition-colors text-sm font-body">
                About
              </Link>
              <Link href="#testimonials" className="text-[rgba(240,230,200,0.6)] hover:text-[#d4af64] transition-colors text-sm font-body">
                Testimonials
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <Link
                  href={user.role === "ADMIN" ? "/admin/dashboard" : `/${user.role?.toLowerCase()}/dashboard`}
                  className="px-5 py-2 text-sm font-body bg-gradient-to-r from-[#d4af64] to-[#c49a40] text-[#0c0c0e] rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-body text-[rgba(240,230,200,0.7)] border border-[rgba(212,175,100,0.2)] rounded-lg hover:border-[rgba(212,175,100,0.4)] hover:text-[#d4af64] transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 text-sm font-body bg-gradient-to-r from-[#d4af64] to-[#c49a40] text-[#0c0c0e] rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute w-[800px] h-[800px] rounded-full blur-[150px] bg-radial-gradient from-[rgba(212,175,100,0.08)] to-transparent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] bg-radial-gradient from-[rgba(150,120,200,0.05)] to-transparent top-0 right-0" />
          <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] bg-radial-gradient from-[rgba(212,175,100,0.05)] to-transparent bottom-0 left-0" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(212,175,100,0.1)] border border-[rgba(212,175,100,0.2)] mb-6 animate-fade-up">
            <Sparkles className="w-4 h-4 text-[#d4af64]" />
            <span className="text-xs font-body text-[#d4af64] tracking-wide">The Future of Sports Management</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-light text-[#f0e6c8] mb-6 leading-tight animate-fade-up">
            Elevate Your 
            <span className="text-[#d4af64] font-semibold block md:inline md:ml-3">Sports Journey</span>
          </h1>
          
          <p className="text-lg text-[rgba(240,230,200,0.5)] font-body max-w-2xl mx-auto mb-10 animate-fade-up">
            The ultimate platform for athletes and coaches to connect, train, and achieve greatness together.
            Track performance, manage schedules, and unlock your full potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
            <Link
              href="/register"
              className="px-8 py-3 bg-gradient-to-r from-[#d4af64] to-[#c49a40] text-[#0c0c0e] rounded-lg font-body font-medium hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 border border-[rgba(212,175,100,0.3)] text-[rgba(240,230,200,0.7)] rounded-lg font-body hover:border-[rgba(212,175,100,0.6)] hover:text-[#d4af64] transition-all duration-200 flex items-center justify-center gap-2"
            >
              Explore Features
              <Play className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-12 h-12 rounded-full bg-[rgba(212,175,100,0.1)] flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-[#d4af64]" />
                </div>
                <p className="font-display text-3xl font-semibold text-[#f0e6c8]">{stat.value}</p>
                <p className="text-sm text-[rgba(240,230,200,0.4)] font-body">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-light text-[#f0e6c8] mb-4">
              Powerful Features for <span className="text-[#d4af64]">Elite Performance</span>
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-[#d4af64] to-transparent mx-auto mb-4" />
            <p className="text-[rgba(240,230,200,0.5)] font-body max-w-2xl mx-auto">
              Everything you need to manage your sports career in one powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-[#0f0f12] rounded-2xl p-6 border border-[rgba(212,175,100,0.1)] hover:border-[rgba(212,175,100,0.3)] hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-[#0c0c0e]" />
                </div>
                <h3 className="font-display text-xl font-medium text-[#f0e6c8] mb-2">{feature.title}</h3>
                <p className="text-[rgba(240,230,200,0.5)] font-body text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-[#0f0f12] border-y border-[rgba(212,175,100,0.08)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(212,175,100,0.1)] border border-[rgba(212,175,100,0.2)] mb-6">
                <Crown className="w-4 h-4 text-[#d4af64]" />
                <span className="text-xs font-body text-[#d4af64] tracking-wide">Why Choose Us</span>
              </div>
              <h2 className="font-display text-4xl font-light text-[#f0e6c8] mb-4">
                Where Excellence <br />
                <span className="text-[#d4af64]">Meets Innovation</span>
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-[#d4af64] to-transparent mb-6" />
              <p className="text-[rgba(240,230,200,0.6)] font-body leading-relaxed mb-6">
                Veritas Sports is revolutionizing how athletes and coaches collaborate. Our platform combines 
                cutting-edge technology with deep sports expertise to deliver an unparalleled experience.
              </p>
              <div className="space-y-3">
                {[
                  "Real-time performance analytics",
                  "AI-powered training recommendations",
                  "Seamless team communication",
                  "Comprehensive schedule management"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#d4af64]" />
                    <span className="text-[rgba(240,230,200,0.7)] font-body text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af64] to-transparent rounded-2xl blur-3xl opacity-10" />
              <div className="relative bg-[rgba(255,255,255,0.02)] rounded-2xl p-8 border border-[rgba(212,175,100,0.1)]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-[rgba(212,175,100,0.05)] rounded-xl border border-[rgba(212,175,100,0.1)]">
                      <Target className="w-8 h-8 text-[#d4af64] mb-2" />
                      <p className="text-sm font-body text-[#f0e6c8]">Goal Setting</p>
                    </div>
                    <div className="p-4 bg-[rgba(212,175,100,0.05)] rounded-xl border border-[rgba(212,175,100,0.1)]">
                      <BarChart3 className="w-8 h-8 text-[#d4af64] mb-2" />
                      <p className="text-sm font-body text-[#f0e6c8]">Performance Tracking</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="p-4 bg-[rgba(212,175,100,0.05)] rounded-xl border border-[rgba(212,175,100,0.1)]">
                      <Medal className="w-8 h-8 text-[#d4af64] mb-2" />
                      <p className="text-sm font-body text-[#f0e6c8]">Achievements</p>
                    </div>
                    <div className="p-4 bg-[rgba(212,175,100,0.05)] rounded-xl border border-[rgba(212,175,100,0.1)]">
                      <Globe className="w-8 h-8 text-[#d4af64] mb-2" />
                      <p className="text-sm font-body text-[#f0e6c8]">Global Community</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-light text-[#f0e6c8] mb-4">
              Upcoming <span className="text-[#d4af64]">Events</span>
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-[#d4af64] to-transparent mx-auto mb-4" />
            <p className="text-[rgba(240,230,200,0.5)] font-body">
              Join exciting tournaments and training camps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index}
                className="bg-[#0f0f12] rounded-2xl p-6 border border-[rgba(212,175,100,0.1)] hover:border-[rgba(212,175,100,0.3)] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-[rgba(212,175,100,0.1)] text-[#d4af64] font-body">
                    {event.type}
                  </span>
                  <Trophy className="w-5 h-5 text-[rgba(212,175,100,0.4)]" />
                </div>
                <h3 className="font-display text-xl font-medium text-[#f0e6c8] mb-2">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-[rgba(212,175,100,0.4)]" />
                    <span className="text-[rgba(240,230,200,0.6)] font-body">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-[rgba(212,175,100,0.4)]" />
                    <span className="text-[rgba(240,230,200,0.6)] font-body">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-[rgba(212,175,100,0.4)]" />
                    <span className="text-[rgba(240,230,200,0.6)] font-body">{event.participants} Participants</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 text-sm font-body text-[#d4af64] border border-[rgba(212,175,100,0.2)] rounded-lg hover:bg-[rgba(212,175,100,0.05)] transition-all duration-200">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 bg-[#0f0f12] border-y border-[rgba(212,175,100,0.08)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-light text-[#f0e6c8] mb-4">
              What Our <span className="text-[#d4af64]">Community Says</span>
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-[#d4af64] to-transparent mx-auto mb-4" />
            <p className="text-[rgba(240,230,200,0.5)] font-body">
              Trusted by athletes and coaches worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-[#0c0c0e] rounded-2xl p-6 border border-[rgba(212,175,100,0.1)] hover:border-[rgba(212,175,100,0.2)] transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[rgba(212,175,100,0.3)]"
                  />
                  <div>
                    <h4 className="font-body font-semibold text-[#f0e6c8]">{testimonial.name}</h4>
                    <p className="text-xs text-[rgba(212,175,100,0.7)]">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#d4af64] text-[#d4af64]" />
                  ))}
                </div>
                <p className="text-[rgba(240,230,200,0.6)] font-body text-sm leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[rgba(212,175,100,0.05)] to-[rgba(212,175,100,0.02)] rounded-3xl p-12 border border-[rgba(212,175,100,0.15)]">
            <Zap className="w-12 h-12 text-[#d4af64] mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-light text-[#f0e6c8] mb-4">
              Ready to Elevate Your Game?
            </h2>
            <p className="text-[rgba(240,230,200,0.5)] font-body mb-8 max-w-md mx-auto">
              Join thousands of athletes and coaches who are already using Veritas to achieve their goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-gradient-to-r from-[#d4af64] to-[#c49a40] text-[#0c0c0e] rounded-lg font-body font-medium hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <UserPlus className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-3 border border-[rgba(212,175,100,0.3)] text-[rgba(240,230,200,0.7)] rounded-lg font-body hover:border-[rgba(212,175,100,0.6)] transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f12] border-t border-[rgba(212,175,100,0.08)] pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#d4af64] to-[#c49a40] rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-[#0c0c0e]" />
                </div>
                <span className="font-display text-xl font-semibold text-[#f0e6c8] tracking-wide">
                  Veritas Sports
                </span>
              </div>
              <p className="text-[rgba(240,230,200,0.4)] font-body text-sm mb-4">
                Empowering athletes and coaches to achieve excellence through innovative sports management solutions.
              </p>
              <div className="flex gap-3">
                <a href="#" className="p-2 rounded-lg bg-[rgba(212,175,100,0.1)] text-[rgba(212,175,100,0.6)] hover:text-[#d4af64] transition-colors">
                  <FaFacebookSquare className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-[rgba(212,175,100,0.1)] text-[rgba(212,175,100,0.6)] hover:text-[#d4af64] transition-colors">
                  <FaSquareXTwitter  className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-[rgba(212,175,100,0.1)] text-[rgba(212,175,100,0.6)] hover:text-[#d4af64] transition-colors">
                  <FaInstagramSquare  className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-[rgba(212,175,100,0.1)] text-[rgba(212,175,100,0.6)] hover:text-[#d4af64] transition-colors">
                  <FaLinkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-body font-semibold text-[#f0e6c8] mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-[rgba(240,230,200,0.4)] hover:text-[#d4af64] text-sm transition-colors">Features</Link></li>
                <li><Link href="#about" className="text-[rgba(240,230,200,0.4)] hover:text-[#d4af64] text-sm transition-colors">About Us</Link></li>
                <li><Link href="#testimonials" className="text-[rgba(240,230,200,0.4)] hover:text-[#d4af64] text-sm transition-colors">Testimonials</Link></li>
                <li><Link href="/register" className="text-[rgba(240,230,200,0.4)] hover:text-[#d4af64] text-sm transition-colors">Get Started</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-body font-semibold text-[#f0e6c8] mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[rgba(240,230,200,0.4)] hover:text-[#d4af64] text-sm transition-colors">Help Center</a></li>
                <li><a href="#" className="text-[rgba(240,230,200,0.4)] hover:text-[#d4af64] text-sm transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-[rgba(240,230,200,0.4)] hover:text-[#d4af64] text-sm transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-[rgba(240,230,200,0.4)] hover:text-[#d4af64] text-sm transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-body font-semibold text-[#f0e6c8] mb-4">Contact Info</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-[rgba(240,230,200,0.4)] text-sm">
                  <Mail className="w-4 h-4" />
                  support@veritassports.com
                </li>
                <li className="flex items-center gap-2 text-[rgba(240,230,200,0.4)] text-sm">
                  <Phone className="w-4 h-4" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-2 text-[rgba(240,230,200,0.4)] text-sm">
                  <MapPinIcon className="w-4 h-4" />
                  Mumbai, India
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[rgba(212,175,100,0.08)] pt-8 text-center">
            <p className="text-[rgba(240,230,200,0.3)] text-sm">
              © 2026 Veritas Sports. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-up {
          animation: fade-up 0.6s ease both;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}