const { generateThemeColors } = require('reshaped/themes');

const config = {
  themes: {
    orangeTheme: {
      fontFamily: {
        title: {
          family:
            '"Songti SC", "STSong", "Noto Serif SC", serif'
        },
        body: {
          family:
            '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif'
        }
      },
      color: {
        ...generateThemeColors({
          primary: '#c24a18',
          critical: '#b42318',
          positive: '#8a6a3d',
          neutral: '#dbd8d5'
        }),
        backgroundPage: { hex: '#f3efe8' },
        backgroundPageFaded: { hex: '#faf7f2' }
      },
      unit: {
        radiusSmall: {
          px: 5
        }
      },
      shadow: {
        raised: [
          {
            offsetX: 0,
            offsetY: 10,
            blurRadius: 24,
            colorToken: 'black',
            opacity: 0.08
          }
        ],
        overlay: [
          {
            offsetX: 0,
            offsetY: 14,
            blurRadius: 34,
            colorToken: 'black',
            opacity: 0.12
          }
        ]
      }
    }
  }
};

module.exports = config;
