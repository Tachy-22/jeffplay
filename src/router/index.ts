import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/artists',
    name: 'Artists',
    component: () => import(/* webpackChunkName: "artists" */ '../views/Artists.vue')
  },
  {
    path: '/artist/:id',
    name: 'ArtistDetail',
    component: () => import(/* webpackChunkName: "artist-detail" */ '../views/ArtistDetail.vue'),
    props: true
  },
  {
    path: '/albums',
    name: 'Albums', 
    component: () => import(/* webpackChunkName: "albums" */ '../views/Albums.vue')
  },
  {
    path: '/album/:id',
    name: 'AlbumDetail',
    component: () => import(/* webpackChunkName: "album-detail" */ '../views/AlbumDetail.vue'),
    props: true
  },
  {
    path: '/charts',
    name: 'Charts',
    component: () => import(/* webpackChunkName: "charts" */ '../views/Charts.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router