'use client';

import { motion } from 'framer-motion';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text font-sora mb-6">
            Our Portfolio
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            From Ethiopian wedding platforms to corporate chatbots — we build the digital products that matter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Habesha Celebration Events', category: 'Website', client: 'Events Business' },
            { name: 'Restaurant Booking Bot', category: 'Chatbot', client: 'Restaurant' },
            { name: 'Law Firm Secretary AI', category: 'Chatbot', client: 'Legal' },
            { name: 'Ethiopian Food Store', category: 'Website', client: 'E-commerce' },
            { name: 'Church Community Site', category: 'Website', client: 'Religious Org' },
            { name: 'Habesha Events Logo', category: 'Logo', client: 'Events Business' },
          ].map((project) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-card p-6 hover:border-[var(--accent-blue)] transition-all"
            >
              <div className="w-full h-40 bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] rounded-lg mb-4 flex items-center justify-center">
                {/* Project Image: Add /public/portfolio-{project-name}.jpg */}
                <span className="text-white/50 text-sm">Portfolio Image</span>
              </div>
              <span className="inline-block px-3 py-1 bg-[var(--glow-blue)] text-[var(--accent-blue)] text-xs font-bold rounded-full mb-2">
                {project.category}
              </span>
              <h3 className="text-lg font-bold font-sora text-[var(--text-primary)] mb-1">
                {project.name}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">{project.client}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
