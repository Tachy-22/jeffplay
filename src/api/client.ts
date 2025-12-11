import axios from 'axios'

const BASE_URL = 'https://www.theaudiodb.com/api/v1/json/2'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

export interface Artist {
  idArtist: string
  strArtist: string
  strArtistThumb?: string
  strArtistLogo?: string
  strArtistBanner?: string
  strBiographyEN?: string
  strGenre?: string
  strWebsite?: string
  strFacebook?: string
  strTwitter?: string
  strLastFMChart?: string
  strCountry?: string
  strDisbanded?: string
  strFormed?: string
  intFormedYear?: string
  intDiedYear?: string
  strStyle?: string
  strMood?: string
}

export interface Album {
  idAlbum: string
  idArtist: string
  strAlbum: string
  strArtist: string
  intYearReleased?: string
  strAlbumThumb?: string
  strAlbumCDart?: string
  strAlbumSpine?: string
  strDescriptionEN?: string
  strGenre?: string
  strLabel?: string
  strReleaseFormat?: string
  intSales?: string
  strAlbumStripped?: string
  strAlbum3DCase?: string
  strAlbum3DFlat?: string
  strAlbum3DFace?: string
  strAlbum3DThumb?: string
}

export interface Track {
  idTrack: string
  idAlbum: string
  idArtist: string
  strTrack: string
  strAlbum: string
  strArtist: string
  intTrackNumber?: string
  strTrackThumb?: string
  strMusicVid?: string
  intDuration?: string
  strDescriptionEN?: string
  strGenre?: string
}

export interface MusicVideo {
  idTrack: string
  idAlbum: string
  idArtist: string
  strTrack: string
  strMusicVid: string
  strTrackThumb?: string
  intTrackNumber?: string
  strGenre?: string
  intDuration?: string
}