<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, } from '@tanstack/vue-query'
import { musicApi } from '../api/music'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Search, Disc3, Calendar, Filter } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const selectedArtist = ref('')
const debouncedQuery = ref('')

// Popular artists for filtering
const popularArtists = [
  'Coldplay', 'The Beatles', 'Queen', 'Led Zeppelin', 'Pink Floyd', 
  'Radiohead', 'Metallica', 'AC/DC', 'Nirvana', 'Red Hot Chili Peppers'
]

// Debounce search input
let debounceTimer: NodeJS.Timeout
const updateQuery = (value: string) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = value
  }, 500)
}


const handleArtistFilter = (artist: string) => {
  selectedArtist.value = artist
  searchQuery.value = artist
  debouncedQuery.value = artist
}

// Query for albums based on artist search
const { data: albums, isLoading, error, refetch } = useQuery({
  queryKey: ['albums', debouncedQuery],
  queryFn: () => debouncedQuery.value ? musicApi.searchAlbums(debouncedQuery.value) : Promise.resolve([]),
  enabled: computed(() => debouncedQuery.value.length > 2),
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 10,
})

const navigateToAlbum = (albumId: string) => {
  router.push(`/album/${albumId}`)
}

const navigateToArtist = (artistId: string) => {
  router.push(`/artist/${artistId}`)
}

const getImageWithFallback = (album: any) => {
  return album.strAlbumThumb || album.strAlbumCDart || album.strAlbumSpine || '/placeholder-album.jpg'
}

const formatYear = (year: string | undefined) => {
  return year || 'Unknown Year'
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedArtist.value = ''
  debouncedQuery.value = ''
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">Explore Albums</h1>
      <p class="text-lg text-muted-foreground mb-8">
        Discover albums from your favorite artists and explore new musical journeys
      </p>
    </div>

    <!-- Search and Filter Controls -->
    <div class="space-y-4 mb-8">
      <!-- Search Bar -->
      <div class="max-w-md mx-auto relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by artist name..."
          v-model="searchQuery"
          @input="updateQuery(searchQuery)"
          class="pl-10"
        />
      </div>

      <!-- Artist Filter -->
      <div class="flex flex-wrap justify-center gap-4">
        <div class="flex items-center gap-2">
          <Filter class="h-4 w-4 text-muted-foreground" />
          <span class="text-sm font-medium">Popular Artists:</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="artist in popularArtists"
            :key="artist"
            variant="outline"
            size="sm"
            @click="handleArtistFilter(artist)"
            :class="{ 'bg-primary text-primary-foreground': selectedArtist === artist }"
          >
            {{ artist }}
          </Button>
        </div>
        <Button
          v-if="selectedArtist || debouncedQuery"
          variant="ghost"
          size="sm"
          @click="clearFilters"
          class="text-muted-foreground"
        >
          Clear
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <Card v-for="n in 12" :key="n" class="space-y-3">
        <Skeleton class="h-64 w-full rounded-t-lg" />
        <div class="p-4 space-y-2">
          <Skeleton class="h-4 w-3/4" />
          <Skeleton class="h-3 w-1/2" />
          <Skeleton class="h-3 w-1/3" />
        </div>
      </Card>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-destructive text-lg mb-4">
        Failed to load albums. Please try again.
      </div>
      <Button @click="refetch" variant="outline">
        <Disc3 class="mr-2 h-4 w-4" />
        Retry
      </Button>
    </div>

    <!-- Empty Search State -->
    <div v-else-if="debouncedQuery && albums?.length === 0" class="text-center py-12">
      <Disc3 class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 class="text-lg font-semibold mb-2">No albums found</h3>
      <p class="text-muted-foreground">Try searching for a different artist or check the spelling</p>
    </div>

    <!-- Initial State -->
    <div v-else-if="!debouncedQuery" class="text-center py-12">
      <Search class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 class="text-lg font-semibold mb-2">Start Exploring Albums</h3>
      <p class="text-muted-foreground mb-6">
        Search for artists to discover their albums or try one of the popular artists above
      </p>
      
      <!-- Featured Artists Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
        <Button
          v-for="artist in popularArtists.slice(0, 10)"
          :key="artist"
          variant="outline"
          @click="handleArtistFilter(artist)"
          class="h-16 text-center"
        >
          {{ artist }}
        </Button>
      </div>
    </div>

    <!-- Albums Grid -->
    <div v-else-if="albums?.length" class="space-y-6">
      <!-- Results header -->
      <div class="flex items-center justify-between">
        <p class="text-muted-foreground">
          Found {{ albums.length }} album{{ albums.length !== 1 ? 's' : '' }}
          {{ selectedArtist ? `by ${selectedArtist}` : '' }}
        </p>
      </div>

      <!-- Albums grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card 
          v-for="album in albums" 
          :key="album.idAlbum"
          class="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          @click="navigateToAlbum(album.idAlbum)"
        >
          <!-- Album Cover -->
          <div class="aspect-square overflow-hidden rounded-t-lg">
            <img 
              :src="getImageWithFallback(album)"
              :alt="album.strAlbum"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          </div>
          
          <!-- Album Info -->
          <CardHeader class="pb-2">
            <CardTitle class="text-lg line-clamp-1">
              {{ album.strAlbum }}
            </CardTitle>
            <CardDescription 
              class="cursor-pointer hover:text-primary transition-colors"
              @click.stop="navigateToArtist(album.idArtist)"
            >
              {{ album.strArtist }}
            </CardDescription>
          </CardHeader>

          <CardContent class="pt-0">
            <div class="space-y-2">
              <!-- Year and Genre -->
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2 text-muted-foreground">
                  <Calendar class="h-3 w-3" />
                  <span>{{ formatYear(album.intYearReleased) }}</span>
                </div>
              </div>

              <!-- Genre and Label -->
              <div class="flex flex-wrap gap-1">
                <Badge v-if="album.strGenre" variant="secondary" class="text-xs">
                  {{ album.strGenre }}
                </Badge>
                <Badge v-if="album.strLabel" variant="outline" class="text-xs">
                  {{ album.strLabel }}
                </Badge>
              </div>

              <!-- Format -->
              <div v-if="album.strReleaseFormat" class="text-xs text-muted-foreground">
                {{ album.strReleaseFormat }}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>