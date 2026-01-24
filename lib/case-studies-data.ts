export interface ProcessBlock {
  header: string
  description: string
  media?: string | string[] // Single image/video URL or array for gallery
}

export interface CaseStudyContent {
  projectId: number
  year: string
  team: string
  role: string
  challenge: string
  processBlocks: ProcessBlock[]
  outcome: string
}

export const caseStudies: CaseStudyContent[] = [
  {
    projectId: 2, // Hatch Rest
    year: '2023',
    team: 'With product, engineering, content, customer support teams at Hatch',
    role: 'Role: UX & Product Design Lead',
    challenge: 'After launching the second-generation of the product- Rest, user feedback indicated that the product had become too complex. While numerous innovative features were added, the core experience of controlling a light and sound machine had become less intuitive. New parents, the primary users, found themselves navigating through multiple screens to accomplish basic tasks. Additionally, the business faced increasing competition from new market entrants offering similar experiences. As the company\'s flagship product and primary revenue driver, with over 35,000 Amazon reviews and a history as the #1 Best Seller in its category, getting this redesign right was crucial for the business\'s continued success.',
    processBlocks: [
      {
        header: 'Simple for core users, advanced for power users',
        description: 'Our user research revealed that while we served multiple age groups, most users were expecting parents or those with infants. They wanted three things: quick access to basic controls, reliable connectivity, and easy-to-save settings. This insight drove us to simplify the core experience while preserving advanced features for power users.'
      },
      {
        header: 'In collaboration with customers',
        description: 'Working closely with engineering and product teams, we prototyped various interface solutions that would make the experience more intuitive while maintaining the product\'s advanced capabilities. This involved numerous iterations and user testing sessions to validate our assumptions.'
      },
      {
        header: 'Designed for tired, sleepy hands',
        description: 'We surfaced essential controls prominently while tucking advanced features into accessible locations. Simplified navigation reduced steps for common tasks. The new home screen prioritized immediate control with streamlined onboarding, clearly separating basic and advanced functionality so parents could quickly access what they needed most.'
      }
    ],
    outcome: 'The redesign met with mixed feedback, highlighting both successes and areas for continued improvement. While some users appreciated the simplified interface and more reliable core functionality, others needed time to adjust to the changes. This mixed response reinforced key learnings about balancing product evolution with user familiarity - particularly the challenge of introducing new features while maintaining an intuitive experience.<br/><br/>Through continued user research and feedback, we\'ve kept iterating on the Rest experience, adapting to our users\' evolving needs and working to find the right balance between simplicity and sophistication. This project taught us valuable lessons about the complexity of redesigning a beloved product and the importance of bringing users along on the journey of change.'
  },
  {
    projectId: 3, // Lumen
    year: '2019–2023',
    team: 'With Arvind Sanjeev, Matt Visco, Can Yandarag',
    role: 'Role: Experience design and prototyping, research, brand & website design, product strategy',
    challenge: 'The metaverse is not built for group experiences. We created an iPhone-powered handheld AR device allowing users to augment physical surroundings by projecting AR onto objects and surfaces. Our vision emphasizes a metaverse that is physical first, social by default, and not constrained to screen-based experiences.',
    processBlocks: [
      {
        header: 'Human experience at the core',
        description: 'Development utilized people-centered design and research, including stakeholder interviews and storytelling sessions to formulate the design challenge. We focused on understanding how people naturally explore and interact with their physical environment.'
      },
      {
        header: 'Learning by doing',
        description: 'Multiple experience prototyping sessions with different participants employed sacrificial prototypes to gather insights informing functional prototype development. Each iteration helped us understand what worked and what didn\'t in real-world exploration scenarios.'
      },
      {
        header: 'Adapting as technology evolves',
        description: 'Technical exploration progressed through several prototyping rounds, testing technologies including neural network powered object classification and V-SLAM systems, aiming to create a mixed reality device that encourages people to explore environments freely.'
      }
    ],
    outcome: 'Incorporated in 2021, Lumen sold units to organizations including Snap, Meow Wolf, Stanford, Harvard, and creative agencies globally. Notable investors include Alex Chung, Aaron Koblin, and David Rose. The platform demonstrated that AR experiences could be social, physical-first, and encourage real-world exploration rather than isolating users behind screens.'
  },
  {
    projectId: 4, // Unge Univers
    year: '2021',
    team: 'BørneRiget Hospital × Fjord',
    role: 'Role: Led experience design and strategy, conducting workshops with stakeholders and iterative testing with teens',
    challenge: 'Adolescents undergoing medical treatment at BørneRiget Hospital faced significant isolation and disconnection during a formative developmental period. The hospital recognized that social connection was critically lacking for teens navigating both identity development and medical care simultaneously.',
    processBlocks: [
      {
        header: 'From medical to social: Rethinking care',
        description: 'We conducted research with patients across different treatment scenarios. This investigation revealed how vital social connections are during treatment. Rather than developing another medical tool, the approach centered on social design as the core challenge. Research findings also established parameters to guide any solution for this demographic.'
      },
      {
        header: 'Design through feedback and collaboration',
        description: 'The design methodology prioritized rapid prototyping and continuous feedback loops. We developed interaction prototypes tested with teens experiencing different mobility levels and treatment requirements. Each testing session refined the experience, resulting in features like adaptive motion games for bedridden patients and social spaces accommodating physical limitations.'
      },
      {
        header: 'Features that bring agency, engagement and movement',
        description: 'The platform enables teens to discover events, connect with peers, and participate in activities regardless of physical hospital location. QR codes transform ordinary spaces into game zones. Privacy controls and moderation ensure safe, natural social interaction. Custom avatars and achievement systems restore a sense of agency frequently lost during medical treatment.'
      }
    ],
    outcome: 'UngeUnivers is being implemented at BørneRiget\'s new facility. Early testing demonstrates increased social interaction across mobility levels and higher engagement in physical activities. The platform has evolved into a framework with potential to transform how adolescents experience medical care, demonstrating that digital tools can create more human healthcare environments.'
  },
  {
    projectId: 5, // Fotex
    year: '2021',
    team: 'Salling Group × Fjord × Accenture',
    role: 'Role: Design Lead for service design, product development, and platform architecture. Led a team of 5 designers collaborating with product and engineering teams',
    challenge: 'When COVID-19 struck Denmark in 2020, føtex confronted an urgent transformation need. As one of Denmark\'s largest retailers operating over 600 stores with 50,000 employees, the company faced pressure to rapidly convert its 60-year-old physical retail model into a digital-first operation. The core imperative was ensuring essential services remained accessible to all Danes during unprecedented circumstances.',
    processBlocks: [
      {
        header: 'Beyond conversion',
        description: 'We discovered that digital grocery shopping encompasses multiple distinct behaviors rather than a single unified pattern. Some customers methodically search for specific products, while others browse exploratively. Purchase behaviors vary from weekly stock-up shopping to last-minute ingredient needs. This insight informed the development of two distinct yet interconnected interaction models, enabling the platform to accommodate the customer\'s shopping mindset rather than imposing a standardized approach.'
      },
      {
        header: 'An omni-channel solution',
        description: 'Shopping occurs across diverse contexts—morning commutes, lunch breaks, evening browsing at home. We built a comprehensive omni-channel solution where experiences flexed seamlessly across desktop, tablet, and mobile devices while preserving brand consistency. Each interface optimized for its specific context, yet all maintained føtex\'s unified identity.'
      },
      {
        header: 'Engineering impact',
        description: 'Technical implementation extended beyond basic e-commerce functionality. The platform integrated a recipe universe featuring intelligent sustainability scoring, empowering customers to make environmentally conscious selections. The backend managed complex inventory logistics spanning hundreds of store locations while the frontend delivered effortless product browsing across thousands of items.'
      }
    ],
    outcome: 'The project scope transcended the digital interface alone, encompassing fulfillment operations, delivery logistics, and comprehensive service design. This ensured end-to-end experiences matched quality standards Danish customers anticipated from føtex. The platform managed thousands of daily transactions across Denmark, demonstrating that digital transformation needn\'t sacrifice the human-centered service that established føtex\'s 60-year success—it simply extended that experience to customers wherever needed.<br/><br/><em>Note: The delivery service was discontinued due to operational challenges in 2023.</em>'
  },
  {
    projectId: 6, // Upp
    year: '2017',
    team: 'Independent, Interaction Design Grad project. Conducted research at Rygaards International School with input from teachers, parents, and children',
    role: 'Role: Concept Development, Interaction Design, Research',
    challenge: 'How might we tap into positive emotions to help 6-8 year olds discuss complex emotions around them? The project explored using technology to foster emotional awareness rather than hinder social development, addressing concerns about tech\'s impact on children\'s emotional growth.',
    processBlocks: [
      {
        header: 'Initial research phase',
        description: 'We combined desk study with collaborative input from educators, families, and students to understand classroom social dynamics. Observations highlighted the crucial role of non-verbal communication in fostering engagement and friendships among students.',
        media: '/media/projects/upp/process-1.gif'
      },
      {
        header: 'Prototype iterations',
        description: 'We developed a wearable badge detecting smiles and providing haptic feedback, allowing children to experience smiles through touch rather than sight. This demonstrated children\'s capacity to connect emotionally through subtle tactile cues. We then introduced tangible tokens children could exchange, which naturally prompted conversations regarding acceptance and belonging. This physical representation of emotions proved valuable in helping children discuss difficult topics.'
      },
      {
        header: 'Final development',
        description: 'We integrated facial recognition and machine learning technology to create a scalable solution maintaining the playful, non-invasive quality of earlier iterations. The system needed to feel natural and fun, not like surveillance or monitoring.'
      }
    ],
    outcome: 'ÜPP became a character-based system where children wear companions that "catch" smiles throughout the day. Matching cloud elements rise in a classroom display jar when smiles are detected, increasing student mindfulness of peers\' emotions. A companion app equips teachers with classroom dynamics insights, enabling more inclusive learning environments. The project demonstrated that technology could support emotional development when designed thoughtfully and centered on positive interactions.'
  },
  {
    projectId: 7, // The Other Side
    year: '2017',
    team: 'With Bora Kim, James Zhou, and Stephanie Lee',
    role: 'Role: Concept Development, Experience Prototyping, Storytelling & Narrative Design, Brand Identity',
    challenge: 'How might we reimagine the connection between the living and the deceased in modern cemeteries? Traditional graveyards restrict engagement to static visits, creating emotional distance from departed loved ones. We explored ways to transform these experiences into something more intimate and meaningful.',
    processBlocks: [
      {
        header: 'Understanding the context',
        description: 'Research examined traditional cemetery limitations and their effect on grieving. We focused on understanding how multisensory experiences could strengthen the sense of connection with the deceased, moving beyond the traditional model of standing at a gravestone.',
        media: '/media/projects/the-other-side/process-1.gif'
      },
      {
        header: 'Multi-sensory VR experience',
        description: 'We developed a virtual reality prototype using HTC Vive, combining 360-degree video with carefully designed physical elements. The experience integrated multiple sensory touchpoints: heat lamps for warmth, gentle breezes, a sand pit for tactile sensation, selected scents, and physical objects like rocks that visitors could hold.'
      },
      {
        header: 'Guided emotional experience design',
        description: 'The narrative journey received special attention, designed to help visitors gradually develop emotional connection through guided imagination and memory recall. Each element was carefully orchestrated to create a sense of presence and peace.',
        media: '/media/projects/the-other-side/process-3.gif'
      }
    ],
    outcome: '"The Other Side" emerged as an afterlife service transforming traditional cemetery visits into immersive, multisensory experiences. Rather than conventional tombstones, it creates an environment fostering genuine presence and peace, enabling visitors to maintain meaningful relationships with departed loved ones through virtual reality and physical sensation. The project explored how technology could support the grieving process and create new rituals for remembrance.'
  }
]

// Helper function to get case study by project ID
export function getCaseStudyByProjectId(projectId: number): CaseStudyContent | undefined {
  return caseStudies.find(study => study.projectId === projectId)
}
