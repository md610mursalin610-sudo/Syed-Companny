import React from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Work } from './components/Work';
import { Process } from './components/Process';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ChatAgent } from './components/ChatAgent';

function App() {
  return (
    <div className="bg-background min-h-screen text-white font-sans selection:bg-indigo-500/30">
      <Navigation />
      
      <main>
        <Hero />
        <About />
        <Services />
        <Process />
        <Work />
        <Contact />
      </main>

      <Footer />
      <ChatAgent />
    </div>
  );
}

export default App;