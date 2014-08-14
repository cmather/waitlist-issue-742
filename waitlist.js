if (Meteor.isClient) {
  Router.configure({autoStart:false});

  WaitList = Package['iron:router'].WaitList;

  handle = new Blaze.ReactiveVar(false);

  waitlist = new WaitList;

  var runs = 0;

  Deps.autorun(function (c) {
    runs++;
    console.log('runs: ' + runs);

    if (runs >= 10) {
      return;
    }

    // create dependency
    waitlist.ready();

    // change dependency
    // invalidate outer computation
    //  remove item from waitlist
    //  rerun function
    //  add item to waitlist again which changes state again
    waitlist.wait(function () { return handle.get(); });

    // what we want here is to rerun the outer function ONCE. So we chaanged
    // the waitlist state, now let's rerun the function once with the new state.
    // But we want to counter that with adding duplicate records to the waitlist
  });

  // it's already run once
  Deps.flush();
  // during that initial run it will invalidate causing another run

  // at this point we should have 2 runs

  // now change the ready state back to true for the list
  handle.set(true);

  // at flush time we now have 3 runs
  Deps.flush();
}
