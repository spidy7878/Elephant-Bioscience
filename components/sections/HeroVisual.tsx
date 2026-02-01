"use client";

export default function HeroVisual() {
  // Responsive styles for the containers
  const liquidWrapperStyle: React.CSSProperties = {
    width: "800px",
    height: "800px",
    maxWidth: "100%",
    marginTop: "-160px",
  };
  const textImgContainerStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    position: "relative",
    top: "-325px",
  };

  // Responsive adjustments for small screens
  if (typeof window !== "undefined" && window.innerWidth <= 600) {
    liquidWrapperStyle.width = "330px";
    liquidWrapperStyle.height = "330px";
    liquidWrapperStyle.marginTop = "-80px";
    textImgContainerStyle.top = "-120px";
  }

  return (
    <section className="hero-visual-section">
      {/* Red liquid */}
      <div className="liquid-img-wrapper" style={liquidWrapperStyle}>
        <img
          src="ell (3).svg"
          alt="Liquid"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Text as image */}
      <div className="text-img-container" style={textImgContainerStyle}>
        <img
          src="/ell (2).svg"
          alt="Text"
          className="text-img"
          style={{ margin: 0, padding: 0, display: "block" }}
        />
      </div>
    </section>
  );
}
