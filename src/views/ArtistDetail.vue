<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { musicApi } from '../api/music'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { Separator } from '../components/ui/separator'
import { ArrowLeft, Globe, MapPin, Calendar, Music, Play, ExternalLink } from 'lucide-vue-next'

interface Props {
  id: string
}

const props = defineProps<Props>()
const router = useRouter()

// Fetch artist details
const { data: artist, isLoading: artistLoading } = useQuery({
  queryKey: ['artist', props.id],
  queryFn: () => musicApi.getArtistById(props.id),
  staleTime: 1000 * 60 * 10, // 10 minutes
})

// Fetch artist's albums
const { data: albums, isLoading: albumsLoading } = useQuery({
  queryKey: ['artist-albums', props.id],
  queryFn: () => musicApi.getAlbumsByArtistId(props.id),
  enabled: computed(() => !!props.id),
  staleTime: 1000 * 60 * 10,
})

// Fetch music videos
const { data: musicVideos, isLoading: videosLoading } = useQuery({
  queryKey: ['artist-videos', props.id],
  queryFn: () => musicApi.getMusicVideosByArtistId(props.id),
  enabled: computed(() => !!props.id),
  staleTime: 1000 * 60 * 10,
})

const goBack = () => {
  router.back()
}

const goToAlbum = (albumId: string) => {
  router.push(`/album/${albumId}`)
}

const getImageWithFallback = (imageUrl: string | undefined, fallback: string = '/placeholder-artist.jpg') => {
  return imageUrl || fallback
}

const formatBiography = (bio: string | undefined) => {
  if (!bio) return ''
  return bio.split('\n').filter(p => p.trim()).slice(0, 3).join('\n\n')
}

const openExternalLink = (url: string | undefined) => {
  if (url && url.startsWith('http')) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Back Button -->
    <Button
      variant="outline"
      @click="goBack"
      class="mb-6"
    >
      <ArrowLeft class="mr-2 h-4 w-4" />
      Back to Artists
    </Button>

    <!-- Artist Loading State -->
    <div v-if="artistLoading" class="space-y-8">
      <div class="flex flex-col md:flex-row gap-8">
        <Skeleton class="w-full md:w-80 h-80 rounded-lg" />
        <div class="flex-1 space-y-4">
          <Skeleton class="h-8 w-1/2" />
          <Skeleton class="h-4 w-1/3" />
          <Skeleton class="h-20 w-full" />
        </div>
      </div>
    </div>

    <!-- Artist Details -->
    <div v-else-if="artist" class="space-y-8">
      <!-- Hero Section -->
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Artist Image -->
        <div class="lg:w-80">
          <img
            :src="getImageWithFallback(artist.strArtistThumb || artist.strArtistLogo)"
            :alt="artist.strArtist"
            class="w-full h-80 object-cover rounded-lg shadow-lg"
          />
        </div>

        <!-- Artist Info -->
        <div class="flex-1 space-y-6">
          <div>
            <h1 class="text-4xl font-bold mb-2">{{ artist.strArtist }}</h1>
            <div class="flex flex-wrap gap-2 mb-4">
              <Badge v-if="artist.strGenre" variant="secondary">{{ artist.strGenre }}</Badge>
              <Badge v-if="artist.strStyle" variant="outline">{{ artist.strStyle }}</Badge>
              <Badge v-if="artist.strMood" variant="outline">{{ artist.strMood }}</Badge>
            </div>
          </div>

          <!-- Artist Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div v-if="artist.strCountry" class="flex items-center gap-2">
              <MapPin class="h-4 w-4 text-muted-foreground" />
              <span>{{ artist.strCountry }}</span>
            </div>
            
            <div v-if="artist.strFormed" class="flex items-center gap-2">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <span>Formed {{ artist.strFormed }}</span>
            </div>

            <div v-if="artist.strWebsite" class="flex items-center gap-2">
              <Globe class="h-4 w-4 text-muted-foreground" />
              <button @click="openExternalLink(artist.strWebsite)" class="text-primary hover:underline">
                Official Website
              </button>
            </div>

            <div v-if="artist.strFacebook" class="flex items-center gap-2">
              <ExternalLink class="h-4 w-4 text-muted-foreground" />
              <button @click="openExternalLink(artist.strFacebook)" class="text-primary hover:underline">
                Facebook
              </button>
            </div>
          </div>

          <!-- Biography -->
          <div v-if="artist.strBiographyEN" class="space-y-2">
            <h3 class="text-lg font-semibold">Biography</h3>
            <p class="text-muted-foreground leading-relaxed">
              {{ formatBiography(artist.strBiographyEN) }}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <!-- Albums Section -->
      <div class="space-y-6">
        <h2 class="text-2xl font-bold flex items-center gap-2">
          <Music class="h-6 w-6" />
          Albums
        </h2>

        <div v-if="albumsLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Card v-for="n in 8" :key="n" class="space-y-3">
            <Skeleton class="h-48 w-full rounded-t-lg" />
            <div class="p-4 space-y-2">
              <Skeleton class="h-4 w-3/4" />
              <Skeleton class="h-3 w-1/2" />
            </div>
          </Card>
        </div>

        <div v-else-if="albums?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Card 
            v-for="album in albums" 
            :key="album.idAlbum"
            class="cursor-pointer hover:shadow-lg transition-shadow"
            @click="goToAlbum(album.idAlbum)"
          >
            <div class="aspect-square overflow-hidden rounded-t-lg">
              <img
                :src="getImageWithFallback(album.strAlbumThumb, '/placeholder-album.jpg')"
                :alt="album.strAlbum"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </div>
            
            <CardHeader class="pb-2">
              <CardTitle class="text-base line-clamp-1">{{ album.strAlbum }}</CardTitle>
              <CardDescription>
                {{ album.intYearReleased || 'Unknown Year' }}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div v-else class="text-center py-8 text-muted-foreground">
          No albums found for this artist.
        </div>
      </div>

      <!-- Music Videos Section -->
      <div v-if="musicVideos?.length" class="space-y-6">
        <Separator />
        
        <h2 class="text-2xl font-bold flex items-center gap-2">
          <Play class="h-6 w-6" />
          Music Videos
        </h2>

        <div v-if="videosLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card v-for="n in 6" :key="n">
            <Skeleton class="h-32 w-full rounded-t-lg" />
            <div class="p-4">
              <Skeleton class="h-4 w-3/4" />
            </div>
          </Card>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card v-for="video in musicVideos.slice(0, 12)" :key="video.idTrack">
            <CardHeader>
              <CardTitle class="text-base line-clamp-2">{{ video.strTrack }}</CardTitle>
              <CardDescription v-if="video.strGenre">{{ video.strGenre }}</CardDescription>
            </CardHeader>
            
            <CardContent v-if="video.strMusicVid">
              <Button 
                variant="outline" 
                size="sm" 
                @click="openExternalLink(video.strMusicVid)"
                class="w-full"
              >
                <Play class="mr-2 h-3 w-3" />
                Watch Video
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <div class="text-destructive text-lg mb-4">
        Artist not found or failed to load.
      </div>
      <Button @click="goBack" variant="outline">
        <ArrowLeft class="mr-2 h-4 w-4" />
        Go Back
      </Button>
    </div>
  </div>
</template>