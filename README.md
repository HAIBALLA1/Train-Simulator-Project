# Train Simulator Project

## Overview
This project is a train simulator where users can create, modify, and control trains on a 2D grid-based map. The map includes different types of terrain, such as forests and water, and users can lay down tracks for trains to navigate. The simulator provides a fun and interactive experience where users can manage the movement of locomotives and wagons, build railways, and observe train behaviors, including train collisions.

The simulator is built using JavaScript and HTML5 Canvas for visual rendering, allowing users to interact with the game elements directly in a web browser.

## Features
- **Interactive Map Editor**: Users can place and modify various types of terrains and railways on the map.
- **Train Control**: Users can create locomotives and attach wagons, then control the trains on the tracks.
- **Collision Detection**: The simulator detects collisions between trains and provides visual feedback in the form of explosions.
- **Multiple Types of Tracks**: Tracks include straight lines, curves, and intersections to create diverse railway layouts.
- **Pause and Resume Functionality**: Users can pause the simulation at any time and resume it.

## How to Use
1. **Loading the Simulator**: Open the `index.html` file in a web browser. The simulator will display a grid-based map with a variety of tools for editing the terrain and adding train elements.
2. **Adding Terrain Elements**:
   - Use the buttons to add different types of terrain elements such as forest, water, and rails.
   - Click on the grid to place the selected element.
3. **Adding Trains**:
   - Select the type of train (locomotive alone or with wagons) from the buttons.
   - Click on a valid rail segment to place the locomotive and wagons.
4. **Controlling Trains**:
   - Trains will automatically start moving on the tracks once placed.
   - Use the "Pause" button to stop all trains and "Resume" to start them again.
5. **Collision Detection**:
   - When two trains collide, an explosion animation will be displayed, and the trains will be removed from the map.

## File Structure
- **index.html**: The main HTML file that sets up the structure of the page and includes the canvas where the simulator runs.
- **css/train.css**: The stylesheet that provides the visual style for the simulator, including the layout of buttons and train animations.
- **js/train.js**: The core JavaScript file containing all the logic for managing trains, terrain elements, user interactions, and rendering the game on the canvas.
- **images/**: A folder containing all the images used in the project, such as different terrain types, train components, and explosions.

## Classes Overview
- **Plateau (Board)**: Represents the game board, containing the grid of cells where trains and terrains are placed.
- **Type_de_case (TileType)**: Defines various types of tiles on the board, including forest, water, rails, etc.
- **locomotive**: Represents the locomotive of a train, with attributes for position and direction.
- **Wagon**: Represents a train wagon that follows the locomotive.
- **Train**: Represents a complete train composed of a locomotive and multiple wagons, including logic for movement and collision detection.

## Key Functions
- **image_of_case(type_de_case)**: Returns the appropriate image for a given terrain type.
- **dessine_case(contexte, plateau, x, y)**: Draws a specific tile on the canvas at the given coordinates.
- **dessine_vehicule(contexte, type_de_vehicule, x, y)**: Draws a locomotive or wagon on the canvas.
- **interagir_avec_plateau()**: Adds event listeners for user interactions with the board, such as placing terrain elements or trains.
- **cree_plateau_initial(plateau)**: Sets up an initial board layout with pre-defined railways and terrain features.

## Installation
To run the project, follow these steps:
1. Clone the repository or download the source files.
2. Open `index.html` in any modern web browser (such as Chrome, Firefox, or Edge).
3. No additional setup is required as all resources are locally provided.

## Dependencies
- HTML5 Canvas: Used for rendering the game visuals.
- JavaScript: The primary programming language used for game logic.
- CSS: Used for styling the interface and enhancing the visual experience.

## Future Improvements
- **Save and Load Layouts**: Allow users to save their custom layouts and load them later.
- **Advanced Train Controls**: Add features like setting train speed and direction manually.
- **More Terrain Types**: Include additional terrain elements such as mountains or tunnels.
- **Pathfinding**: Implement pathfinding for trains to navigate complex railway networks.

## License
This project is open-source under the MIT License. Feel free to use, modify, and distribute the project as you wish.



