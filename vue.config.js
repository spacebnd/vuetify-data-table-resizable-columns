module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production' || 'demo'
      ? '/vuetify-data-table-resizable-columns/'
      : '/',
  transpileDependencies: ['vuetify'],
}
