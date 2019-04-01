# hexglobus
An experiment in hexmapping

Hexes at (0, 0) are concentric at all scales, scale 0 being the smallest, 1 being twice as long, and so on. See [the example diagram](hex-scale.svg), [this blog post](https://dqmusings.blogspot.com/2017/03/mapping-with-master-hexes.html) refers to these as "Category 1". 

# Demo
[https://vsharapov.github.io/hexglobus/](https://vsharapov.github.io/hexglobus/)

# Goals
v0.1 should be an HTML5 webpage that can display a small hexmap, with the following interactions:
- [x] Generate a random hex property (fill color)
- [ ] Store & retrieve generated hexes as a base64 string
- [x] See the coordinates of the hex in the center of view
- [x] Set coordinates and scale to go to a different hex
- [ ] Toggle the grid for multiple scales, stroke width, color, transparency
- [ ] Underlay an image that is locked to specific hex coordinates and moves/scales with the grid

v0.2 should modularize hex attributes and present a framework around them
- [ ] Minimalistic hex attribute viewer and editor
- [ ] Option to allow attributes to represent themselves as hex background or text
- [ ] Attributes have limits on which scales they apply to
- [ ] Attributes can depend on other attributes for some or all functionality
- [ ] Attributes can point to non-declarative functionality for procedures like generation
- [ ] Some sample attributes like elevation, terrain type, some atmospherics, etc...

v0.3 should introduce usable content allowing niche use
- [ ] Simple political simulation
- [ ] Select terrains detailed (forest, hill, grass, swamp)
- [ ] Basic hydrodynamics
- [ ] Landmarks for detailed terrain
- [ ] Simplified visibility and travel time
- [ ] Simplified random encounters

v1.0 should be a viable worldbuilding and exploration helper tool:
- [ ] Manually generate terrain by drawing and filling areas at arbitrary scale
- [ ] Generate heightmap by copying data from real-world analogues or procedurally
- [ ] Generate watersheds, streams, and bodies of water based on heightmap
- [ ] Generate landmarks based on sophisticated random tables
- [ ] Estimate visible area from any point based on terrain attributes
- [ ] Estimate travel speed at a range of effort levels
- [ ] Generate navigation difficulty based on visibility, terrain variety, and tools
- [ ] Generate realistic random enocounter seeds based on presence attributes
- [ ] Track, save and load paths through the map
