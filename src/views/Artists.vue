<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { musicApi } from '../api/music'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { Search, Music, Globe, Calendar, MapPin } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const debouncedQuery = ref('')

// Debounce search input
let debounceTimer: NodeJS.Timeout
const updateQuery = (value: string) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = value
  }, 500)
}


// Query for artists
const { data: artists, isLoading, error, refetch } = useQuery({
  queryKey: ['artists', debouncedQuery],
  queryFn: () => debouncedQuery.value ? musicApi.searchArtists(debouncedQuery.value) : Promise.resolve([]),
  enabled: computed(() => debouncedQuery.value.length > 2),
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 10, // 10 minutes
})

const navigateToArtist = (artistId: string) => {
  router.push(`/artist/${artistId}`)
}

const getImageWithFallback = (artist: any) => {
  return artist.strArtistThumb || artist.strArtistLogo || artist.strArtistBanner || '/placeholder-artist.jpg'
}

const formatYear = (year: string | undefined) => {
  if (!year) return 'Unknown'
  return year.includes('-') ? year : `${year}`
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">Discover Artists</h1>
      <p class="text-lg text-muted-foreground mb-8">
        Explore your favorite artists and discover new music from around the world
      </p>
      
      <!-- Search Bar -->
      <div class="max-w-md mx-auto relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for artists..."
          v-model="searchQuery"
          @input="updateQuery(searchQuery)"
          class="pl-10 text-center"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="n" class="space-y-3">
        <Skeleton class="h-48 w-full rounded-lg" />
        <Skeleton class="h-4 w-3/4" />
        <Skeleton class="h-3 w-1/2" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-destructive text-lg mb-4">
        Failed to load artists. Please try again.
      </div>
      <Button @click="refetch" variant="outline">
        <Music class="mr-2 h-4 w-4" />
        Retry
      </Button>
    </div>

    <!-- Empty Search State -->
    <div v-else-if="debouncedQuery && artists?.length === 0" class="text-center py-12">
      <Music class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 class="text-lg font-semibold mb-2">No artists found</h3>
      <p class="text-muted-foreground">Try searching for a different artist name</p>
    </div>

    <!-- Initial State -->
    <div v-else-if="!debouncedQuery" class="text-center py-12">
      <Search class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 class="text-lg font-semibold mb-2">Start Your Musical Journey</h3>
      <p class="text-muted-foreground">Search for your favorite artists to explore their music, albums, and more</p>
    </div>

    <!-- Artists Grid -->
    <div v-else-if="artists?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <Card 
        v-for="artist in artists" 
        :key="artist.idArtist"
        class="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        @click="navigateToArtist(artist.idArtist)"
      >
        <div class="aspect-square overflow-hidden rounded-t-lg">
          <img 
            :src="getImageWithFallback(artist)"
            :alt="artist.strArtist"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        </div>
        
        <CardHeader class="pb-2">
          <CardTitle class="text-lg line-clamp-1">
            {{ artist.strArtist }}
          </CardTitle>
          <CardDescription class="flex items-center gap-2">
            <Badge v-if="artist.strGenre" variant="secondary" class="text-xs">
              {{ artist.strGenre }}
            </Badge>
          </CardDescription>
        </CardHeader>

        <CardContent class="pt-0">
          <div class="space-y-2 text-sm text-muted-foreground">
            <div v-if="artist.strCountry" class="flex items-center gap-2">
              <MapPin class="h-3 w-3" />
              <span>{{ artist.strCountry }}</span>
            </div>
            
            <div v-if="artist.strFormed" class="flex items-center gap-2">
              <Calendar class="h-3 w-3" />
              <span>{{ formatYear(artist.strFormed) }}</span>
            </div>

            <div v-if="artist.strWebsite" class="flex items-center gap-2">
              <Globe class="h-3 w-3" />
              <span class="truncate">Website</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>