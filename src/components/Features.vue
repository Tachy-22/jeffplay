<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Paintbrush,
  MessageCircle,
  TabletSmartphone,
  BadgeCheck,
  Goal,
  PictureInPicture,
  MousePointerClick,
  Newspaper,
} from "lucide-vue-next";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "tabletSmartphone",
    title: "Cross-Device Sync",
    description:
      "Seamlessly switch between your phone, tablet, and desktop. Your music follows you everywhere.",
  },
  {
    icon: "badgeCheck",
    title: "Curated Playlists",
    description:
      "Expert-curated playlists for every mood and moment. From workout beats to chill vibes.",
  },
  {
    icon: "goal",
    title: "Smart Discovery",
    description:
      "Discover new artists and tracks based on your listening habits. Never run out of fresh music.",
  },
  {
    icon: "pictureInPicture",
    title: "Lyrics Display",
    description:
      "Sing along with real-time synchronized lyrics. Never miss a word of your favorite songs.",
  },
  {
    icon: "mousePointerClick",
    title: "One-Tap Sharing",
    description:
      "Share your favorite tracks and playlists with friends instantly across all social platforms.",
  },
  {
    icon: "newspaper",
    title: "New Releases",
    description:
      "Stay updated with the latest music from your favorite artists. Get notified about new albums and singles.",
  },
];

const iconMap: Record<
  string,
  | typeof TabletSmartphone
  | typeof BadgeCheck
  | typeof Goal
  | typeof PictureInPicture
  | typeof Paintbrush
  | typeof MousePointerClick
  | typeof MessageCircle
  | typeof Newspaper
> = {
  tabletSmartphone: TabletSmartphone,
  badgeCheck: BadgeCheck,
  goal: Goal,
  pictureInPicture: PictureInPicture,
  paintbrush: Paintbrush,
  mousePointerClick: MousePointerClick,
  messageCircle: MessageCircle,
  newspaper: Newspaper,
};
</script>

<template>
  <section
    id="features"
    class="container py-24 sm:py-32"
  >
    <h2 class="text-lg text-primary text-center mb-2 tracking-wider">
      Features
    </h2>

    <h2 class="text-3xl md:text-4xl text-center font-bold mb-4">
      What Makes Jeffplay Special
    </h2>

    <h3 class="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
      Discover the features that make Jeffplay the ultimate music streaming
      platform. From smart recommendations to high-fidelity audio, we've got
      everything you need.
    </h3>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="{ icon, title, description } in featureList"
        :key="title"
      >
        <Card class="h-full bg-background border-0 shadow-none">
          <CardHeader class="flex justify-center items-center">
            <div
              class="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4"
            >
              <component
                :is="iconMap[icon]"
                class="size-6 text-primary"
              />
            </div>

            <CardTitle>
              {{ title }}
            </CardTitle>
          </CardHeader>

          <CardContent class="text-muted-foreground text-center">
            {{ description }}
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped></style>
