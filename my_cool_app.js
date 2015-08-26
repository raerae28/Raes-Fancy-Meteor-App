Resolutions = new Mongo.Collection ('resolutions');

if (Meteor.isClient) {

  Meteor.subscribe("resolutions");

  Template.body.helpers ({
      resolutions: function() {
        if(Session.get('hideFinished')) {
          return Resolutions.find({checked: {$ne: true}});
        } else {
        
        return Resolutions.find ();
      }
    },
      hideFinished: function() {
        return Session.get('hideFinished');
      }
  });

  Template.body.events ({
    'submit .new-resolution': function(event) {
      var title = event.target.title.value;  //pull value of form data being captured on event.
      
      Meteor.call("addResolution", title); //call method thru Meteor.methods

      event.target.title.value = ""; //remove value from field after inserted

      return false;
    },

    'change .hide-finished' : function(event) {  //when you click the checkbox, the session variable will be changed and this session variable will be set.
        Session.set('hideFinished', event.target.checked);
    }
  });

  
//Accounts UI Config
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

//METEOR Server
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("resolutions", function() {
    return Resolutions.find ({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId}
      ]
    });
  });
}

//METHODS
Meteor.methods({
  addResolution: function(title) {
      Resolutions.insert({   //create new record for database.
        title : title,
        createdAt: new Date(),
        owner: Meteor.userId()
      });

  },
  updateResolution: function(id, checked) {
    var res = Resolutions.findOne(id); 

    if (res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Resolutions.update(id, {$set: {checked: checked}});

  },
   setPrivate: function(id, private) {
    var res = Resolutions.findOne(id); 

    if (res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Resolutions.update(id, {$set: {private: private}});
  },
  deleteResolution: function(id) {
    var res = Resolutions.findOne(id);

        if (res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Resolutions.remove(id); //reference THIS particular items id In MongoDB
  }
})
