// Forager -- server
// var geoimager = Meteor.require("geoimager");

Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish("edibles", function () {
  // newEdibleFromLocation();
  // geoimager = new Geoimager();
  // var stuff = geoimager.getGeoExif("https://www.filepicker.io/api/file/g2fRJbUSTi7pV6hbYofg");

  return Edibles.find(
    {$or: [{"public": true}, {invited: this.userId}, {owner: this.userId}]});
});

