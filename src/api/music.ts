import { apiClient, type Artist, type Album, type Track, type MusicVideo } from './client'

export const musicApi = {
  // Search functions
  async searchArtists(query: string): Promise<Artist[]> {
    const response = await apiClient.get(`/search.php?s=${encodeURIComponent(query)}`)
//    console.log('API Response:', response.data)
    return response.data.artists || []
  },

  async searchAlbums(artistName: string, albumName?: string): Promise<Album[]> {
    const url = albumName 
      ? `/searchalbum.php?s=${encodeURIComponent(artistName)}&a=${encodeURIComponent(albumName)}`
      : `/searchalbum.php?s=${encodeURIComponent(artistName)}`
    const response = await apiClient.get(url)
    return response.data.album || []
  },

  async searchTracks(artistName: string, trackName: string): Promise<Track[]> {
    const response = await apiClient.get(
      `/searchtrack.php?s=${encodeURIComponent(artistName)}&t=${encodeURIComponent(trackName)}`
    )
    return response.data.track || []
  },

  // Lookup functions
  async getArtistById(id: string): Promise<Artist | null> {
    const response = await apiClient.get(`/artist.php?i=${id}`)
    return response.data.artists?.[0] || null
  },

  async getAlbumsByArtistId(artistId: string): Promise<Album[]> {
    const response = await apiClient.get(`/album.php?i=${artistId}`)
    return response.data.album || []
  },

  async getAlbumById(albumId: string): Promise<Album | null> {
    const response = await apiClient.get(`/album.php?m=${albumId}`)
    return response.data.album?.[0] || null
  },

  async getTracksByAlbumId(albumId: string): Promise<Track[]> {
    const response = await apiClient.get(`/track.php?m=${albumId}`)
    return response.data.track || []
  },

  async getTrackById(trackId: string): Promise<Track | null> {
    const response = await apiClient.get(`/track.php?h=${trackId}`)
    return response.data.track?.[0] || null
  },

  // Music videos and charts
  async getMusicVideosByArtistId(artistId: string): Promise<MusicVideo[]> {
    const response = await apiClient.get(`/mvid.php?i=${artistId}`)
    return response.data.mvids || []
  },

  async getTop10Tracks(artistName: string): Promise<Track[]> {
    const response = await apiClient.get(`/track-top10.php?s=${encodeURIComponent(artistName)}`)
    return response.data.track || []
  },

  // Trending (Note: This endpoint may require different handling)
  async getTrendingMusic(country: string = 'us', type: string = 'itunes'): Promise<any[]> {
    try {
      const response = await apiClient.get(`/trending.php?country=${country}&type=${type}&format=albums`)
      return response.data.trending || []
    } catch (error) {
      // Fallback: return some popular artists instead
      console.warn('Trending endpoint not available, falling back to search')
      return []
    }
  }
}