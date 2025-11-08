import React, { useEffect, useState } from "react";
import { WorldMap } from "../components/ui/world-map";
import {  Github } from 'lucide-react'
import bloggify from "../assets/bloggify.png"
import { BACKEND_URL } from "../config";

const LandingPage: React.FC = () => {
  const [isToken,setisToken] = useState(false)
  const handleGithubLogin  = ()=>{
    window.location.href = `${BACKEND_URL}/auth/github`
  }
  const GotoDashboard = ()=>{
    window.location.href = "/blogs"
  }
  //property of the window.location object in JavaScript that represents the current URL of the page.
  useEffect(()=>{
    const githubToken = localStorage.getItem("token");
    if(githubToken){
      setisToken(true)
    }
  },[])
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-4 py-4 max-w-7xl  w-full">
        <div className="flex items-center space-x-3">
            <img src={bloggify} alt="Bloggify Logo" className="h-10 w-auto" />  
        </div>
        {/* <div className="hidden md:flex space-x-8 text-gray-300">
          <a href="#features" className="hover:text-white transition-colors cursor-pointer">Features</a>
          <a href="#about" className="hover:text-white transition-colors cursor-pointer">About</a>
          <a href="#pricing" className="hover:text-white transition-colors cursor-pointer">Pricing</a>
        </div> */}
      </nav>
      {/* Hero Section */}
      <header className="py-16 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Bloggify</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Your personalized blogging platform powered by GitHub. Write, publish, and share your thoughts with the world.
        </p>
        <button
          onClick={()=>{
            isToken?GotoDashboard():handleGithubLogin()
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
        >
          <div className="flex items-center justify-center space-x-2">
            {isToken ? (
              <span>View All Blogs</span>
            ) : (
              <>
                <span>Sign in with GitHub</span>
                <Github className="w-5 h-5" />
              </>
            )}
          </div>
        </button>
      </header>

      {/* World Map Animation */}
<div className="flex justify-center items-center py-12 px-4">
  <WorldMap
    dots={[
      // Existing routes
      {
        start: { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
        end: { lat: 51.5074, lng: -0.1278, label: "London" },
      },
      {
        start: { lat: 28.6139, lng: 77.209, label: "Delhi" },
        end: { lat: 35.6895, lng: 139.6917, label: "Tokyo" },
      },

      // New routes
      {
        start: { lat: 40.7128, lng: -74.006, label: "New York" },
        end: { lat: 48.8566, lng: 2.3522, label: "Paris" },
      },
      {
        start: { lat: -33.8688, lng: 151.2093, label: "Sydney" },
        end: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
      },
      {
        start: { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
        end: { lat: 19.4326, lng: -99.1332, label: "Mexico City" },
      },
      {
        start: { lat: 52.52, lng: 13.405, label: "Berlin" },
        end: { lat: 55.7558, lng: 37.6173, label: "Moscow" },
      },
      {
        start: { lat: 31.2304, lng: 121.4737, label: "Shanghai" },
        end: { lat: 39.9042, lng: 116.4074, label: "Beijing" },
      },
      {
        start: { lat: 30.0444, lng: 31.2357, label: "Cairo" },
        end: { lat: 6.5244, lng: 3.3792, label: "Lagos" },
      },
    ]}
  />
</div>


      {/* Features Section */}
      <section className="py-16 px-6 bg-zinc-900 text-center">
        <h2 className="text-3xl font-bold mb-8">Why Bloggify?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-orange-400">GitHub-Powered Auth</h3>
            <p className="text-gray-300">Easily sign in with your GitHub account. No passwords, just productivity.</p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-orange-400">Custom Pages</h3>
            <p className="text-gray-300">Your blog lives at <code>bloggify.dev/username</code>. Professional and shareable.</p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-orange-400">Minimal & Elegant</h3>
            <p className="text-gray-300">A sleek editor and fast-loading UI for the best writing experience.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} Bloggify.dev — Built with 💻 and ☕
      </footer>
    </div>
  );
};

export default LandingPage;
