<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Star } from "lucide-vue-next";

interface ReviewProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating: number;
}

const reviewList: ReviewProps[] = [
  {
    image: "https://github.com/shadcn.png",
    name: "Alex Rivera",
    userName: "Music Enthusiast",
    comment:
      "Jeffplay has completely transformed how I discover music. The AI recommendations are spot-on, and the audio quality is unmatched!",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Sarah Chen",
    userName: "Professional DJ",
    comment:
      "As a DJ, I need reliable access to high-quality music. Jeffplay delivers every time with its vast library and offline mode.",
    rating: 4.8,
  },

  {
    image: "https://github.com/shadcn.png",
    name: "Marcus Johnson",
    userName: "Indie Artist",
    comment:
      "The platform helped me discover so many new artists and genres. The curated playlists are perfect for every mood and occasion.",
    rating: 4.9,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Emma Thompson",
    userName: "Podcast Host",
    comment:
      "I love how Jeffplay integrates podcasts with music. It's my one-stop app for all audio entertainment. The cross-device sync is seamless!",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "David Park",
    userName: "Music Producer",
    comment:
      "The lossless audio quality is a game-changer. I can finally hear every detail in the production. Jeffplay is essential for any serious listener.",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Lisa Martinez",
    userName: "Fitness Instructor",
    comment:
      "Creating workout playlists has never been easier. The energy-based recommendations keep my classes pumped and motivated!",
    rating: 4.9,
  },
];
</script>

<template>
  <section
    id="testimonials"
    class="container py-24 sm:py-32"
  >
    <div class="text-center mb-8">
      <h2 class="text-lg text-primary text-center mb-2 tracking-wider">
        Testimonials
      </h2>

      <h2 class="text-3xl md:text-4xl text-center font-bold mb-4">
        Hear What Our 100K+ Users Say
      </h2>
    </div>

    <Carousel
      :opts="{
        align: 'start',
      }"
      class="relative w-[80%] sm:w-[90%] lg:max-w-screen-xl mx-auto"
    >
      <CarouselContent>
        <CarouselItem
          v-for="review in reviewList"
          :key="review.name"
          class="md:basis-1/2 lg:basis-1/3"
        >
          <Card class="bg-muted/50 dark:bg-card">
            <CardContent class="pt-6 pb-0">
              <div class="flex gap-1 pb-6">
                <Star class="size-4 fill-primary text-primary" />
                <Star class="size-4 fill-primary text-primary" />
                <Star class="size-4 fill-primary text-primary" />
                <Star class="size-4 fill-primary text-primary" />
                <Star class="size-4 fill-primary text-primary" />
              </div>

              "{{ review.comment }}"
            </CardContent>

            <CardHeader>
              <div class="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src="https://www.radix-vue.com/logo.svg"
                    alt="@radix-vue"
                  />
                  <AvatarFallback>SV</AvatarFallback>
                </Avatar>

                <div class="flex flex-col">
                  <CardTitle class="text-lg">{{ review.name }}</CardTitle>
                  <CardDescription>{{ review.userName }}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </section>
</template>
