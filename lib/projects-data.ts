export interface ProjectData {
  id: number
  client: string
  year: string
  title: string
  description?: string
  images: string[]
  hasCaseStudy: boolean
  url?: string
  comingSoon?: boolean
}

export const projects: ProjectData[] = [
  {
    id: 0,
    client: "Hatch",
    year: "2025",
    title: "Designing Hatch's first AI sleep agent: 24/7 expert support for parents",
    images: [
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/3aa1a281-9d19-4688-ba29-4d175111635c/testPS.gif?content-type=image%2Fgif",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/e32e6e94-da0a-41ad-a5f7-8d60bba42738/testPS3.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/0b26aa78-e042-41f8-816c-5dc2d5e55f33/testPS2.gif?content-type=image%2Fgif",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/ddbad84e-c2d2-40ec-9e21-a9b9bf4ed5f3/testPS4.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738564092846-SZ5LJX5LREUA9Z8AZHEC/unnamed-4.gif?content-type=image%2Fgif"
    ],
    hasCaseStudy: false,
    comingSoon: true
  },
  {
    id: 1,
    client: "Hatch",
    year: "2024-2025",
    title: "Simplifying the entire Hatch experience for new hardware launch",
    images: [
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/4e27cba8-9f59-4ef4-9a95-64ac5c2bced9/pbbanner.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/b4fd3f4c-3411-4c56-9767-b44f8c75c07a/pbbanner4.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/3f7a18a5-48eb-47bd-847b-f20ab91dc9e7/pbbanner2.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/2eb05eaa-6485-4c56-960d-e79f88cf8d55/pbbanner3.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/f3862ad6-4abc-4d58-805a-b0adb5f4fffa/pbbanner5.png?content-type=image%2Fpng"
    ],
    hasCaseStudy: false,
    comingSoon: true
  },
  {
    id: 2,
    client: "Hatch",
    year: "2023-2024",
    title: "Refining the app experience for sleep-deprived parents",
    images: [
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/c8d62c30-3f07-46fc-bbbe-1af92eb9c3ee/rest-banner.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738559901823-78I80I9BCZFPRWVVNZEF/rest-banner2.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738559896394-GTPTQG2MBJ8FQ7ZYF7SZ/rest-banner3.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738559890918-2R24YZNCCWMH4VUY5RTE/rest-banner4.png?content-type=image%2Fpng"
    ],
    hasCaseStudy: true,
    url: "/rest"
  },
  {
    id: 3,
    client: "Self-founded",
    year: "2019–2023",
    title: "Building the world's first AR flashlight for shared exploration",
    images: [
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560018092-P1JDZ99UKZUXQSDBWPZ9/lumen-banner.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560029165-DCXHHSQFHDJH0NNUQNZY/lumen-banner2.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560041896-LHYGJOWWWHLSTCZ8S6M7/lumen-banner3.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560055012-KYP6OHT3H16YUWZ9Q6EF/lumen-banner4.png?content-type=image%2Fpng"
    ],
    hasCaseStudy: true,
    url: "/lumen"
  },
  {
    id: 4,
    client: "BørneRiget Hospital × Fjord",
    year: "2021",
    title: "Creating a social network for young patients in long-term hospital care",
    images: [
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560113372-SLHLX6EQ7L9HBVJL0Y10/uu-banner.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560121974-BPG9X5VJO2Y9FQMTMVWH/uu-banner2.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560135122-D9P9SVXE2NZVD26YTI42/uu-banner3.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560148334-QTU4P5KIJMYRMTK4LH7N/uu-banner4.png?content-type=image%2Fpng"
    ],
    hasCaseStudy: true,
    url: "/unge-univers"
  },
  {
    id: 5,
    client: "Salling Group × Fjord",
    year: "2021",
    title: "Transforming Denmark's largest grocery chain for digital-first shoppers",
    images: [
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560200932-6S6NBQVMXL7GVLC19WSO/fotex-banner.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560216015-IJ1BUWDLNLBTSMR13O6G/fotex-banner2.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560226793-NHGNM3R6FXZCM3M6XYAA/fotex-banner3.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560240022-KDEPG84WV3GJF6Q6DV96/fotex-banner4.png?content-type=image%2Fpng"
    ],
    hasCaseStudy: true,
    url: "/fotex"
  },
  {
    id: 6,
    client: "Self-initiated",
    year: "2017",
    title: "Nurturing social empathy through connected play",
    images: [
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560295234-Y13GNBNFEKHJRTB63ZMG/upp-banner.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560308698-YWQSGP6D2RC0GPN9MKPE/upp-banner2.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560324267-QJBQBJ5GTODFR92J3KDO/upp-banner3.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560337866-1CY62ZQQOEJBMJ10YJEF/upp-banner4.png?content-type=image%2Fpng"
    ],
    hasCaseStudy: true,
    url: "/upp"
  },
  {
    id: 7,
    client: "Self-initiated",
    year: "2017",
    title: "Preserving memory and connection across generations",
    images: [
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560396479-EMAXZTDAFGQGPMMLKSZ5/tos-banner.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560407919-PYR8XTGFJZ0KNY41XZEG/tos-banner2.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560422359-WNBMCQQRW52I3KCNZJPC/tos-banner3.png?content-type=image%2Fpng",
      "https://images.squarespace-cdn.com/content/6738d2af7eb1c555618825c1/1738560435569-1EQ61H6Q0CRZWT28CTWQ/tos-banner4.png?content-type=image%2Fpng"
    ],
    hasCaseStudy: true,
    url: "/the-other-side"
  }
]
