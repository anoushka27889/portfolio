import Bio from '@/components/Bio'
import WorkContainer from '@/components/WorkContainer'
import Awards from '@/components/Awards'
import About from '@/components/About'
import Footer from '@/components/Footer'
import PersonSchema from '@/components/PersonSchema'

export default function Home() {
  return (
    <div className="min-h-screen">
      <PersonSchema />
      {/* Bio Section */}
      <section className="mb-20 md:mb-32">
        <Bio />
      </section>

      {/* Work Container - Projects Grid */}
      <section className="mb-20 md:mb-32">
        <WorkContainer />
      </section>

      {/* Awards and About Section */}
      <section className="homepage-awards-about">
        <div className="homepage-awards-about-content">
          <Awards />
          <About />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
