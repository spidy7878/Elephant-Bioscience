"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const title = sectionRef.current?.querySelector(".about-title");
      const items = sectionRef.current?.querySelectorAll(".about-item");
      if (title) {
        gsap.fromTo(
          title,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reset",
            },
          }
        );
      }
      if (items && items.length) {
        gsap.fromTo(
          items,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.25,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reset",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-fit w-full flex items-center bg-transparent px-4 sm:px-8 md:px-12 lg:px-8 py-12 sm:py-24">
      <div
        ref={sectionRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8"
      >
        <div className="max-w-5xl w-full">
          <h2 className="about-title text-white text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light leading-tight mb-8 break-words">
            Elephant Biosciences<sup className="text-xs md:text-base">®</sup> is
            a leading biotech research laboratory with over 5,000 molecular
            studies completed globally. From research institutions to innovative
            startup labs, our partners trust us to deliver absolute scientific
            precision.
          </h2>

          <div className="flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-8 mt-10 sm:mt-16 text-white/90">
            <div className="about-item flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/40 flex items-center justify-center text-base sm:text-xl">
                🔬
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-white/70">
                  EST.
                </div>
                <div className="text-xs sm:text-sm font-light">
                  SCIENTIFIC EXCELLENCE
                </div>
                <div className="text-xs sm:text-sm font-light">SINCE 2014</div>
              </div>
            </div>

            <div className="about-item flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div>
                <div className="text-base sm:text-lg font-light">
                  Molecular Accuracy
                </div>
                <div className="text-xs sm:text-sm text-white/70">
                  Research Standards
                </div>
              </div>
            </div>

            <div className="about-item flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div>
                <div className="text-base sm:text-lg font-light">
                  Innovation at Scale
                </div>
                <div className="text-xs sm:text-sm text-white/70">
                  Future of Biology
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
