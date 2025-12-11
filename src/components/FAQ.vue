<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What audio quality does Jeffplay support?",
    answer: "Jeffplay supports multiple audio quality levels. Free users get standard quality (128kbps), while Premium subscribers enjoy high-quality streaming up to 320kbps, and lossless audio for the ultimate listening experience.",
    value: "item-1",
  },
  {
    question: "Can I download music for offline listening?",
    answer:
      "Yes! Premium and Family plan subscribers can download unlimited songs, albums, and playlists for offline listening. Simply tap the download button on any track or playlist.",
    value: "item-2",
  },
  {
    question:
      "How do I create and share playlists?",
    answer:
      "Creating playlists is easy! Just click the 'Create Playlist' button, add your favorite songs, and give it a name. You can share your playlists with friends via a link or directly on social media.",
    value: "item-3",
  },
  {
    question: "Is there a family plan available?",
    answer: "Absolutely! Our Family plan costs $14.99/month and includes up to 6 individual accounts with all Premium features, plus parental controls and kid-friendly content filters.",
    value: "item-4",
  },
  {
    question:
      "What's included in the free tier?",
    answer: "The free tier gives you access to millions of songs with occasional ads. You can create playlists, discover new music, and use our mobile and desktop apps. Upgrade to Premium for ad-free listening and offline downloads.",
    value: "item-5",
  },
];
</script>

<template>
  <section
    id="faq"
    class="container md:w-[700px] py-24 sm:py-32"
  >
    <div class="text-center mb-8">
      <h2 class="text-lg text-primary text-center mb-2 tracking-wider">FAQS</h2>

      <h2 class="text-3xl md:text-4xl text-center font-bold">
        Common Questions
      </h2>
    </div>

    <Accordion
      type="single"
      collapsible
      class="AccordionRoot"
    >
      <AccordionItem
        v-for="{ question, answer, value } in FAQList"
        :key="value"
        :value="value"
      >
        <AccordionTrigger class="text-left"> {{ question }} </AccordionTrigger>

        <AccordionContent>{{ answer }}</AccordionContent>
      </AccordionItem>
    </Accordion>

    <h3 class="font-medium mt-4">
      Still have questions?
      <a
        href="#"
        class="text-muted-foreground"
      >
        <a
          href="#"
          class="underline"
          >Contact us</a>
      </a>
    </h3>
  </section>
</template>
