import React, { useState } from "react";
import { 
  Pin, 
  MessageSquare, 
  ThumbsUp, 
  Clock, 
  User, 
  Plus,
  ArrowRight
} from "lucide-react";

const Forum = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", count: 156 },
    { id: "general", name: "General Discussion", count: 45 },
    { id: "rides", name: "Ride Planning", count: 32 },
    { id: "maintenance", name: "Bike Maintenance", count: 28 },
    { id: "gear", name: "Gear Reviews", count: 21 },
    { id: "events", name: "Events", count: 18 },
    { id: "newbie", name: "New Rider Help", count: 12 },
  ];

  const forumPosts = [
    {
      id: 1,
      title: "Planning a Cross-Country Adventure - Route Suggestions?",
      author: "Rajesh Kumar",
      category: "rides",
      replies: 23,
      likes: 15,
      lastActivity: "2 hours ago",
      isPinned: true,
      preview:
        "Hey everyone! Planning a 3-week cross-country ride from Delhi to Mumbai. Looking for must-see stops and rider-friendly routes...",
    },
    {
      id: 2,
      title: "Best Winter Riding Gear - What Do You Recommend?",
      author: "Pradeep",
      category: "gear",
      replies: 18,
      likes: 12,
      lastActivity: "4 hours ago",
      preview:
        "Winter is coming and I need to upgrade my cold weather gear. What are your go-to brands for heated gloves and jackets?",
    },
  ];

  const filteredPosts =
    activeCategory === "all"
      ? forumPosts
      : forumPosts.filter((post) => post.category === activeCategory);

  const stats = [
    { label: "Total Topics", value: "247" },
    { label: "Total Posts", value: "280" },
    { label: "Active Members", value: "10" },
    { label: "Community Support", value: "24/7" },
  ];

  return (
    <section id="forum" className="section-container py-24 bg-carbon text-white">
       <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div>
            <span className="text-copper font-body tracking-ultra text-xs md:text-sm uppercase mb-2 block font-bold">The Discussion</span>
            <h2 className="font-heading text-6xl md:text-8xl uppercase leading-none">The <span className="text-transparent outline-title">Forum</span></h2>
          </div>
          
          <button className="flex items-center gap-4 bg-copper text-carbon px-8 py-4 font-heading text-lg uppercase hover:bg-white transition-all duration-500">
            <Plus size={20} />
            New Topic
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Categories Sidebar */}
           <div className="lg:col-span-3">
              <div className="space-y-2 sticky top-32">
                 <h3 className="font-body text-[10px] uppercase tracking-[0.3em] text-steel-dim mb-6">Categories</h3>
                 {categories.map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-4 border transition-all duration-500 ${
                        activeCategory === cat.id 
                        ? "bg-copper/10 border-copper/30 text-copper" 
                        : "bg-carbon-light border-white/5 text-steel-dim hover:border-white/20 hover:text-white"
                      }`}
                    >
                       <span className="font-body text-xs uppercase tracking-widest">{cat.name}</span>
                       <span className="font-heading text-sm opacity-50">{cat.count}</span>
                    </button>
                 ))}
              </div>
           </div>

           {/* Posts Area */}
           <div className="lg:col-span-9">
              <div className="space-y-6">
                 {filteredPosts.map((post) => (
                    <div key={post.id} className="group bg-carbon-light border border-white/5 p-8 hover:border-copper/30 transition-all duration-500 cursor-pointer">
                       <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                             {post.isPinned && <Pin size={16} className="text-copper rotate-45" />}
                             <h3 className="font-heading text-2xl uppercase group-hover:text-copper transition-colors">{post.title}</h3>
                          </div>
                          <span className="bg-white/5 px-3 py-1 font-body text-[10px] uppercase tracking-widest text-steel-dim group-hover:bg-copper group-hover:text-carbon transition-colors">
                            {post.category}
                          </span>
                       </div>

                       <p className="font-text text-steel-dim text-sm mb-8 line-clamp-2 max-w-3xl">{post.preview}</p>

                       <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/5 pt-6">
                          <div className="flex items-center gap-8">
                             <div className="flex items-center gap-2">
                                <User size={14} className="text-copper" />
                                <span className="font-body text-[10px] uppercase tracking-widest text-steel-dim">BY {post.author}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <Clock size={14} className="text-copper" />
                                <span className="font-body text-[10px] uppercase tracking-widest text-steel-dim">{post.lastActivity}</span>
                             </div>
                          </div>

                          <div className="flex items-center gap-8">
                             <div className="flex items-center gap-2">
                                <MessageSquare size={14} className="text-steel-dim" />
                                <span className="font-heading text-sm text-white">{post.replies}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <ThumbsUp size={14} className="text-steel-dim" />
                                <span className="font-heading text-sm text-white">{post.likes}</span>
                             </div>
                             <button className="text-copper hover:translate-x-2 transition-transform">
                                <ArrowRight size={20} />
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              {/* Forum Stats Strip */}
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/5">
                 {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                       <span className="font-heading text-5xl block mb-2">{stat.value}</span>
                       <span className="font-body text-[10px] text-steel-dim tracking-[0.3em] uppercase">{stat.label}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
       </div>
    </section>
  );
};

export default Forum;
