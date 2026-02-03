export default function PersonSchema() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Anoushka Garg',
    jobTitle: 'Product Designer',
    description: 'Product designer specializing in user experience, interaction design, and design leadership',
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
