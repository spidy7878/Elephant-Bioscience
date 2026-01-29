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
    <div className="relative min-h-fit sm:min-h-screen w-full bg-transparent px-4 sm:px-8 md:px-12 lg:px-8">
      <div
        ref={gridRef}
        className="brand-grid-main relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 pt-12 pb-4 sm:py-20 md:py-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 text-white">
          {/* LEFT BRAND COLUMN */}
          <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8 mb-10 lg:mb-0">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white/70 rounded-full flex items-center justify-center">
                <span className="text-base sm:text-lg font-semibold">EB</span>
              </div>
              <span className="text-base sm:text-xl font-light tracking-wide">
                Elephant Biosciences
              </span>
            </div>

            {/* EST Info */}
            <div className="text-xs sm:text-sm font-light text-white/80 leading-relaxed">
              <div className="uppercase tracking-widest text-xs mb-1">Est.</div>
              <div>Scientific Excellence</div>
              <div>Since 2014</div>
            </div>
          </div>

          {/* RIGHT CONTENT GRID */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-12 lg:gap-x-20 gap-y-12 md:gap-y-16 lg:gap-y-24">
            {/* Block 1 */}
            <div className="brand-block">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-light leading-snug">
                Precision in <br className="hidden sm:block" /> Every Molecule
              </h3>
              <div className="w-8 sm:w-10 h-px bg-white my-4 sm:my-6" />
              <p className="text-xs sm:text-sm leading-relaxed text-white/90 max-w-md">
                Discover the vanguard of biotechnological research. Elephant
                Biosciences delivers molecular solutions with unprecedented
                accuracy — ensuring your research is grounded in absolute
                integrity.
              </p>
            </div>

            {/* Block 2 */}
            <div className="brand-block">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-light leading-snug">
                Innovation at <br className="hidden sm:block" /> Scale
              </h3>
              <div className="w-8 sm:w-10 h-px bg-white my-4 sm:my-6" />
              <p className="text-xs sm:text-sm leading-relaxed text-white/90 max-w-md">
                We leverage cutting-edge sequences and proprietary synthesis to
                accelerate the future of human biology. From lab to life, we
                redefine what's possible in the cellular realm.
              </p>
            </div>

            {/* Block 3 */}
            <div className="brand-block">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-light leading-snug">
                Unrivaled <br className="hidden sm:block" /> Integrity
              </h3>
              <div className="w-8 sm:w-10 h-px bg-white my-4 sm:my-6" />
              <p className="text-xs sm:text-sm leading-relaxed text-white/90 max-w-md">
                Our lab operations ensure seamless, personalized research
                support. Every study is tailored to your specific requirements,
                maintaining the highest standards of data security and ethics.
              </p>
            </div>

            {/* Block 4 */}
            <div className="brand-block">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
