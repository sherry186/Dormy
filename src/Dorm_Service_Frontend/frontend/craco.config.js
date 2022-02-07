const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
              "@primary-color": "#138796",
              "@error-color": "#F17FB2",
              "@body-background": "#F6F6F6",
              "@menu-bg": "#CCDCD7",
              "@table-bg": "@body-background",
              "@table-header-bg": "#E2E2E2",
              "@btn-default-color": "@primary-color",
              // "@btn-default-bg": transparent,
              "@btn-default-border": "@btn-default-color",
              "@btn-font-weight": 600,
              // "@disabled-color": "#138796",
              
              // "@table-header-color": "#E2E2E2"rgba(0,0,0,0.5);
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
