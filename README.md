# PortX

<!-- A port reservation system powered by blockchain -->

An Blockchain-based platform for managing reservations at ports, transparently and efficiently.

## Inspiration

Severe problems are created at ports when drivers can’t move through terminals effectively. The increase in turn times is, in part, due to a high volume of containers passing through the ports, but is exacerbated by inefficiencies at the ports themselves as the ports struggle to find ways to keep up with increasing container volumes. In an effort to increase efficiency and decrease congestion to reduce turn times, ports across the country are working to implement new systems and procedures.

Many independent ports have a 

## What it does

## How I built it
* `portx/` - client side code (website) for the portx project
* `server/` - server side code (ledger recording and querying logic) for portx

## Challenges I ran into

## Accomplishments that I'm proud of

## What I learned

## Building and running the project

<h4>From the `server` folder:</h4>

<h5>Running a single node (from an Intellij build configuration):</h5>
<img src="./img/node_conf.png" width=600>

<h5>Running a cluster (example)</h5>
This project is based on Corda (https://github.com/corda/corda), to run the sample node configuration the following command can be used once the project is setup locally.
<pre>
    ./gradlew deployNodes
</pre>

Refer to <a href="https://docs.corda.net/tutorial-cordapp.html#running-nodes-across-machines">Running  Nodes</a> from the Corda docs for more information.

<h4>From the `client` folder:</h4>
<pre>
    yarn && yarn start
</pre>

The app should now be running on port 8000, with the server responding on port 8001.

## What's next for PortX

## Dev Notes


## Other Resources
* https://github.com/corda/corda
* https://www.fandpnet.com/increased-congestion-at-the-ports-leads-to-problems-for-the-trucking-industry/
* https://blog.goodaudience.com/the-future-of-mobility-fuelled-by-artificial-intelligence-and-distributed-ledger-technology-999b36bc836f
* https://blog.iota.org/iota-foundation-and-high-mobility-to-drive-app-development-for-smart-mobility-bde0596940bc