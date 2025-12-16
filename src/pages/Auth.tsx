import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pen, Zap, Clock, Sparkles, Users, TrendingUp, CheckCircle } from 'lucide-react';

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Generate content in seconds, not hours' },
    { icon: Sparkles, title: 'AI-Powered', description: 'Harness advanced AI for high-quality output' },
    { icon: Clock, title: 'Save Hours', description: 'Reduce content creation time by up to 80%' },
  ];

  const benefits = [
    'Create multiple content variations instantly',
    'Maintain consistent brand voice across channels',
    'Collaborate seamlessly with your team',
    'Scale your content production effortlessly',
    'Get real-time performance analytics',
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-screen">
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 p-12 text-white">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Pen className="w-8 h-8" />
              </div>
              <span className="text-2xl font-bold">ContentHub</span>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-5xl font-bold leading-tight mb-4">
                  Create Content 10x Faster
                </h1>
                <p className="text-xl text-blue-100">
                  Harness the power of AI to create compelling content that engages your audience and drives results.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Icon className="w-6 h-6 text-blue-200" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                        <p className="text-blue-100 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-8 border-t border-blue-400">
                <p className="text-sm text-blue-100 mb-4 font-semibold uppercase tracking-wide">What you'll get</p>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-blue-50">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="text-blue-100 text-sm">
            Trusted by creators and marketers worldwide. Join thousands of professionals accelerating their content strategy.
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="w-full max-w-md mx-auto">
            <div className="lg:hidden mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Pen className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">ContentHub</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Content 10x Faster</h1>
              <p className="text-gray-600">Harness the power of AI to create compelling content that engages your audience.</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Start Creating Today' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600">
                {isSignUp
                  ? 'Join thousands of creators using ContentHub'
                  : 'Sign in to your creative workspace'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
                <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold ml-1"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-center text-xs text-gray-500">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
