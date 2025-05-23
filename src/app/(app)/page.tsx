"use client";
import messages from "@/test/message.json";
import Autoplay from "embla-carousel-autoplay";

import * as React from "react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  // using calc in tailwind css

  return (
    <>
      <div className="min-h-[calc(100vh-88px)] flex flex-col justify-between">
        {/* Main content */}
        <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 text-gray-800 ">
          <section className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold">
              Dive into the World of Anonymous Messages
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg">
              True Feedback - Where your identity remains a secret.
            </p>
          </section>
          {
            <Carousel
              plugins={[Autoplay({ delay: 2000 })]}
              opts={{
                align: "start",
              }}
              className="w-full max-w-5xl"
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2
										lg:basis-1/3
										"
                  >
                    <div className="p-1">
                      <Card className="flex flex-col items-center justify-center aspect-square gap-10">
                        <CardTitle className="text-center font-bold text-3xl mt-5 mx-4">
                          {message.title}
                        </CardTitle>
                        <CardContent className="flex flex-col items-center gap-5">
                          <span className="text-xl text-center font-semibold ">
                            {message.content}
                          </span>
                          <span className="text-xl text-center font-semibold ">
                            {message.extra_content}
                          </span>
                          <span>{message.received}</span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          }
        </main>

        {/* Footer */}
        <footer className=" text-center p-4 md:p-6 bg-gray-900 text-white">
          © 2025 BaKa. All rights reserved.
        </footer>
      </div>
    </>
  );
}
