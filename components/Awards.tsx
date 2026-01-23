import { awards } from '@/lib/content-data'

export default function Awards() {
  return (
    <div className="homepage-awards">
      <h2 className="homepage-section-title">Awards and Recognition</h2>
      <div className="homepage-awards-list">
        {awards.map((award, index) => (
          <div key={index} className="homepage-award-item">
            <div className="homepage-award-title">{award.title}</div>
            <div className="homepage-award-year">
              {award.project && `${award.project}, `}{award.year}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
