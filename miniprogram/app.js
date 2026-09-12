const store = require('./utils/store')

App({
  onLaunch() {
    store.ensureSeed()
  },
  globalData: {
    colors: {
      bg: '#F7F3EA',
      primary: '#7BAF9E',
      accent: '#E7B8B0',
      text: '#2F3A36',
    },
  },
})
