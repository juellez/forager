// Forager -- data model
// Loaded on both the client and the server


///////////////////////////////////////////////////////////////////////////////
// Edibles
/*
  Each edible is represented by a document in the Edibles collection:
    owner: user id
    x, y: Number (screen coordinates in the interval [0, 1])
    title, description: String
*/

Edibles = new Meteor.Collection("edibles");

Edibles.allow({
  insert: function (userId, edible) {
    return false; // no cowboy inserts -- use createEdible method
  },
  update: function (userId, edible, fields, modifier) {
    if (userId !== edible.owner)
      return false; // not the owner

    var allowed = ["title", "description", "x", "y"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    // A good improvement would be to validate the type of the new
    // value of the field (and if a string, the length.) In the
    // future Meteor will have a schema system to makes that easier.
    return true;
  },
  remove: function (userId, edible) {
    // You can only remove parties that you created and nobody is going to.
    return edible.owner === userId;
  }
});

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

var Coordinate = Match.Where(function (x) {
  check(x, Number);
  return x >= 0 && x <= 1;
});

createEdible = function (options) {
  // var id = Random.id();
  // Meteor.call('createEdible', _.extend({ _id: id }, options));
  // return id;
  return Meteor.call('createEdible',options);
};

Meteor.methods({
  // options should include: title, description, x, y
  createEdible: function (options) {
    check(options, {
      title: NonEmptyString,
      description: NonEmptyString,
      x: Coordinate,
      y: Coordinate,
      //_id: Match.Optional(NonEmptyString)
    });

    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    console.log('inside create. user: '+this.userId);
    console.log(options);

    // Changes are visible immediately -- no waiting for a round trip to
    // the server.
    console.log( 'inside create. count: '+Edibles.find().count() );

    return Edibles.insert({
      //_id: id,
      owner: this.userId,
      x: options.x,
      y: options.y,
      title: options.title,
      description: options.description
    });

  }

});

///////////////////////////////////////////////////////////////////////////////
// Users

displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
};

var contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};
