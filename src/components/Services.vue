<script setup lang="ts">
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

enum ProService {
  YES = 1,
  NO = 0,
}

interface ServiceProps {
  title: string;
  pro: ProService;
  description: string;
}

const serviceList: ServiceProps[] = [
  {
    title: "Podcast Integration",
    description:
      "Listen to your favorite podcasts alongside your music in one seamless experience.",
    pro: 0,
  },
  {
    title: "Artist Radio",
    description:
      "Create radio stations based on your favorite artists and discover similar music.",
    pro: 0,
  },
  {
    title: "Music Discovery AI",
    description: "Advanced AI that learns your taste and suggests perfect tracks.",
    pro: 0,
  },
  {
    title: "Concert Alerts",
    description: "Get notified when your favorite artists are performing near you.",
    pro: 1,
  },
];
</script>

<template>
  <section
    id="services"
    class="container py-24 sm:py-32"
  >
    <h2 class="text-lg text-primary text-center mb-2 tracking-wider">
      Services
    </h2>

    <h2 class="text-3xl md:text-4xl text-center font-bold mb-4">
      Premium Music Features
    </h2>
    <h3 class="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
      Enhance your listening experience with advanced features designed for true
      music lovers. From podcasts to live concert notifications.
    </h3>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>

    <div
      class="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-[60%] mx-auto"
    >
      <div
        v-for="{ title, description, pro } in serviceList"
        :key="title"
      >
        <Card class="bg-muted/60 dark:bg-card h-full relative">
          <CardHeader>
            <CardTitle>{{ title }}</CardTitle>
            <CardDescription>{{ description }}</CardDescription>
          </CardHeader>
          <Badge
            v-if="pro === ProService.YES"
            variant="secondary"
            class="absolute -top-2 -right-3"
            >PRO</Badge
          >
        </Card>
      </div>
    </div>
  </section>
</template>
