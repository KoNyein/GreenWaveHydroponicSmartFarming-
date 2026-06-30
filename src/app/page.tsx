"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Leaf, ArrowRight, ShieldCheck, Users, BarChart3, ShoppingBag, MessageCircle } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading) {
      if (isAuthenticated) {
        // Redirect based on user role
        if (user?.role === 'admin') {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/user/dashboard");
        }
      }
    }
  }, [isMounted, isLoading, isAuthenticated, user, router]);

  if (isLoading || (isMounted && isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/20 via-green-800/10 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 p-2 rounded-full mb-6">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-accent">GreenWave Hydroponic</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Smart Farming 
              <span className="text-accent">Management System</span>
            </h1>
            
            <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
              Complete hydroponic cannabis farming solution with real-time monitoring, 
              inventory management, POS, and marketplace integration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/auth/login">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted max-w-2xl mx-auto">
              Everything you need to manage your hydroponic farm efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Farm Monitoring</h3>
              <p className="text-muted mb-4">
                Real-time sensor data for temperature, humidity, pH, EC, water level, and more across all your zones.
              </p>
              <Link href="/farm" className="text-accent font-medium hover:underline flex items-center gap-1">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>

            {/* Feature Card 2 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">POS System</h3>
              <p className="text-muted mb-4">
                Complete point-of-sale system with product catalog, cart management, and multiple payment methods.
              </p>
              <Link href="/pos" className="text-accent font-medium hover:underline flex items-center gap-1">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>

            {/* Feature Card 3 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
              <p className="text-muted mb-4">
                Buy and sell hydroponic supplies, equipment, and seeds with our integrated marketplace.
              </p>
              <Link href="/marketplace" className="text-accent font-medium hover:underline flex items-center gap-1">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>

            {/* Feature Card 4 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Management</h3>
              <p className="text-muted mb-4">
                Manage your team members with role-based access control and internal messaging.
              </p>
              <Link href="/members" className="text-accent font-medium hover:underline flex items-center gap-1">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>

            {/* Feature Card 5 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-muted mb-4">
                Full administrative control over users, products, orders, and system settings.
              </p>
              <Link href="/auth/login" className="text-accent font-medium hover:underline flex items-center gap-1">
                Sign in <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>

            {/* Feature Card 6 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Messaging</h3>
              <p className="text-muted mb-4">
                Internal team messaging with channels, direct messages, and file sharing.
              </p>
              <Link href="/messenger" className="text-accent font-medium hover:underline flex items-center gap-1">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent/10 to-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Farm?</h2>
          <p className="text-xl text-muted mb-8">
            Join thousands of growers using GreenWave to optimize their hydroponic operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/auth/login">
                Sign In
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/auth/register">
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">GreenWave Hydroponic</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted">
              <Link href="/" className="hover:text-accent">Home</Link>
              <Link href="#features" className="hover:text-accent">Features</Link>
              <Link href="/auth/login" className="hover:text-accent">Sign In</Link>
              <Link href="/auth/register" className="hover:text-accent">Sign Up</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted">
            <p>© {new Date().getFullYear()} GreenWave Hydroponic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
