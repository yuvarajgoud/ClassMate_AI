import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createChat } from "../api/api";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Upload,
  Brain,
  Sparkles,
  Globe,
  Zap,
  Users,
} from "lucide-react";

export default function LandingPage({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const heroImage = "/image.png"; // From public/

  const handleStart = async () => {
    const { data } = await createChat();
    navigate(`/chat/${data._id}`);
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="min-h-screen w-full text-gray-900 bg-white dark:bg-gray-900 dark:text-gray-100 transition-colors duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-8 py-16">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-900 mb-6">
            <Zap className="h-4 w-4 text-purple-600 dark:text-purple-300 mr-2" />
            <span className="text-sm font-semibold">AI-Powered Learning</span>
          </div>
          <motion.h1
            className="text-5xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-text"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Futuristic RAG Assistant
          </motion.h1>
          <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
            Upload documents, paste URLs, or share YouTube videos – get focused,
            personalized answers powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
            <motion.button
              onClick={handleStart}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-700 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start New Chat <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => setIsDemoOpen(true)}
              className="px-8 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl font-bold hover:scale-105 transition flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo <Sparkles className="w-5 h-5 text-purple-500" />
            </motion.button>
          </div>
        </div>
        <div className="flex-1 mt-12 lg:mt-0 relative">
          <motion.img
            src={heroImage}
            alt="AI Hero"
            className="rounded-3xl shadow-xl w-full h-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          />
        </div>
      </section>

      {/* Divider */}
      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

      {/* How It Works Section */}
      <motion.section
        className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-500"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            How It <span className="text-purple-600 dark:text-purple-400">Works</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Three simple steps to transform any content into your personal
            AI-powered learning experience
          </p>
        </div>

        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-10 max-w-6xl">
          {/* Step 1 */}
          <motion.div
            className="p-8 text-center bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Upload Content</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Drag and drop PDFs, documents, or paste website URLs and YouTube
              links
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="p-8 text-center bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">AI Processing</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our AI analyzes and understands your content using advanced RAG
              technology
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="p-8 text-center bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Get Answers</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Ask questions and receive focused, personalized answers from your
              content
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

      {/* Why Choose Us */}
      <motion.section
        className="py-20 bg-white dark:bg-gray-900 transition-colors duration-500"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Why <span className="text-pink-600 dark:text-pink-400">Choose Us</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Cut through the noise and focus on what matters most in your
            learning journey
          </p>
        </div>
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-10 max-w-6xl">
          <motion.div
            className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition flex flex-col items-center text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Brain className="h-8 w-8 mb-4 text-purple-500" />
            <h3 className="text-xl font-bold mb-2">Focused Learning</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get specific answers from your content without distractions or
              irrelevant information
            </p>
          </motion.div>
          <motion.div
            className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition flex flex-col items-center text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-8 w-8 mb-4 text-blue-500" />
            <h3 className="text-xl font-bold mb-2">Personalized Responses</h3>
            <p className="text-gray-600 dark:text-gray-300">
              AI adapts to your learning style and provides answers tailored to
              your needs
            </p>
          </motion.div>
          <motion.div
            className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition flex flex-col items-center text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Globe className="h-8 w-8 mb-4 text-pink-500" />
            <h3 className="text-xl font-bold mb-2">Multiple Sources</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Learn from documents, websites, and YouTube videos all in one
              place
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contributors */}
      {/* Contributors */}
<motion.section
  className="py-16 bg-gray-50 dark:bg-gray-800 text-center transition-colors duration-500"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.7 }}
>
  <h2 className="text-3xl font-bold mb-12">Built By</h2>
  <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8">
    {[
      {
        name: "Yuvaraj Goud",
        url: "https://www.linkedin.com/in/yuvarajgoud/",
      },
      {
        name: "Shaik Mahammed Arif",
        url: "https://www.linkedin.com/in/mahammedarif/",
      },
      {
        name: "Sai Vignesh",
        url: "https://www.linkedin.com/in/saivignesh-sulaganti-390a862a9/",
      },
    ].map((dev, idx) => (
      <motion.a
        key={idx}
        href={dev.url}
        target="_blank"
        rel="noopener noreferrer"
        className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition flex items-center gap-4 w-64"
        whileHover={{ scale: 1.05 }}
      >
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div className="text-left">
          <h3 className="font-semibold">{dev.name}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Developer
          </p>
        </div>
      </motion.a>
    ))}
  </div>
</motion.section>


      {/* Demo Video Modal */}
      {isDemoOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsDemoOpen(false)} // Close when clicking outside
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-3xl w-full mx-4 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Close Button */}
            <div className="flex justify-end p-2">
              <button
                onClick={() => setIsDemoOpen(false)}
                className="text-gray-600 dark:text-gray-300 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            {/* YouTube Video */}
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/H-2YQ7yYA8A?si=rfFMcI8QtpwlAQSi&autoplay=1"
                title="Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="py-8 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400 transition-colors duration-500">
        <p>
          © {new Date().getFullYear()} Futuristic RAG Assistant. All rights
          reserved.
        </p>
      </footer>
    </motion.div>
  );
}
