export default function Home() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-screen-2xl mx-auto">
        <section className="mb-16">
          <h1 className="text-5xl md:text-7xl font-space-grotesk font-bold mb-6">
            Anoushka Garg
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl">
            Product designer crafting thoughtful experiences for people and their families.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-current p-8 rounded-lg hover:border-brand-green transition-colors">
            <h2 className="text-2xl font-space-grotesk font-bold mb-4">Featured Projects</h2>
            <p>Project gallery coming soon...</p>
          </div>

          <div className="border border-current p-8 rounded-lg hover:border-brand-green transition-colors">
            <h2 className="text-2xl font-space-grotesk font-bold mb-4">About</h2>
            <p>Learn more about my work and process...</p>
          </div>
        </section>
      </div>
    </div>
  )
}
