import React from "react";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { motion } from "framer-motion";

const projectData = [
  {
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    title: "Ultron AI Assistant",
    tags: ["Python", "AI", "Node.js", "API Setup"],
    link: "#",
    github: "https://github.com/ahsaniqbal0077-cloud/Ultron-Core",
  },
  {
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    title: "Distributed Cache System",
    tags: ["C++", "Networking", "System Arch", "TCP/IP"],
    link: "#",
    github: "https://github.com/ahsaniqbal0077-cloud/MiniDistributedCache",
  },
  {
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    title: "University Redesign",
    tags: ["Figma", "UI/UX", "Wireframing"],
    link: "#",
    github: "#",
  },
];

const Portfolio = () => {
  return (
    <section id="projects" className="bg-[#020202] py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center mb-20 relative z-20">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-blue-500 font-mono tracking-[0.4em] uppercase text-[10px] mb-4"
        >
          Project Showcase
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter"
        >
          Selected Works<span className="text-blue-500">.</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projectData.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="group relative overflow-hidden rounded-[2rem] bg-white/5 border border-white/10"
          >
            <div className="relative overflow-hidden aspect-[4/3] rounded-[1.5rem] m-2 pointer-events-none">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Added relative z-50 here to bring content above any canvas */}
            <div className="p-8 relative z-50">
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase pointer-events-none">{project.title}</h3>
              <div className="flex flex-wrap gap-2 mb-8 pointer-events-none">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[9px] uppercase tracking-widest font-mono px-3 py-1 bg-white/10 text-blue-300 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Made links inline-flex and ensured they capture pointer events */}
              <div className="flex gap-4">
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Github Repository" 
                  className="inline-flex p-3 bg-white/5 text-white rounded-xl hover:bg-blue-600 transition-all border border-white/10 relative z-50 pointer-events-auto cursor-pointer"
                >
                  <FiGithub size={20} />
                </a>
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Live Demo" 
                  className="inline-flex p-3 bg-white/5 text-white rounded-xl hover:bg-blue-600 transition-all border border-white/10 relative z-50 pointer-events-auto cursor-pointer"
                >
                  <FiExternalLink size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
} ;

export default Portfolio;