module.exports = {
  publicPath: getPublicPath(process.env),
  transpileDependencies: ['vuetify'],
}

function getPublicPath(env) {
  if (env.NODE_ENV === 'production') {
    return '/vuetify-data-table-resizable-columns/'
  } else {
    return env.VUE_APP_MODE === 'demo' ? '/vuetify-data-table-resizable-columns/' : '/'
  }
}
