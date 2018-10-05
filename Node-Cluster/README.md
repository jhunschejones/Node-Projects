# Cluster-Node

Cluster is a core Node module that allows the user to run multiple instances of an application simultaneously. This is a clever tool for making use of multi-core servers given the limitation that Node.js runs in a single thread. This is a very basic example of how to use Cluster, but spinning up the application will show one worker running for every available CPU on the host. Pretty cool! Feeling in a dark mood? Uncomment the last line in app.js to kill off workers and see the master process create more!
