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
      "/media/projects/hatch-ai/slideshow-1.gif",
      "/media/projects/hatch-ai/slideshow-2.gif",
      "/media/projects/hatch-ai/slideshow-3.png",
      "/media/projects/hatch-ai/slideshow-4.gif",
      "/media/projects/hatch-ai/slideshow-5.png"
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
      "/media/projects/hatch-hardware/slideshow-1.png",
      "/media/projects/hatch-hardware/slideshow-2.gif",
      "/media/projects/hatch-hardware/slideshow-3.gif",
      "/media/projects/hatch-hardware/slideshow-4.gif",
      "/media/projects/hatch-hardware/slideshow-5.gif",
      "/media/projects/hatch-hardware/slideshow-6.gif"
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
      "/media/projects/rest/slideshow-1.gif",
      "/media/projects/rest/slideshow-2.gif",
      "/media/projects/rest/slideshow-3.gif"
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
      "/media/projects/lumen/slideshow-1.jpeg",
      "/media/projects/lumen/slideshow-2.png",
      "/media/projects/lumen/slideshow-3.gif"
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
