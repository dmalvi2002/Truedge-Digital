import React from "react";

import { workExperience } from "@/data";
import { Button } from "@/components/ui/MovingBorders";
import Heading from "@/components/ui/Heading";

const Experience = () => {
  return (
    <div className="py-20 w-full">
      <Heading
        text="Expert in"
        highlightedText="Web & Digital Branding Solutions"
        className=""
      />

      <div className="w-full mt-12 flex flex-wrap justify-center gap-10">
        {workExperience.map((card) => (
          <Button
            key={card.id}
            duration={Math.floor(Math.random() * 10000) + 10000}
            borderRadius="1.75rem"
            style={{
              background: "rgb(4,7,29)",
              backgroundImage:
                "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
              borderRadius: `calc(1.75rem* 0.96)`,
            }}
            className="flex-1 text-white border-slate-800 basis-full md:basis-[calc(50%-1.25rem)] lg:basis-[calc(25%-1.875rem)]"
          >
            <div className="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
              <img
                src={card.thumbnail}
                alt={card.thumbnail}
                className="lg:w-32 md:w-20 w-16"
              />
              <div className="lg:ms-5">
                <h1 className="text-start text-xl md:text-2xl font-bold">
                  {card.title}
                </h1>
                <p className="text-start text-white-100 mt-3 font-semibold">
                  {card.desc}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Experience;
