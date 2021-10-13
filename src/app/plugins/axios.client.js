
export default function ({ $axios, $config }) {
  if (process.client) {
    const protocol = window.location.protocol
    const host = window.location.hostname
    $axios.setBaseURL(protocol + '//' + host + $config.base_dir)
  }
}
