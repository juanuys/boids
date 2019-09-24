[Boids paper](./research/10.1.1.103.7187.pdf)

# Notes

# Simulated flocks (p28)

Boid model that supports geometric flight.

The behaviors that lead to simulated flocking are:

1. Collision Avoidance: avoid collisions with nearby flockmates (and other obstacles)
2. Velocity Matching: attempt to match velocity with nearby flockmates
3. Flock Centering: attempt to stay close to nearby flockmates

[Wikipedia](https://en.wikipedia.org/wiki/Boids) creates these definitions for the above:

1. separation: steer to avoid crowding local flockmates
2. alignment: steer towards the average heading of local flockmates
3. cohesion: steer to move towards the average position (center of mass) of local flockmates

Extra:
4. obstacle avoidance
5. goal seeking (e.g. "fly North for the winter" or "fly towards a food source")

## Arbitrating Independent Behaviors (p29)

The three behavioral urges associated with flocking (and others to be discussed later) each produce an isolated **acceleration request** - a unit 3D vector - about which way to steer the boid.

Each behavior has several parameters that control its function; one is a "strength," a fractional value between zero and one that can further attenuate the **acceleration request**.

It is up to the **navigation module** of the boid brain to collect all relevant **acceleration requests** and then determine a **single behaviorally desired acceleration** by combining, prioritizing, and arbitrating between potentially conflicting urges.

The **pilot module** takes the acceleration desired by the **navigation module** and passes it to the **flight module**, which attempts to fly in that direction.

### How?

The easiest way to do so is by a **weighted averaging the acceleration requests**, but this has problems on, say, a collision course where acceleration requests cancel each other out.

Another way is **Prioritized acceleration allocation** which is based on a strict **priority ordering** of all component behaviors, hence of the consideration of their acceleration requests.

(This ordering can change to suit dynamic conditions.) The acceleration requests are considered in priority order and added into an accumulator.

The magnitude of each request is measured and added into another accumulator.
This process continues until the sum of the accumulated magnitudes gets larger than the maximum acceleration value, which is a parameter of each boid.
The last acceleration request is trimmed back to compensate for the excess of accumulated magnitude.
The point is that a fixed amount of acceleration is under the control of the navigation module; this acceleration is parceled out to satisfy the acceleration request of the various behaviors in order of priority.
In an emergency the acceleration would be allocated to satisfy the most pressing needs first; if all available acceleration is "'used up," the less pressing behaviors might be temporarily unsatisfied.

For example, the flock centering urge could be correctly ignored temporarily in favor of a maneuver to avoid a static obstacle.

## Simulated Perception (p29)

Real animals' field of vision is obscured by those animals around them (and by things like murky water, kicked-up dust, etc) so there are a *bunch of factors which combine to strongly localise the information available to each animal*.

The FOV neighborhood is defined as a spherical zone of sensitivity centered at the boid's local origin.

The magnitude of the sensitivity is defined as an inverse exponential of distance (using inverse square; gravity-like; less springy/bouncy flocking; more dampened).
Hence the neighborhood is defined by two parameters: a radius and exponent.
There is reason to believe that this field of sensitivity should realistically be exaggerated in the forward direction and probably by an amount proportional to the boid's speed.

Being in motion requires an increased awareness of what lies ahead, and **this requirement increases with speed**.

A forward-weighted sensitivity zone would probably also improve the behavior in the current implementation of boids at the leading edge of a flock, who tend to get distracted by the flock behind them.

## Scripted Flocking (p30)

The primary tool for scripting the flock's path is the **migratory urge** built into the boid model.

* "going Z for the winter"
* a global position--a target point toward which all birds fly.

The model computes a bounded acceleration that incrementally turns the boid toward its migratory target.

With the scripting system, we can animate a **dynamic parameter** whose value is a **global position vector** or a **global direction vector**.
This parameter can be passed to the flock, which can in turn pass it along to all boids, each of which sets its own "migratory goal register."
Hence the global migratory behavior of all birds can be directly controlled from the script.

Of course, it is not necessary to alter all boids at the same time, for example, the delay could be a function of their present position in space.
Real flocks do not change direction simultaneously, but rather the turn starts with a single bird and spreads quickly across the flock like a shock wave.

We can lead the flock around by animating the goal point along the desired path, somewhat ahead of the flock.
Even if the migratory goal point is changed abruptly the path of each boid still is relatively smooth because of the flight model's simulated conservation of momentum.
This means that the boid's own flight dynamics implement a form of smoothing interpolation between "control points."

## Avoiding Environmental Obstacles (p31)

The paper discounts the "force field" concept, and discusses "steer-to-avoid" as a better simulation.

The boid considers only obstacles directly in front of it: it finds the intersection, if any, of its local Z axis with the obstacle.
Working in local perspective space, it finds the silhouette edge of the obstacle closest to the point of eventual impact.
A radial vector is computed which will aim the boid at a point one body length beyond that silhouette edge.

## Future Work (p33)

More interesting behavior models would take into account hunger, finding food, fear of predators, a periodic need to sleep, and so on.

# Other ideas

Make a boid highlightable, so we can track it easily when watching the simulation.
Make a boid scriptable, so we can see flock behaviour with regards to it.
Make the FOV dynamic, i.e. the faster the boid goes, the less it pays attention to what's next to it, and more to what's in front of it (and even futher ahead of it).
What about a boid that flies into a corner? How does it get out?
Can the navigation model be made less accurate under normal conditions, but then get more accurate in the presence of predators? What would it mean to be more accurate? (e.g. more precise computation or increase in speed with a cost of the boid getting "tired" quicker?)


# Interesting

## p32

The boids software was written in Symbolics Common Lisp.
The code and animation were produced on a [Symbolics 3600 Lisp Machine](https://en.wikipedia.org/wiki/Symbolics#The_3600_series), a high-performance personal computer. (already 4 years old at the time of the paper, and as big as a fridge!)

The boid software has not been optimized for speed.
But this report would be incomplete without a rough estimate of the actual performance of the system.
With a flock of 80 boids, using the naive O(N ~) algorithm (and so 6400 individual boidto-boid comparisons), on a single Lisp Machine without any special hardware accelerators, the simulation ran for about 95 seconds per frame.
A ten-second (300 frame) motion test took about eight hours of real time to produce.

## Other sources

[Steering Behaviors For Autonomous Characters](http://www.red3d.com/cwr/steer/) by the same author.

# Funny

## Acknowledgements (p33)

I would like to thank flocks, herds, and schools for existing; nature is the ultimate source of inspiration for computer graphics and animation.

(Thanks) ...to the field of computer graphics, for giving professional
respectability to advanced forms of play such as reported in
this paper.

# Three.js

```
Vector3 directionToSomething = something.position - my.position

my.rotation = Quaternion.FromToRotation(Vector3.back, directionToSomething)

// or
my.rotation = Quaternion.LookRotation(-directionToSomething, VEctor3.up)
```