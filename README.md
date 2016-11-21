## Universal with Material.
After fixing externals: includeClientPackages to be surrounded by [], and removing angular2-meta references we are able to use Material again.  Remember UniversalModule must be loaded after MaterialModule in imports on node.module and browser.module 
