"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutBrandGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const grid = gridRef.current?.querySelector(".brand-grid-main");
      const blocks = gridRef.current?.querySelectorAll(".brand-block");
      if (grid) {
        gsap.fromTo(
          grid,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 75%",
              toggleActions: "play none none reset",
            },
          }
        );
      }
      if (blocks && blocks.length) {
        gsap.fromTo(
          blocks,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.25,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 70%",
              toggleActions: "play none none reset",
            },
          }
        );
      }
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-fit w-full bg-transparent px-4 sm:px-8 md:px-12 lg:px-8">
      <div
        ref={gridRef}
        className="brand-grid-main relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 pt-12 pb-4 sm:py-12 md:py-16"
      >
        <div className="grid grid-cols-1 text-white">
          {/* MAIN CONTENT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-12 lg:gap-x-20 gap-y-12 md:gap-y-16 lg:gap-y-24">
            {/* Block 1 */}
            <div className="brand-block">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-light leading-snug">
                Sustainable Practices & <br className="hidden sm:block" />{" "}
                Environmental Stewardship
              </h3>
              <div className="w-8 sm:w-10 h-px bg-white my-4 sm:my-6" />
              <p className="text-xs sm:text-sm leading-relaxed text-white/90 max-w-md">
                We recognize our responsibility toward sustainable science and
                operate with a long-term commitment to environmental
                stewardship. Our approach emphasizes optimized synthesis
                pathways to minimize waste, responsible use of solvents and
                materials, efficient logistics and packaging, and the continual
                integration of environmentally conscious operational practices.
              </p>
            </div>

            {/* Block 2 */}
            <div className="brand-block">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-light leading-snug">
                Innovation at <br className="hidden sm:block" /> Scale
              </h3>
              <div className="w-8 sm:w-10 h-px bg-white my-4 sm:my-6" />
              <p className="text-xs sm:text-sm leading-relaxed text-white/90 max-w-md">
                We advance human biology through the design and synthesis of
                precise amino acid chains, enabling reproducible and scalable
                innovation. From foundational research through applied use, our
                work is guided by molecular accuracy, translational relevance,
                and a disciplined approach to cellular science.
              </p>
            </div>

            {/* Block 3 */}
            <div className="brand-block">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-light leading-snug">
                Quality &<br className="hidden sm:block" /> Compliance
              </h3>
              <div className="w-8 sm:w-10 h-px bg-white my-4 sm:my-6" />
              <p className="text-xs sm:text-sm leading-relaxed text-white/90 max-w-md">
                Quality is not inspected in—it is designed in. Our amino acid
                chains are supported by comprehensive analytical and quality
                documentation, including Certificates of Analysis, HPLC purity
                data confirming ≥99% purity, mass spectrometry identity
                verification, batch-wise traceability, and defined stability and
                storage guidance. Every product is released only after meeting
                predefined analytical specifications.
              </p>
            </div>

            {/* Block 4 */}
            {/* <div className="brand-block">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-light leading-snug">
                Global <br className="hidden sm:block" /> Standards
              </h3>
              <div className="w-8 sm:w-10 h-px bg-white my-4 sm:my-6" />
              <p className="text-xs sm:text-sm leading-relaxed text-white/90 max-w-md">
                With partnerships in over 150 research institutions, Elephant
                Biosciences brings the world of discovery closer. Our experts
                manage every molecular interaction, ensuring a flawless
                scientific journey.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
