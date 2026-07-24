import { partnerLogos } from '../../data/homeMockData';

export default function PartnerLogos() {
  return (
    <section className="partner-logos-section">
      <p className="text-center text-muted">Trusted by the world's most innovative companies</p>
      <div className="logos-container">
        <div className="logos-marquee">
          {[...partnerLogos, ...partnerLogos].map((logo, i) => (
            <span key={i} className="partner-logo">{logo}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
