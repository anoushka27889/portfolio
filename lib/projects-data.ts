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
      "/media/projects/hatch-ai/slideshow-1.mp4",
      "/media/projects/hatch-ai/slideshow-2.mp4",
      "/media/projects/hatch-ai/slideshow-3.png",
      "/media/projects/hatch-ai/slideshow-4.mp4",
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
      '/media/projects/hatch-hardware/device.png',
      '/media/projects/hatch-hardware/hb-6.mp4',
      '/media/projects/hatch-hardware/hb-9.mp4',
      '/media/projects/hatch-hardware/hb-12__282_29.mp4',
      '/media/projects/hatch-hardware/hb-10.mp4',
      '/media/projects/hatch-hardware/hb-13__281_29.mp4',
      '/media/projects/hatch-hardware/Sequence_07_1.mp4',
      '/media/projects/hatch-hardware/hatch_mrb_2.mp4',
      '/media/projects/hatch-hardware/hatch_mrb_3.mp4',
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
      "/media/projects/rest/slideshow-1.mp4",
      "/media/projects/rest/slideshow-2.mp4",
      "/media/projects/rest/slideshow-3.mp4"
    ],
    hasCaseStudy: true,
    url: "/rest"
  },
  {
    id: 3,
    client: "Lumen",
    year: "2019–2023",
    title: "Building the world's first AR flashlight for shared exploration",
    images: [
      "/media/projects/lumen/slideshow-1.jpeg",
      "/media/projects/lumen/slideshow-2.png",
      "/media/projects/lumen/slideshow-3.mp4"
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
      "/media/projects/unge-univers/unge_univers.mp4",
      "/media/projects/unge-univers/ungeunivers_4.mp4",
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
      "/media/projects/fotex/fotex.002.mp4",
      "/media/projects/fotex/fotex_10.mp4",
      "/media/projects/fotex/fotex_3.jpeg",
      "/media/projects/fotex/fotex_11.mp4",
    ],
    hasCaseStudy: true,
    url: "/fotex"
  },
  {
    id: 6,
    client: "ÜPP",
    year: "2017",
    title: "Nurturing social empathy through connected play",
    images: [
      "/media/projects/upp/UPP_8_AnoushkaGarg.jpg",
      "/media/projects/upp/Children_Value.jpg",
      "/media/projects/upp/UPP1_Website.jpg",
      "/media/projects/upp/What_is_UPP_Slide.jpg",
    ],
    hasCaseStudy: true,
    url: "/upp"
  },
  {
    id: 7,
    client: "The Other Side",
    year: "2017",
    title: "Preserving memory and connection across generations",
    images: [
      "/media/projects/the-other-side/IMG_9790.JPG",
      "/media/projects/the-other-side/otherside_2.mp4",
      "/media/projects/the-other-side/process-1.mp4",
      "/media/projects/the-other-side/process-3.mp4",
    ],
    hasCaseStudy: true,
    url: "/the-other-side"
  }
]
