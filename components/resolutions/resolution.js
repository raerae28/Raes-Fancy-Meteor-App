if (Meteor.isClient) {

Template.resolution.helpers ({
    isOwner: function() {
      return this.owner === Meteor.userId();
    }
  })
  Template.resolution.events ({
    'click .toggle-checked' : function() {
      Meteor.call("updateResolution", this._id, !this.checked);
    },
    'click .delete' : function() { //reference the resolution template, and the click event of the button
    Meteor.call("deleteResolution" ,this._id); //reference THIS particular items id In MongoDB
    },
        'click .toggle-private' : function() {
      Meteor.call("setPrivate", this._id, !this.private);
    },

  });

}