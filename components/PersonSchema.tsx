export default function PersonSchema() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Anoushka Garg',
    jobTitle: ['UX Designer', 'Interaction Designer', 'Product Designer'],
    description: 'UX designer specializing in interaction design and AI-driven experiences at the intersection of physical and digital',
    url: 'https://anoushkagarg.com',
    sameAs: [
      'https://linkedin.com/in/anoushkagarg',
    ],
    email: 'hello@anoushkagarg.com',
    worksFor: {
      '@type': 'Organization',
      name: 'Hatch',
    },
    knowsAbout: [
      'Product Design',
      'User Experience Design',
      'Interaction Design',
      'Service Design',
      'AR/VR Design',
      'Healthcare UX',
      'Mobile App Design',
      'E-commerce Design',
    ],
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Copenhagen Institute of Interaction Design',
      },
    ],
    award: [
      'Red Dot Award 2021',
      'IxDA Awards Shortlist 2019',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  )
}
