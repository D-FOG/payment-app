/** @type {import('next').NextConfig} */
module.exports = {
    webpack: (config, { isServer }) => {
      // Add file-loader rule for binary files
      config.module.rules.push({
        test: /\.(woff|woff2|eot|ttf|otf|png|jpg|gif|ico|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/_next',
              name: 'static/media/[name].[hash].[ext]',
            },
          },
        ],
      });
  
      // Other webpack configurations...
  
      return config;
    },
  };