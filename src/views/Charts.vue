<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { musicApi } from '../api/music'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { TrendingUp, Music, Search, Trophy, Crown, Star, Hash, Clock } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const debouncedQuery = ref('')

// Featured artists for top tracks
const featuredArtists = [
  'Coldplay', 'The Beatles', 'Queen', 'Ed Sheeran', 'Taylor Swift',
  'Adele', 'Bruno Mars', 'Billie Eilish', 'Post Malone', 'The Weeknd'
]

const selectedArtist = ref(featuredArtists[0])

// Debounce search input
let debounceTimer: NodeJS.Timeout
const updateQuery = (value: string) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = value
    if (value) {
      selectedArtist.value = value
    }
  }, 500)
}

const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  updateQuery(target.value)
}

const selectFeaturedArtist = (artist: string) => {
  selectedArtist.value = artist
  searchQuery.value = artist
  debouncedQuery.value = artist
}

// Query for top tracks
const { data: topTracks, isLoading, error, refetch } = useQuery({
  queryKey: ['top-tracks', selectedArtist],
  queryFn: () => musicApi.getTop10Tracks(selectedArtist.value),
  enabled: computed(() => selectedArtist.value.length > 0),
  staleTime: 1000 * 60 * 10,
  gcTime: 1000 * 60 * 15,
})

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return Crown
    case 2: case 3: return Trophy
    default: return Star
  }
}

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1: return 'text-yellow-500'
    case 2: return 'text-gray-500'
    case 3: return 'text-amber-600'
    default: return 'text-muted-foreground'
  }
}

const formatDuration = (duration: string | undefined) => {
  if (!duration) return ''
  const seconds = parseInt(duration) / 1000
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const navigateToArtist = (artistId: string) => {
  router.push(`/artist/${artistId}`)
}

const navigateToAlbum = (albumId: string) => {
  router.push(`/album/${albumId}`)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <div class="flex items-center justify-center gap-3 mb-4">
        <TrendingUp class="h-8 w-8 text-primary" />
        <h1 class="text-4xl font-bold">Music Charts</h1>
      </div>
      <p class="text-lg text-muted-foreground mb-8">
        Discover the top tracks from popular artists around the world
      </p>
      
      <!-- Search Bar -->
      <div class="max-w-md mx-auto relative mb-8">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for an artist..."
          :value="searchQuery"
          @input="handleSearch"
          class="pl-10"
        />
      </div>
      
      <!-- Featured Artists -->
      <div class="flex flex-wrap justify-center gap-2">
        <Button
          v-for="artist in featuredArtists"
          :key="artist"
          variant="outline"
          size="sm"
          @click="selectFeaturedArtist(artist)"
          :class="{ 'bg-primary text-primary-foreground': selectedArtist === artist }"
        >
          {{ artist }}
        </Button>
      </div>
    </div>

    <!-- Current Artist Header -->
    <div v-if="selectedArtist" class="mb-8">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-2">Top Tracks by {{ selectedArtist }}</h2>
        <Badge variant="secondary" class="mb-4">
          <TrendingUp class="mr-1 h-3 w-3" />
          Chart Rankings
        </Badge>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-3">
      <Card v-for="n in 10" :key="n" class="p-6">
        <div class="flex items-center gap-4">
          <Skeleton class="h-6 w-6 rounded-full" />
          <Skeleton class="h-12 w-12 rounded-lg" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-1/2" />
            <Skeleton class="h-3 w-1/3" />
          </div>
          <Skeleton class="h-4 w-12" />
        </div>
      </Card>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-destructive text-lg mb-4">
        Failed to load top tracks. Please try again.
      </div>
      <Button @click="refetch" variant="outline">
        <TrendingUp class="mr-2 h-4 w-4" />
        Retry
      </Button>
    </div>

    <!-- Empty State -->
    <div v-else-if="topTracks?.length === 0" class="text-center py-12">
      <Music class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 class="text-lg font-semibold mb-2">No chart data available</h3>
      <p class="text-muted-foreground mb-6">
        Charts for {{ selectedArtist }} are not available. Try searching for a different artist.
      </p>
      <div class="flex flex-wrap justify-center gap-2">
        <Button
          v-for="artist in featuredArtists.slice(0, 5)"
          :key="artist"
          variant="outline"
          size="sm"
          @click="selectFeaturedArtist(artist)"
        >
          Try {{ artist }}
        </Button>
      </div>
    </div>

    <!-- Top Tracks Chart -->
    <div v-else-if="topTracks?.length" class="space-y-3">
      <Card 
        v-for="(track, index) in topTracks" 
        :key="track.idTrack"
        class="hover:shadow-md transition-all duration-200 cursor-pointer group"
        @click="navigateToAlbum(track.idAlbum)"
      >
        <CardContent class="p-6">
          <div class="flex items-center gap-4">
            <!-- Rank -->
            <div class="flex items-center justify-center w-8 h-8">
              <component 
                :is="getRankIcon(index + 1)"
                :class="['h-5 w-5', getRankColor(index + 1)]"
              />
            </div>

            <!-- Track Thumbnail -->
            <div class="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                v-if="track.strTrackThumb"
                :src="track.strTrackThumb"
                :alt="track.strTrack"
                class="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
              <Music v-else class="h-6 w-6 text-muted-foreground" />
            </div>

            <!-- Track Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="min-w-0 flex-1">
                  <h4 class="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                    {{ track.strTrack }}
                  </h4>
                  
                  <div class="flex items-center gap-2 text-sm text-muted-foreground">
                    <button 
                      @click.stop="navigateToArtist(track.idArtist)"
                      class="hover:text-primary transition-colors"
                    >
                      {{ track.strArtist }}
                    </button>
                    <span v-if="track.strAlbum">• {{ track.strAlbum }}</span>
                  </div>

                  <!-- Genre Badge -->
                  <div class="mt-2">
                    <Badge v-if="track.strGenre" variant="secondary" class="text-xs">
                      {{ track.strGenre }}
                    </Badge>
                  </div>
                </div>

                <!-- Duration -->
                <div class="flex items-center gap-4 text-sm text-muted-foreground ml-4">
                  <div v-if="track.intDuration" class="flex items-center gap-1">
                    <Clock class="h-3 w-3" />
                    <span>{{ formatDuration(track.intDuration) }}</span>
                  </div>
                  <div class="flex items-center gap-1 font-mono">
                    <Hash class="h-3 w-3" />
                    <span>{{ index + 1 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Chart Footer -->
      <div class="text-center mt-8 pt-6 border-t">
        <p class="text-sm text-muted-foreground">
          Showing top {{ topTracks.length }} tracks by {{ selectedArtist }}
        </p>
        <Button
          variant="outline"
          size="sm"
          @click="navigateToArtist(topTracks[0]?.idArtist)"
          class="mt-2"
          v-if="topTracks[0]?.idArtist"
        >
          View {{ selectedArtist }} Profile
        </Button>
      </div>
    </div>
  </div>
</template>