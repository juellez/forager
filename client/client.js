// Forager -- client
Meteor.subscribe("directory");
Meteor.subscribe("edibles");

// If no edible selected, or if the selected edible was deleted, select one.
Meteor.startup(function () {

  Deps.autorun(function () {
    var selected = Session.get("selected");

    // var countposts = Posts.find().count();
    var countedibles = Edibles.find().count();

    console.log('client session.get(selected): '+selected+' edibles: '+countedibles);

    if (! selected || ! Edibles.findOne(selected)) {
    // if (! selected || ! Edibles.findOne(selected)) {


// // Print the titles of the five top-scoring posts
// var topEdibles = Edibles.find({}, {sort: {score: -1}, limit: 5});
// var count = 0;
// topEdibles.forEach(function (post) {
//   console.log("Title of edible " + count + ": " + edible.title);
//   count += 1;
// });

      // var edible = Edibles.findOne();
      // if (edible){
      //   Session.set("selected", edible._id);
      //   console.log('selected: '+edible._id);
      // }
      // else{
      //   Session.set("selected", null);
      //   console.log('selected: null');
      // }

    }
  });
});


///////////////////////////////////////////////////////////////////////////////
// Edibles details sidebar

Template.details.edible = function () {
  return Edibles.findOne(Session.get("selected"));
};

Template.details.anyEdibles = function () {
  return Edibles.find().count() > 0;
};

Template.details.creatorName = function () {
  var owner = Meteor.users.findOne(this.owner);
  if (owner._id === Meteor.userId())
    return "me";
  return displayName(owner);
};

Template.details.canRemove = function () {
  return this.owner === Meteor.userId();
};

Template.details.events({
  'click .remove': function () {
    Edibles.remove(this._id);
    return false;
  }
});

///////////////////////////////////////////////////////////////////////////////
// Map2 display

// Use jquery to get the position clicked relative to the map element.
var coordsRelativeToElement = function (element, edible) {
  var offset = $(element).offset();
  var x = edible.pageX - offset.left;
  var y = edible.pageY - offset.top;
  return { x: x, y: y };
};

Template.map.events({
  'mousedown circle, mousedown text': function (edible, template) {
    Session.set("selected", edible.currentTarget.id);
  },
  'dblclick .map': function (edible, template) {
    if (! Meteor.userId()) // must be logged in to create edibles
      return;
    var coords = coordsRelativeToElement(edible.currentTarget, edible);
    openCreateDialog(coords.x / 500, coords.y / 500);
  }
});

Template.map.rendered = function () {
  var self = this;
  self.node = self.find("svg");

  if (! self.handle) {
    self.handle = Deps.autorun(function () {
      var selected = Session.get('selected');
      var selectedEdible = selected && Edibles.findOne(selected);
      var radius = function (edible) {
        return 10 + .001 * 10;
      };

      // Draw a circle for each edible
      var updateCircles = function (group) {
        group.attr("id", function (edible) { return edible._id; })
        .attr("cx", function (edible) { return edible.x * 500; })
        .attr("cy", function (edible) { return edible.y * 500; })
        .attr("r", radius)
        .attr("class", function (edible) {
          return "private";
        })
        .style('opacity', function (edible) {
          return selected === edible._id ? 1 : 0.6;
        });
      };

      var circles = d3.select(self.node).select(".circles").selectAll("circle")
        .data(Edibles.find().fetch(), function (edible) { return edible._id; });

      updateCircles(circles.enter().append("circle"));
      updateCircles(circles.transition().duration(250).ease("cubic-out"));
      circles.exit().transition().duration(250).attr("r", 0).remove();

      // Label each with the current attendance count
      var updateLabels = function (group) {
        // console.log('updating labels');
        group.attr("id", function (edible) { return edible._id; })
        .text(function (edible) {return '';})
        .attr("x", function (edible) { return edible.x * 500; })
        .attr("y", function (edible) { return edible.y * 500 + radius(edible)/2 })
        .style('font-size', function (edible) {
          return radius(edible) * 4 + "px";
        });
      };

      var labels = d3.select(self.node).select(".labels").selectAll("text")
        .data(Edibles.find().fetch(), function (edible) { return edible._id; });

      updateLabels(labels.enter().append("text"));
      updateLabels(labels.transition().duration(250).ease("cubic-out"));
      labels.exit().remove();

      // Draw a dashed circle around the currently selected edible, if any
      var callout = d3.select(self.node).select("circle.callout")
        .transition().duration(250).ease("cubic-out");
      if (selectedEdible)
        callout.attr("cx", selectedEdible.x * 500)
        .attr("cy", selectedEdible.y * 500)
        .attr("r", radius(selectedEdible) + 10)
        .attr("class", "callout")
        .attr("display", '');
      else
        callout.attr("display", 'none');
    });
  }
};

Template.map.destroyed = function () {
  this.handle && this.handle.stop();
};

///////////////////////////////////////////////////////////////////////////////
// Create Edible dialog

var openCreateDialog = function (x, y) {
  Session.set("createCoords", {x: x, y: y});
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};

Template.page.showCreateDialog = function () {
  return Session.get("showCreateDialog");
};

Template.createDialog.events({
  'click .save': function (edible, template) {
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var coords = Session.get("createCoords");

    if (title.length && description.length) {
      Meteor.call('createEdible', {
        title: title,
        description: description,
        x: coords.x,
        y: coords.y
      }, function (error, edible) {
        if (! error) {
          Session.set("selected", edible);
        }
      });
      Session.set("showCreateDialog", false);
    } else {
      Session.set("createError",
                  "It needs a title and a description, or why bother?");
    }
  },

  'click .cancel': function () {
    Session.set("showCreateDialog", false);
  }
});

Template.createDialog.error = function () {
  return Session.get("createError");
};
