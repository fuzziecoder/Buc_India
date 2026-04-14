import React, { useEffect, useMemo, useState, useRef } from "react";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring,
  useMotionValue 
} from "framer-motion";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Play, 
  Pause, 
  X, 
  ChevronRight,
  Maximize2
} from "lucide-react";
import { galleryService } from "../services/api";

const GalleryCard = ({ item, index, onClick }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 15 });
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // No offsets for symmetrical grid
  const xOffset = "0%";
  const yOffset = "0px";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1 }}
      style={{ x: xOffset, y: yOffset }}
      className="relative mb-12"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClick(item)}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative aspect-[4/5] bg-carbon border border-white/5 overflow-hidden cursor-none"
      >
        {/* Hover Aura */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(184,115,51,0.15)_0%,transparent_70%)] pointer-events-none" 
             style={{ "--x": "50%", "--y": "50%" }}></div>

        {item.type === "video" ? (
          <video
            src={item.src}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
            muted
            loop
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
        ) : (
          <img
            src={item.src}
            alt={item.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
          />
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 translate-z-[40px] opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-copper uppercase tracking-[0.2em]">{item.category}</span>
          </div>
          <h3 className="font-heading text-2xl text-white uppercase leading-none mb-4">{item.title}</h3>
          
          <div className="flex items-center gap-6 text-white/60">
            <div className="flex items-center gap-1.5"><Heart size={14} /> <span className="text-xs font-bold">{item.likes}</span></div>
            <div className="flex items-center gap-1.5"><MessageCircle size={14} /> <span className="text-xs font-bold">{item.comments || 0}</span></div>
            <div className="ml-auto w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-copper group-hover:bg-copper group-hover:text-carbon transition-all">
               <Maximize2 size={14} />
            </div>
          </div>
        </div>
        
        {/* Top Right Tag */}
        <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
           {item.type === "video" ? <Play size={12} className="text-white" /> : <ChevronRight size={12} className="text-white" />}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  const categories = [
    { id: "all", name: "All Media" },
    { id: "rides", name: "Group Rides" },
    { id: "events", name: "Events" },
    { id: "bikes", name: "Member Bikes" },
    { id: "rallies", name: "Rallies" },
    { id: "highlights", name: "Ride Highlights" },
  ];

  const autoGalleryItems = useMemo(() => {
    const modules = import.meta.glob(
      "../assets/gallery/**/*.{png,jpg,jpeg,webp,mp4,webm,mov}",
      { eager: true },
    );
    const items = Object.entries(modules).map(([path, mod], index) => {
      const parts = path.split("/");
      const filename = parts[parts.length - 1];
      const title = filename.replace(/[-_]/g, " ").replace(/\.[^.]+$/, "");
      const isVideo = /\.(mp4|webm|mov)$/i.test(filename);
      const normalizedPath = path.toLowerCase();
      let category = "rides";
      if (normalizedPath.includes("/rallies/")) category = "rallies";
      else if (normalizedPath.includes("/bikes/")) category = "bikes";
      else if (normalizedPath.includes("/events/")) category = "events";
      else if (normalizedPath.includes("/highlights/")) category = "highlights";
      else if (normalizedPath.includes("/rides/")) category = "rides";
      
      return {
        id: `local-${index}`,
        type: isVideo ? "video" : "image",
        src: mod.default,
        title,
        category,
        likes: Math.floor(Math.random() * 200) + 50,
        author: "BUC MEDIA",
      };
    });
    return items;
  }, []);

  const mediaItems = useMemo(() => {
    const backend = galleryItems.map(item => ({
      id: item._id,
      type: "image",
      src: item.imageUrl,
      title: item.eventName,
      category: item.category || "rides",
      author: "CENTRAL COMMAND",
      likes: 0,
    }));
    return [...backend, ...autoGalleryItems];
  }, [galleryItems, autoGalleryItems]);

  const filteredMedia = useMemo(() => 
    activeCategory === "all" ? mediaItems : mediaItems.filter(i => i.category === activeCategory)
  , [mediaItems, activeCategory]);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const data = await galleryService.getAll();
        setGalleryItems(data || []);
      } catch (err) {
        console.warn("Using local intelligence only.");
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <section id="gallery" className="relative pt-40 pb-32 bg-carbon-dark min-h-screen">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-copper/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-copper/5 rounded-full blur-[100px]"></div>
        
        {/* Kinetic Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] select-none pointer-events-none">
           <h2 className="text-[40vw] font-heading leading-none text-white whitespace-nowrap">VAULT</h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-copper font-body tracking-[0.5em] text-xs uppercase mb-4 block font-bold"
            >
              The BUC Chronicles
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-heading text-7xl md:text-8xl text-white uppercase leading-none"
            >
              The <span className="text-copper">Vault</span>
            </motion.h2>
          </div>
          
          <nav className="flex flex-wrap gap-x-12 gap-y-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative group font-heading text-sm uppercase tracking-widest transition-colors ${activeCategory === cat.id ? "text-white" : "text-white/40 hover:text-white"}`}
              >
                {cat.name}
                <motion.div 
                  initial={false}
                  animate={{ width: activeCategory === cat.id ? "100%" : "0%" }}
                  className="absolute -bottom-2 left-0 h-[1px] bg-copper transition-all"
                ></motion.div>
                <div className="absolute -bottom-2 left-0 w-0 h-[1px] bg-copper group-hover:w-full transition-all duration-300 opacity-50"></div>
              </button>
            ))}
          </nav>
        </header>

        {/* Broken Grid Masonry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
          {filteredMedia.slice(0, visibleCount).map((item, index) => (
            <GalleryCard 
              key={item.id} 
              item={item} 
              index={index} 
              onClick={setSelectedMedia} 
            />
          ))}
        </div>

        {/* Load More Strategem */}
        {visibleCount < filteredMedia.length && (
          <div className="mt-32 flex justify-center">
            <button 
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="relative px-12 py-5 group overflow-hidden border border-white/10"
            >
              <div className="absolute inset-0 bg-copper translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10 font-heading text-xs tracking-[0.4em] uppercase text-white group-hover:text-carbon transition-colors duration-500">
                Explore Visual Archive
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Cinematic Quad-Split Lightbox */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-20 bg-carbon-dark/95 backdrop-blur-2xl"
          >
            {/* Split Reveal Shutter Effects could be added here as motion divs */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video md:aspect-auto md:h-full bg-carbon border border-white/5 overflow-hidden flex flex-col md:flex-row shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
            >
              <div className="flex-1 bg-black relative">
                {selectedMedia.type === "video" ? (
                  <video src={selectedMedia.src} className="w-full h-full object-contain" autoPlay controls />
                ) : (
                  <img src={selectedMedia.src} alt={selectedMedia.title} className="w-full h-full object-contain" />
                )}
              </div>
              
              <div className="w-full md:w-80 p-8 flex flex-col justify-between border-l border-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-copper"></div>
                    <span className="text-[10px] font-bold text-copper uppercase tracking-[0.2em]">{selectedMedia.category}</span>
                  </div>
                  <h3 className="font-heading text-3xl text-white uppercase mb-4 leading-tight">{selectedMedia.title}</h3>
                  <p className="text-steel-dim text-xs uppercase tracking-widest mb-12">SOURCE: {selectedMedia.author}</p>
                  
                  <div className="space-y-6">
                     <div className="flex items-center justify-between text-white/40 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-4">
                        <span>Affiliation</span>
                        <span className="text-white">BUC INDIA</span>
                     </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-12">
                   <button className="flex-1 py-4 border border-white/10 hover:border-copper flex items-center justify-center gap-2 text-white/60 hover:text-copper transition-all">
                      <Heart size={16} />
                      <span className="text-[10px] font-bold uppercase">{selectedMedia.likes}</span>
                   </button>
                   <button className="flex-1 py-4 border border-white/10 hover:border-copper flex items-center justify-center gap-2 text-white/60 hover:text-copper transition-all">
                      <Share2 size={16} />
                   </button>
                </div>
              </div>

              <button 
                onClick={() => setSelectedMedia(null)}
                className="absolute top-8 right-8 w-12 h-12 border border-white/10 flex items-center justify-center text-white/40 hover:text-copper hover:border-copper transition-all rounded-full"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
