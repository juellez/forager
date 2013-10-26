FORAGER
=======

Inspired by UrbanEdibles.org - the next course

### Resources & Research
A quick roundup of related datasets, communities, resources, etc.

DATA & MAPS
* [UrbanEdibles](http://www.urbanedibles.org/) - [source code](https://bitbucket.org/soycamo/urban-edibles)
* [Urban Forest Map, San Fran](http://urbanforestmap.org/)
* [ProjectNoah](http://www.projectnoah.org/)
* [Arkive](http://www.arkive.org/)
* [FallingFruit](http://www.fallingfruit.org/)

AWARENESS
* [Urban Forest Project](http://www.ufp-global.com/)
* [Million Trees, NYC](http://www.milliontreesnyc.org/html/urban_forest/urban_forest.shtml)

GROUPS & CLASSES
* [Oregon Mycological Society](http://wildmushrooms.org)
* [Muschoom Hunting](http://www.meetup.com/Columbia-River-mushroom-hunters/)
* [First Ways](http://www.yelp.com/biz/first-ways-urban-foraging-classes-portland) 
* [Wild Food Adventures](http://wildfoodadventures.com)
* [Trackers Northwest](http://trackersnw.com)
* [Nature Connection](http://www.meetup.com/Nature-Connection/)

GET AN APP
* “Foraging for Edible and Medicinal Wild Plants” — interactive app from “Wildman” Steve Brill due out this month (wildmanstevebrill.com)
* [ProjectNoah](http://www.projectnoah.org/)
    
PRESS & MORE RESOURCES
* http://www.oregonlive.com/mix/index.ssf/how-to/field-guide-to-foraging-in-the-northwest.html
* http://edibleportland.com/2012/03/wild-food-foraging-resources/

### Running Forager
This section will need some love as I have many scattered notes. It's currently a Meteor app that runs swell locally but has never deployed successfully to Meteor. In addition to the required NPM packages listed in packages.json, there are 2 meteorite packages required as listed in smart.json: filpicker & geoimager. To work locally, packages directory should look like:

packages
\- filepicker
\- geoimager
\- node_modules
  \- gm
  \- request
\- npm

### Todos
It's a long list. In no particular order, the basics:
* Convert a geo-tagged image into an editable edible record, complete with name and additional information (attach it).
* Default map to "my" location. Filter by season, category, etc.
* Stretch: Export/share with FallingFruit. (Chat w/those folks to see if they're interested.)

### License
GNU GPL - see http://opensource.org/licenses/GPL-3.0 for full license details.
