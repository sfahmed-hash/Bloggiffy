// @ts-nocheck
import GitHubNavbar from "../components/Navbar";
import { useEffect, useState } from 'react';
import { Users, GitFork, Star, Link, ArrowRight, Mail, MapPin, Briefcase } from 'lucide-react';
import { Rss, Link2, CheckCircle2, PlugZap, Code, Copy, Share2 } from 'lucide-react';
import { useParams } from "react-router-dom";
import { CardContainer, CardItem, CardBody } from "../components/ui/3d-card";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_URL } from "../config";
import axios from "axios";
import Modal from 'react-modal';
import UsernotFound from "../components/UserNotfound";

export default function Profile() {
  const [viewMode, setViewMode] = useState<'owner' | 'visitor' | 'loading'>('owner');
  const { username } = useParams();
  const [user, setUser] = useState();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [integrationSource, setintegrationSource] = useState<"medium"|"hashnode"|null>(null);
  const [modalOpen, setModalOpen] = useState(null);
  const [ismedium, setismedium] = useState(false);
  const [ishashnode, setishashnode] = useState(false);
  const [integrationUsername, setIntegrationUsername] = useState<String>("");
  const [integrating, setIntegrating] = useState(false);
  const [medumBlogs,setmediumBlogs] = useState([])
  const [hashnodeBlogs, sethashnodeBlogs] = useState([])

  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [embedType, setEmbedType] = useState<'html' | 'jsx'>('html');
  const [embedOptions, setEmbedOptions] = useState({
    theme: "dark",
    showHeader: true,
    showBio: true,
    showStats: true,
    showBlogs: true,
    showMediumBlogs: true,
    showHashnodeBlogs: true,
    compact: false
  });

  const generateHTMLEmbed = () => {
    const profileData = {
      user,
      blogs,
      medumBlogs,
      hashnodeBlogs,
      options: embedOptions
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${user?.name || user?.login} - Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        gray: {
                            950: '#0a0a0a'
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }
        .animate-fade-in {
            animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="${embedOptions.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${embedOptions.theme === 'dark' ? 'text-white' : 'text-gray-900'}">
    <div class="min-h-screen p-4">
        ${embedOptions.showHeader ? `
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold mb-2">Developer Portfolio</h1>
            <p class="text-gray-500">Powered by Bloggify</p>
        </div>
        ` : ''}
        
        <!-- Profile Section -->
        <div class="${embedOptions.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${embedOptions.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} rounded-xl p-6 animate-fade-in shadow-lg max-w-4xl mx-auto mb-8">
            <div class="flex ${embedOptions.compact ? 'flex-row items-center' : 'flex-col md:flex-row'} gap-6">
                <img src="${user?.avatar_url}" alt="avatar" class="w-24 h-24 ${embedOptions.compact ? 'md:w-16 md:h-16' : 'md:w-32 md:h-32'} rounded-xl ring-2 ${embedOptions.theme === 'dark' ? 'ring-gray-600' : 'ring-gray-300'} object-cover">
                <div class="flex-1">
                    <h1 class="text-2xl font-bold">${user?.name || user?.login}</h1>
                    <p class="${embedOptions.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1">@${user?.login}</p>
                    <a href="https://github.com/${user?.login}" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-400 hover:underline mb-2 inline-block">View GitHub Profile →</a>
                    ${embedOptions.showBio && user?.bio ? `<p class="${embedOptions.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-4">${user.bio}</p>` : ''}
                    
                    ${embedOptions.showStats ? `
                    <div class="flex gap-6 mt-4">
                        <span class="flex items-center gap-2 ${embedOptions.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            ${user?.followers} followers
                        </span>
                        <span class="flex items-center gap-2 ${embedOptions.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            ${user?.following} following
                        </span>
                        <span class="flex items-center gap-2 ${embedOptions.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            ${user?.public_repos} repos
                        </span>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>

        ${embedOptions.showBlogs && blogs.length > 0 ? `
        <!-- Bloggify Blogs -->
        <div class="max-w-4xl mx-auto mb-8">
            <h2 class="text-xl font-bold mb-4">Latest Blogs</h2>
            <div class="grid grid-cols-1 ${embedOptions.compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6">
                ${blogs.slice(0, embedOptions.compact ? 4 : 6).map(blog => `
                <div class="card-hover ${embedOptions.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 border ${embedOptions.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300">
                    <img src="${blog.cover_photo || 'https://picsum.photos/600/300?grayscale'}" alt="Blog Cover" class="w-full h-32 object-cover rounded-lg mb-3">
                    <h3 class="font-semibold mb-2 truncate">${blog.title?.content?.find(i => i.type === 'text')?.text || 'Untitled'}</h3>
                    <p class="${embedOptions.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3 line-clamp-2">${blog.subtitle?.content?.find(i => i.type === 'text')?.text?.slice(0, 100) || 'No description'}...</p>
                    <a href="#" class="text-sm text-blue-400 hover:underline">Read More →</a>
                </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        ${embedOptions.showMediumBlogs && medumBlogs.length > 0 ? `
        <!-- Medium Blogs -->
        <div class="max-w-4xl mx-auto mb-8">
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                <img src="https://cdn.iconscout.com/icon/free/png-256/medium-47-433328.png" alt="medium" class="w-5 h-5 bg-white">
                Medium Blogs
            </h2>
            <div class="grid grid-cols-1 ${embedOptions.compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6">
                ${medumBlogs.slice(0, embedOptions.compact ? 4 : 6).map(blog => `
                <div class="card-hover ${embedOptions.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 border ${embedOptions.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300">
                    <h3 class="font-semibold mb-2 truncate">${blog.title?.slice(0, 50) || 'Untitled'}...</h3>
                    <p class="${embedOptions.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3 line-clamp-2">${blog.description?.slice(0, 100) || 'No description'}...</p>
                    <a href="${blog.link}" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-400 hover:underline">Read on Medium →</a>
                </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        ${embedOptions.showHashnodeBlogs && hashnodeBlogs.length > 0 ? `
        <!-- Hashnode Blogs -->
        <div class="max-w-4xl mx-auto mb-8">
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                <img src="https://cdn.hashnode.com/res/hashnode/image/upload/v1611902473383/CDyAuTy75.png" alt="hashnode" class="w-5 h-5">
                Hashnode Blogs
            </h2>
            <div class="grid grid-cols-1 ${embedOptions.compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6">
                ${hashnodeBlogs.slice(0, embedOptions.compact ? 4 : 6).map(blog => `
                <div class="card-hover ${embedOptions.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 border ${embedOptions.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300">
                    <h3 class="font-semibold mb-2 truncate">${blog.title?.slice(0, 50) || 'Untitled'}...</h3>
                    <p class="${embedOptions.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3 line-clamp-2">${blog.description?.slice(0, 100) || 'No description'}...</p>
                    <a href="${blog.link}" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-400 hover:underline">Read on Hashnode →</a>
                </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div class="text-center mt-12 ${embedOptions.theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} text-sm">
            <p>Portfolio powered by <a href="#" class="text-blue-400 hover:underline">Bloggify</a></p>
        </div>
    </div>
</body>
</html>`;
  };

  const generateJSXEmbed = () => {
    return `import React from 'react';
import { Users, GitFork, Star, ArrowRight } from 'lucide-react';

const Portfolio = () => {
  const user = ${JSON.stringify(user, null, 2)};
  const blogs = ${JSON.stringify(blogs, null, 2)};
  const mediumBlogs = ${JSON.stringify(medumBlogs, null, 2)};
  const hashnodeBlogs = ${JSON.stringify(hashnodeBlogs, null, 2)};

  const getTextContent = (arr) => {
    if (!arr || !Array.isArray(arr)) return "No content";
    return arr.find(i => i.type === "text")?.text || "No content";
  };

  return (
    <div className="${embedOptions.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen p-4">
      ${embedOptions.showHeader ? `
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Developer Portfolio</h1>
        <p className="text-gray-500">Powered by Bloggify</p>
      </div>
      ` : ''}
      
      {/* Profile Section */}
      <div className="${embedOptions.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-lg max-w-4xl mx-auto mb-8">
        <div className="flex ${embedOptions.compact ? 'flex-row items-center' : 'flex-col md:flex-row'} gap-6">
          <img
            src={user?.avatar_url}
            alt="avatar"
            className="w-24 h-24 ${embedOptions.compact ? 'md:w-16 md:h-16' : 'md:w-32 md:h-32'} rounded-xl ring-2 ${embedOptions.theme === 'dark' ? 'ring-gray-600' : 'ring-gray-300'} object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user?.name || user?.login}</h1>
            <p className="${embedOptions.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1">@{user?.login}</p>
            <a
              href={\`https://github/\${user?.login}\`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:underline mb-2 inline-block"
            >
              View GitHub Profile →
            </a>
            ${embedOptions.showBio ? `
            {user?.bio && (
              <p className="${embedOptions.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-4">{user.bio}</p>
            )}
            ` : ''}
            
            ${embedOptions.showStats ? `
            <div className="flex gap-6 mt-4">
              <span className="flex items-center gap-2 ${embedOptions.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm">
                <Users size={16} /> {user?.followers} followers
              </span>
              <span className="flex items-center gap-2 ${embedOptions.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm">
                <GitFork size={16} /> {user?.following} following
              </span>
              <span className="flex items-center gap-2 ${embedOptions.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm">
                <Star size={16} /> {user?.public_repos} repos
              </span>
            </div>
            ` : ''}
          </div>
        </div>
      </div>

      ${embedOptions.showBlogs ? `
      {/* Bloggify Blogs */}
      {blogs.length > 0 && (
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-xl font-bold mb-4">Latest Blogs</h2>
          <div className="grid grid-cols-1 ${embedOptions.compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6">
            {blogs.slice(0, ${embedOptions.compact ? 4 : 6}).map((blog, idx) => (
              <div key={idx} className="hover:transform hover:-translate-y-1 ${embedOptions.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-4 border transition-all duration-300 shadow-lg">
                <img
                  src={blog.cover_photo || 'https://picsum.photos/600/300?grayscale'}
                  alt="Blog Cover"
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold mb-2 truncate">
                  {getTextContent(blog.title?.content)}
                </h3>
                <p className="${embedOptions.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3 line-clamp-2">
                  {getTextContent(blog.subtitle?.content)?.slice(0, 100)}...
                </p>
                <a href="#" className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                  Read More <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      ` : ''}

      ${embedOptions.showMediumBlogs ? `
      {/* Medium Blogs */}
      {mediumBlogs.length > 0 && (
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <img src="https://cdn.iconscout.com/icon/free/png-256/medium-47-433328.png" alt="medium" className="w-5 h-5 bg-white" />
            Medium Blogs
          </h2>
          <div className="grid grid-cols-1 ${embedOptions.compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6">
            {mediumBlogs.slice(0, ${embedOptions.compact ? 4 : 6}).map((blog, idx) => (
              <div key={idx} className="hover:transform hover:-translate-y-1 ${embedOptions.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-4 border transition-all duration-300 shadow-lg">
                <h3 className="font-semibold mb-2 truncate">
                  {blog.title?.slice(0, 50)}...
                </h3>
                <p className="${embedOptions.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3 line-clamp-2">
                  {blog.description?.slice(0, 100)}...
                </p>
                <a
                  href={blog.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                >
                  Read on Medium <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      ` : ''}

      ${embedOptions.showHashnodeBlogs ? `
      {/* Hashnode Blogs */}
      {hashnodeBlogs.length > 0 && (
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <img src="https://cdn.hashnode.com/res/hashnode/image/upload/v1611902473383/CDyAuTy75.png" alt="hashnode" className="w-5 h-5" />
            Hashnode Blogs
          </h2>
          <div className="grid grid-cols-1 ${embedOptions.compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6">
            {hashnodeBlogs.slice(0, ${embedOptions.compact ? 4 : 6}).map((blog, idx) => (
              <div key={idx} className="hover:transform hover:-translate-y-1 ${embedOptions.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-4 border transition-all duration-300 shadow-lg">
                <h3 className="font-semibold mb-2 truncate">
                  {blog.title?.slice(0, 50)}...
                </h3>
                <p className="${embedOptions.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3 line-clamp-2">
                  {blog.description?.slice(0, 100)}...
                </p>
                <a
                  href={blog.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                >
                  Read on Hashnode <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      ` : ''}

      {/* Footer */}
      <div className="text-center mt-12 ${embedOptions.theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} text-sm">
        <p>Portfolio powered by <a href="#" className="text-blue-400 hover:underline">Bloggify</a></p>
      </div>
    </div>
  );
};

export default Portfolio;`;
  };

  const copyEmbedCode = async () => {
    try {
      const code = embedType === 'html' ? generateHTMLEmbed() : generateJSXEmbed();
      await navigator.clipboard.writeText(code);
      setEmbedCopied(true);
      toast.success(`${embedType.toUpperCase()} code copied to clipboard!`);
      setTimeout(() => setEmbedCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy embed code");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) setViewMode('visitor');
    const checkViewer = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/user/distinguish`, { username }, {
          headers: { Authorization: localStorage.getItem("token") }
        });
        setViewMode(response.data.viewer);
      } catch (err) {
        console.error("Error distinguishing viewer:", err);
        setViewMode('visitor');
      }
    };
    checkViewer();
  }, []);

  useEffect(() => {
    const fetchGithubProfile = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/user/profile`, { username });
        if(response.data.status==404){
          setLoading(false)
          window.location.href='/user-not-found'
        }
        setUser(response.data.data);
        console.log("from fetch profile:",user)
        setishashnode(response.data.hashnodeStatus);
        console.log("hey:",ishashnode);
        setismedium(response.data.mediumStatus);
      } catch (err) {
        console.error("GitHub API Error:", err);
      }
    };
    fetchGithubProfile();
  }, []);

  useEffect(() => {
  const fetchBlogs = async () => {
    try {
      setLoading(true);

      // fetch bloggify blogs
      const response = await axios.post(`${BACKEND_URL}/user/blog`, { username });
      if (response.status === 404) toast.error("No user present");
      setBlogs(response.data.blogs || []);

      // fetch medium blogs
      const response2 = await axios.post(`${BACKEND_URL}/user/medium/blogs`, {
        username
      });
      setmediumBlogs(response2.data.mediumBlogs || []);

      // fetch hashnode blogs
      const response3 = await axios.post(`${BACKEND_URL}/user/hashnode/blogs`, {
        username
      });
      sethashnodeBlogs(response3.data.hashnodeBlogs || []); // Added fallback to prevent undefined
      console.log('Hashnode blogs:', response3.data.blogs);

    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      toast.error("Failed to fetch blogs");
      // Ensure all arrays are initialized even on error
      setBlogs([]);
      setmediumBlogs([]);
      sethashnodeBlogs([]);
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };
  
  fetchBlogs();
}, []);

  const getTextContent = (arr) => {
    if (!arr || !Array.isArray(arr)) return "No content";
    return arr.find(i => i.type === "text")?.text || "No content";
  };

  const handleIntegrate = async (source) => {
  try {
    setIntegrating(true);
    const response = await axios.post(`${BACKEND_URL}/user/${source}`, {
      mediumusername: integrationUsername, 
      hashnodeusername: String(integrationUsername),
      githubUsername: username
    });
    
    if (response.data.status == 500) { // Fixed: using 'response' instead of 'res'
      return toast.error("error in integration", {
        position: "top-right"
      });
    }
    
    setModalOpen(false);
    setTimeout(() => {
      toast.success("Integrated successfully!", {
        position: "top-right",
      });
      setIntegrating(false);
      setModalOpen(null);
    }, 1500);
  } catch (error) {
    console.error("Integration error:", error);
    toast.error("Integration failed", {
      position: "top-right"
    });
    setIntegrating(false);
  }
};

  if (loading || !user) {
    return <div className="min-h-screen bg-[#0f0f0f] text-white flex justify-center items-center"><p>Loading...</p><ToastContainer /></div>;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <GitHubNavbar />
      <ToastContainer />

      <div className="bg-[#1b1b1b] border border-gray-700 rounded-xl p-8 animate-fade-in shadow-md max-w-5xl mx-auto mt-6">
       
  <div className="flex flex-col md:flex-row gap-6">
    <img
      src={user.avatar_url}
      alt="avatar"
      className="w-28 h-28 md:w-36 md:h-36 rounded-xl ring-2 ring-gray-700 object-cover"
    />
    <div className="flex-1">
      <h1 className="text-3xl font-bold text-white">{user.name || user.login}</h1>
      <p className="text-gray-400 mb-1">@{user.login}</p>
      <a
        href={`https://github.com/${user.login}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-400 hover:underline mb-2 inline-block"
      >
        View GitHub Profile →
      </a>
      <p className="text-gray-300 mb-4">{user.bio}</p>
      <div className="flex flex-wrap gap-4">
        {user.email && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Mail size={16} /> {user.email}
          </div>
        )}
        {user.location && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin size={16} /> {user.location}
          </div>
        )}
        {user.company && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Briefcase size={16} /> {user.company}
          </div>
        )}
      </div>
      <div className="flex gap-6 mt-4">
        <span className="flex items-center gap-2 text-gray-300 text-sm">
          <Users size={16} /> {user.followers} followers
        </span>
        <span className="flex items-center gap-2 text-gray-300 text-sm">
          <GitFork size={16} /> {user.following} following
        </span>
        <span className="flex items-center gap-2 text-gray-300 text-sm">
          <Star size={16} /> {user.public_repos} repos
        </span>
      </div>
    </div>
  </div>

{viewMode === 'owner' && (
  <div className="flex gap-6 mt-6 justify-center">
    {/* Medium Integration */}
    <button
      onClick={() =>{
        if(!ismedium){
          setModalOpen(true)
          setintegrationSource("medium")
        }
      }}
      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all shadow-sm"
    >
      {ismedium ? (
        <>
          <CheckCircle2 className="text-green-400 w-5 h-5" />
          Medium Integrated
        </>
      ) : (
        <>
          <Rss className="text-yellow-300 w-5 h-5" />
          Integrate Medium
        </>
      )}
    </button>

    {/* Hashnode Integration */}
    <button
      onClick={() => {
        if(!ishashnode){
          setModalOpen(true)
          setintegrationSource("hashnode")
        }
      }}
      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all shadow-sm"
    >
      {ishashnode ? (
        <>
          <CheckCircle2 className="text-green-400 w-5 h-5" />
          Hashnode Integrated
        </>
      ) : (
        <>
          <PlugZap className="text-blue-400 w-5 h-5" />
          Integrate Hashnode
        </>
      )}
    </button>

    {/* Embed Button */}
    <button
      onClick={() => setEmbedModalOpen(true)}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-sm"
    >
      <Share2 className="w-5 h-5" />
      Embed Portfolio
    </button>
  </div>
)}

      </div>

      {/* bloggify blogs sect */}
      <div className="mx-auto px-4 py-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h2 className="text-2xl font-semibold text-gray-400">No blogs found</h2>
                  <p className="text-gray-500 mt-2">Be the first to create a blog!</p>
                </div>
              ) : (
                blogs.map((blog, idx) => (
                  <CardContainer key={blog._id || idx}>
                    <CardBody className="bg-[#1a1a1a] hover:bg-[#262626] transition-all duration-300 shadow-lg rounded-2xl p-5 border border-gray-800">
                      <CardItem
                        translateZ={30}
                        className="text-2xl min-h-[10px] font-semibold text-white mb-2 truncate"
                        style={{ minHeight: "48px", maxHeight: "48px" }}
                      >
                        {
                        getTextContent(blog.title?.content).length > 20
                          ? getTextContent(blog.title?.content).slice(0, 30) + '...'
                          : getTextContent(blog.title?.content)
                        }
                      </CardItem>
                      <CardItem
                        translateZ={20}
                        className="text-sm text-gray-400 mb-3 line-clamp-2"
                        style={{ minHeight: "48px", maxHeight: "48px" }}
                      >
                        {
                        getTextContent(blog.subtitle?.content).length > 100
                          ? getTextContent(blog.subtitle?.content).slice(0, 100) + '...'
                          : getTextContent(blog.subtitle?.content)
                        }
                      </CardItem>
                      <CardItem translateZ={20} className="mb-4 rounded-xl overflow-hidden">
                        <img
                          src={blog.cover_photo || "https://picsum.photos/600/300?grayscale"}
                          alt="Blog Cover"
                          className="w-full h-44 object-cover rounded-lg transform transition-transform duration-300 hover:scale-105"
                        />
                      </CardItem>
                      <CardItem translateZ={15} className="flex items-center w-full justify-between mt-4">
                        
                        <Link
                          to={`/blog/${blog._id}`}
                          className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                        >
                          Read <ArrowRight size={16} />
                        </Link>
                      </CardItem>
                    </CardBody>
                  </CardContainer>
                ))
              )}
            </div>
        {/* Medium Header */}
        {medumBlogs.length === 0 ? (
  <div></div>
) : (
  <div className="px-4 pt-10">
    <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
      <img
        src="https://cdn.iconscout.com/icon/free/png-256/medium-47-433328.png"
        alt="medium"
        className="bg-white w-6 h-6"
      />
      Medium Blogs
    </h2>
  </div>
)}

      {/* medium blogs */}
    <div className="mx-auto px-4 py-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {medumBlogs.length === 0 ? (
    <div></div>
  ) : (
    medumBlogs.map((blog, idx) => (
      <CardContainer key={blog._id || idx}>
        <CardBody className="bg-[#1a1a1a] hover:bg-[#262626] transition-all duration-300 shadow-xl rounded-2xl p-6 border border-gray-800 flex flex-col h-full justify-between">
          <div>
            <CardItem
              translateZ={30}
              className="text-xl font-semibold text-white mb-3 truncate"
              style={{ minHeight: "48px", maxHeight: "48px" }}
            >
              {blog.title?.slice(0, 28) + "..." || "Untitled"}
            </CardItem>

            <CardItem
              translateZ={20}
              className="text-sm text-gray-400 mb-4 line-clamp-3"
              style={{ minHeight: "60px", maxHeight: "60px" }}
            >
              {blog.description?.slice(0, 100) || "No description"}...
            </CardItem>
          </div>

          <CardItem translateZ={15}>
            {/* ❌ Don't use <Link> for external links */}
            <a
              href={blog.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition"
            >
              Read <ArrowRight size={16} className="ml-1" />
            </a>
          </CardItem>
        </CardBody>
      </CardContainer>
    ))
  )}
</div>

      {hashnodeBlogs.length === 0 ? null : (
  <div className="px-4 pt-10">
    <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
      <img
        src="https://cdn.hashnode.com/res/hashnode/image/upload/v1611902473383/CDyAuTy75.png"
        alt="hashnode"
        className="w-6 h-6"
      />
      Hashnode Blogs
    </h2>
    {/* You can render blog items here using map */}
  </div>
)}

      <div className="mx-auto px-4 py-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {hashnodeBlogs.length === 0 ? (
   <div></div>
  ) : (
    hashnodeBlogs.map((blog, idx) => (
      <CardContainer key={blog._id || idx}>
        <CardBody className="bg-[#1a1a1a] hover:bg-[#262626] transition-all duration-300 shadow-xl rounded-2xl p-6 border border-gray-800 flex flex-col h-full justify-between">
          <div>
            <CardItem
              translateZ={30}
              className="text-xl font-semibold text-white mb-3 truncate"
              style={{ minHeight: "48px", maxHeight: "48px" }}
            >
              {blog.title?.slice(0, 28) + "..." || "Untitled"}
            </CardItem>

            <CardItem
              translateZ={20}
              className="text-sm text-gray-400 mb-4 line-clamp-3"
              style={{ minHeight: "60px", maxHeight: "60px" }}
            >
              {blog.description?.slice(0, 100) || "No description"}...
            </CardItem>
          </div>

          <CardItem translateZ={15}>
            {/* ❌ Don't use <Link> for external links */}
            <a
              href={blog.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition"
            >
              Read <ArrowRight size={16} className="ml-1" />
            </a>
          </CardItem>
        </CardBody>
      </CardContainer>
    ))
  )}
</div>


      {modalOpen && (
        <Modal isOpen onRequestClose={() => setModalOpen(null)} className="bg-[#1f1f1f] p-6 rounded-xl max-w-md mx-auto mt-24 shadow-lg text-white" overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <h2 className="text-xl font-semibold mb-4">Integrate with {integrationSource}</h2>
          <input value={integrationUsername} onChange={e => setIntegrationUsername(e.target.value)} placeholder={`Enter ${integrationSource} username`} className="w-full px-4 py-2 rounded-md bg-gray-800 text-white mb-4" />
          <button onClick={()=>{
            handleIntegrate(integrationSource)
          }} disabled={integrating} className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">
            {integrating ? "Integrating..." : "Integrate"}
          </button>
        </Modal>
      )}

      {/* Embed Modal */}
      {embedModalOpen && (
        <Modal
          isOpen
          onRequestClose={() => setEmbedModalOpen(false)}
          className="bg-[#1f1f1f] p-6 rounded-xl max-w-4xl mx-auto mt-8 shadow-lg text-white max-h-[90vh] overflow-y-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Embed Your Portfolio</h2>
            <button
              onClick={() => setEmbedModalOpen(false)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Options Panel */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Customization Options</h3>
              
              {/* Code Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Code Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEmbedType('html')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      embedType === 'html' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Code className="w-4 h-4 inline mr-2" />
                    HTML
                  </button>
                  <button
                    onClick={() => setEmbedType('jsx')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      embedType === 'jsx' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Code className="w-4 h-4 inline mr-2" />
                    React JSX
                  </button>
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select
                  value={embedOptions.theme}
                  onChange={(e) => setEmbedOptions(prev => ({ ...prev, theme: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>

              {/* Layout Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={embedOptions.showHeader}
                    onChange={(e) => setEmbedOptions(prev => ({ ...prev, showHeader: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Show header</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={embedOptions.showBio}
                    onChange={(e) => setEmbedOptions(prev => ({ ...prev, showBio: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Show bio</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={embedOptions.showStats}
                    onChange={(e) => setEmbedOptions(prev => ({ ...prev, showStats: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Show GitHub stats</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={embedOptions.showBlogs}
                    onChange={(e) => setEmbedOptions(prev => ({ ...prev, showBlogs: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Show Bloggify blogs</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={embedOptions.showMediumBlogs}
                    onChange={(e) => setEmbedOptions(prev => ({ ...prev, showMediumBlogs: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Show Medium blogs</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={embedOptions.showHashnodeBlogs}
                    onChange={(e) => setEmbedOptions(prev => ({ ...prev, showHashnodeBlogs: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Show Hashnode blogs</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={embedOptions.compact}
                    onChange={(e) => setEmbedOptions(prev => ({ ...prev, compact: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Compact layout</span>
                </label>
              </div>
            </div>

            {/* Code Preview */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {embedType === 'html' ? 'HTML' : 'React JSX'} Code
                </h3>
                <button
                  onClick={copyEmbedCode}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    embedCopied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 hover:bg-gray-500 text-white'
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  {embedCopied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap break-words">
                  <code>
                    {embedType === 'html' ? generateHTMLEmbed() : generateJSXEmbed()}
                  </code>
                </pre>
              </div>

              {/* Usage Instructions */}
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold mb-2">Usage Instructions:</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  {embedType === 'html' ? (
                    <>
                      <p>• Save the code as an HTML file (e.g., portfolio.html)</p>
                      <p>• Open it in any web browser</p>
                      <p>• Or embed it directly in your website</p>
                    </>
                  ) : (
                    <>
                      <p>• Copy the component into your React project</p>
                      <p>• Make sure you have Tailwind CSS installed</p>
                      <p>• Import and use the Portfolio component</p>
                      <p>• Install lucide-react for icons: npm install lucide-react</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
}