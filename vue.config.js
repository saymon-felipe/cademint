module.exports = {
    configureWebpack: {
      output: {
        hashFunction: 'sha256'
      },
    },
    chainWebpack: config => {
      config.plugin('define').tap(definitions => {
        definitions[0]['process.env']['NODE_DEBUG'] = JSON.stringify(process.env.NODE_DEBUG);
        return definitions;
      });
    }
  };
  