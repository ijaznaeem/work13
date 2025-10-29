this is web application for pharma production factory named "MedHouse Pharmaceutical" based on 16km off Sargodha Road, Gujrat. this is to redign and upgrade of vb6 application already running and working. the main puprose of conevsion to developa a scaleable application with modern technologies. 
important folders in workspace
1. Source-SQL vb6 source files
2. src - angular project files
3. apis - php backend apis files
4. olddatase - sql file for explanation of old database


this is some work already have been done on angular application. the application divided into difirrent departments/modules and users access is define  roles are defined to that modules. 
navigation system is defined in  navigation-routes.config.ts menu will be used horizentally. on login user access routes are load via menusystem apis and  menu is filtered accordingly and gaurd are set

the back apis founder is G:\Work-Angular\version-13\apps\Medhouse\Apis
rest apis are hosted in iis with php 7.3
url is http://localhost/mehouse

project is confugured proxy for CORS 
{
  "/apis/*": {
    "target": "http://localhost/medhouse/",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/apis": ""
    },
    "changeOrigin": true
  }
}

the project nx environment 
run script is 'npm run medhouse'


