# hexglobus
An experiment in hexmapping

Hexes at (0, 0) are concentric at all scales, scale 0 being the smallest, 1 being twice as long, and so on. See [the example diagram](hex-scale.svg), [this blog post](https://dqmusings.blogspot.com/2017/03/mapping-with-master-hexes.html) refers to these as "Category 1". 

# Demo
[https://vsharapov.github.io/hexglobus/](https://vsharapov.github.io/hexglobus/)

# Goals
v0.1 is an HTML5 webpage that can display a small hexmap, with the following interactions:

- Generate a random hex property (fill color)
- Store & retrieve generated hexes as a base64 string
- See the coordinates and scale of the hex in the center of view
- Set coordinates and scale to go to a different hex
- Toggle the grid for multiple scales, stroke width, color, transparency
- Underlay an image that is locked to specific hex coordinates and moves/scales with the grid
