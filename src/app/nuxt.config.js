
let temp_base_dir = ''

switch(process.env.environment) {
  case 'local':
    temp_base_dir = ''
    break;
  case 'development':
  case 'stage':
    temp_base_dir = `/${process.env.service_name}`
    break;
  case 'production':
    temp_base_dir = process.env.use_only == 'external' ? '' : `/${process.env.service_name}`
    break;
}
const BASE_DIR = temp_base_dir

temp_base_dir = null

export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  ssr: true,

  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',

  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: `${BASE_DIR}/favicon.ico` }
    ]
  },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    //'@nuxtjs/eslint-module',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://http.nuxtjs.org
    '@nuxtjs/axios'
  ],

  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    "~/plugins/axios.client.js"
  ],

  /*
  ** Server Middleware
  */
  serverMiddleware: {
    '/api': '~/api'
  },

  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  },

  router: {
    base: BASE_DIR
  },

  axios: {
    baseURL: 'http://localhost:80' + BASE_DIR
  },

  publicRuntimeConfig: {
    environment: process.env.environment,
    service_name: process.env.service_name,
    base_dir: BASE_DIR
  },
  privateRuntimeConfig: {}
}
