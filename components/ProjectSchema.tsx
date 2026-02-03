interface ProjectSchemaProps {
  name: string
  description: string
  url: string
  dateCreated: string
  keywords: string[]
  image?: string
}

export default function ProjectSchema({
  name,
  description,
  url,
  dateCreated,
  keywords,
  image,
}: ProjectSchemaProps) {
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url,
    dateCreated,
    keywords: keywords.join(', '),
    creator: {
      '@type': 'Person',
      name: 'Anoushka Garg',
      jobTitle: 'Product Designer',
      url: 'https://anoushkagarg.com',
    },
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image,
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
    />
  )
}
