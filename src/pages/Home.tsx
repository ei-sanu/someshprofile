import Hero from '../components/Hero';
import About from '../components/About';
import Education from '../components/Education';
import Services from '../components/Services';
import Newsletter from '../components/Newsletter';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Education />
      <Services />
      <Newsletter />
      <Contact />
    </main>
  );
}
