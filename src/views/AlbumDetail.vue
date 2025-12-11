<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { musicApi } from '../api/music'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { Separator } from '../components/ui/separator'
import { ArrowLeft, Calendar, Music, Play, Clock, Hash, User } from 'lucide-vue-next'

interface Props {
  id: string
}

const props = defineProps<Props>()
const router = useRouter()

// Fetch album details
const { data: album, isLoading: albumLoading } = useQuery({
  queryKey: ['album', props.id],
  queryFn: () => musicApi.getAlbumById(props.id),
  staleTime: 1000 * 60 * 10,
})

// Fetch album tracks
const { data: tracks, isLoading: tracksLoading } = useQuery({
  queryKey: ['album-tracks', props.id],
  queryFn: () => musicApi.getTracksByAlbumId(props.id),
  enabled: computed(() => !!props.id),
  staleTime: 1000 * 60 * 10,
})

const goBack = () => {
  router.back()
}

const goToArtist = (artistId: string) => {
  router.push(`/artist/${artistId}`)
}

const getImageWithFallback = (imageUrl: string | undefined, fallback: string = '/placeholder-album.jpg') => {
  return imageUrl || fallback
}

const formatDuration = (duration: string | undefined) => {
  if (!duration) return ''
  const seconds = parseInt(duration) / 1000
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatDescription = (description: string | undefined) => {
  if (!description) return ''
  return description.split('\n').filter(p => p.trim()).slice(0, 4).join('\n\n')
}

const totalTracks = computed(() => tracks?.value?.length || 0)
const totalDuration = computed(() => {
  if (!tracks?.value?.length) return ''
  const total = tracks.value.reduce((sum: number, track: any) => {
    const duration = track.intDuration ? parseInt(track.intDuration) / 1000 : 0
    return sum + duration
  }, 0)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
})
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
      Back
    </Button>

    <!-- Album Loading State -->
    <div v-if="albumLoading" class="space-y-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <Skeleton class="w-full lg:w-80 h-80 rounded-lg" />
        <div class="flex-1 space-y-4">
          <Skeleton class="h-8 w-1/2" />
          <Skeleton class="h-6 w-1/3" />
          <Skeleton class="h-4 w-1/4" />
          <Skeleton class="h-20 w-full" />
        </div>
      </div>
    </div>

    <!-- Album Details -->
    <div v-else-if="album" class="space-y-8">
      <!-- Hero Section -->
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Album Cover -->
        <div class="lg:w-80">
          <img
            :src="getImageWithFallback(album.strAlbumThumb || album.strAlbumCDart)"
            :alt="album.strAlbum"
            class="w-full h-80 object-cover rounded-lg shadow-lg"
          />
        </div>

        <!-- Album Info -->
        <div class="flex-1 space-y-6">
          <div>
            <h1 class="text-4xl font-bold mb-2">{{ album.strAlbum }}</h1>
            <button 
              @click="goToArtist(album.idArtist)"
              class="text-xl text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              {{ album.strArtist }}
            </button>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <Badge v-if="album.strGenre" variant="secondary">{{ album.strGenre }}</Badge>
              <Badge v-if="album.strLabel" variant="outline">{{ album.strLabel }}</Badge>
              <Badge v-if="album.strReleaseFormat" variant="outline">{{ album.strReleaseFormat }}</Badge>
            </div>
          </div>

          <!-- Album Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div v-if="album.intYearReleased" class="flex items-center gap-2">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <span>{{ album.intYearReleased }}</span>
            </div>
            
            <div v-if="totalTracks" class="flex items-center gap-2">
              <Hash class="h-4 w-4 text-muted-foreground" />
              <span>{{ totalTracks }} track{{ totalTracks !== 1 ? 's' : '' }}</span>
            </div>

            <div v-if="totalDuration" class="flex items-center gap-2">
              <Clock class="h-4 w-4 text-muted-foreground" />
              <span>{{ totalDuration }}</span>
            </div>

            <div v-if="album.intSales" class="flex items-center gap-2">
              <Music class="h-4 w-4 text-muted-foreground" />
              <span>{{ parseInt(album.intSales).toLocaleString() }} sales</span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="album.strDescriptionEN" class="space-y-2">
            <h3 class="text-lg font-semibold">About This Album</h3>
            <p class="text-muted-foreground leading-relaxed">
              {{ formatDescription(album.strDescriptionEN) }}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <!-- Track Listing -->
      <div class="space-y-6">
        <h2 class="text-2xl font-bold flex items-center gap-2">
          <Play class="h-6 w-6" />
          Track Listing
        </h2>

        <div v-if="tracksLoading" class="space-y-2">
          <Card v-for="n in 12" :key="n" class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4 flex-1">
                <Skeleton class="h-4 w-8" />
                <Skeleton class="h-4 w-1/2" />
              </div>
              <Skeleton class="h-4 w-12" />
            </div>
          </Card>
        </div>

        <div v-else-if="tracks?.length" class="space-y-1">
          <Card 
            v-for="(track, index) in tracks" 
            :key="track.idTrack"
            class="hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <CardContent class="p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 flex-1 min-w-0">
                  <!-- Track Number -->
                  <div class="text-sm text-muted-foreground w-8 flex-shrink-0">
                    {{ track.intTrackNumber || (index + 1) }}
                  </div>
                  
                  <!-- Track Info -->
                  <div class="min-w-0 flex-1">
                    <h4 class="font-medium truncate">{{ track.strTrack }}</h4>
                    <div class="text-sm text-muted-foreground flex items-center gap-2">
                      <User class="h-3 w-3" />
                      <span>{{ track.strArtist }}</span>
                      <span v-if="track.strGenre">• {{ track.strGenre }}</span>
                    </div>
                  </div>
                </div>

                <!-- Duration -->
                <div v-if="track.intDuration" class="text-sm text-muted-foreground flex-shrink-0 ml-4">
                  {{ formatDuration(track.intDuration) }}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div v-else class="text-center py-8 text-muted-foreground">
          <Music class="mx-auto h-12 w-12 mb-4" />
          <p>No tracks found for this album.</p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <div class="text-destructive text-lg mb-4">
        Album not found or failed to load.
      </div>
      <Button @click="goBack" variant="outline">
        <ArrowLeft class="mr-2 h-4 w-4" />
        Go Back
      </Button>
    </div>
  </div>
</template>