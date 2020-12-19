// REDUX STORE

// suggestions { 1: {}, 2: {}, 3: {}, 4: {} }
// (Used By: Stepper)
// ACTIONS
// ADD_SUG (When one comes in);

// lockedIn { 1: {}, 2: {}, 3: {}, 4: {} }
// (Used By: Timeline)
// ACTIONS
// ADD_NODE (When user locks one in)
// EDIT_NODE (When user backs up, node num)
// After Submit, lockedIN one(update with new info)
// DELETE_NODE (i.e. Two:{info} => Two: null)*
// *User Prompt: "Warning! Removing this stop entirely will affect your gas refill suggestions"
// Two Options: Keep Gas Stop and remove all others, or remove everything =>
// refill at previous ?"

// FEATURES
// Feature => "Re-Calculate" Button (Good to Go!);
// Deleting a Node (User Prompt);

// Smart Container [Map Container];

// Send all the Data to the front for the re-calculate feature;
// Create Random Function to spit out random 3* indexes from our suggestions;
