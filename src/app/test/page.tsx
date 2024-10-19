"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import dynamic from "next/dynamic";
import { LucideArrowUpLeftFromSquare } from "lucide-react";

//function to add element
// Define the parent element's position and dimensions
const parent = { id: "parent", x: 100, y: 100, width: 300, height: 300 };

// Existing elements with their positions (coordinates provided separately)
const existingElements = [
  { id: "existing1", x: 120, y: 420, width: 50, height: 50 },
  { id: "existing2", x: 250, y: 450, width: 50, height: 50 },
  // Add more elements as needed
];

// New element (Z) dimensions
const newElement = { width: 50, height: 50 };

// Helper function to calculate if a position overlaps with any other element
const doesOverlap = (x, y, width, height, elements) => {
  return elements.some((element) => {
    return (
      x < element.x + element.width &&
      x + width > element.x &&
      y < element.y + element.height &&
      y + height > element.y
    );
  });
};

// Function to find the perfect position for a new element below the parent
const findPerfectPositionBelowParent = (parent, newElement, existingElements) => {
  // Define a gap between the parent and the new element
  const gap = 10;

  // Start searching below the parent element
  let startX = parent.x + (parent.width - newElement.width) / 2; // Center horizontally below the parent
  let startY = parent.y + parent.height + gap; // Start just below the parent

  // Increment to move down and search for available space
  const increment = 10;

  while (true) {
    // Check if the current position overlaps with any existing elements
    if (!doesOverlap(startX, startY, newElement.width, newElement.height, existingElements)) {
      // If no overlap, return this position
      return { x: startX, y: startY };
    }

    // Move down by the increment
    startY += increment;
  }
};



const get_mermaid_code=()=>{
  return `
  graph TD
    K --> E`;

};







// Dynamically import Excalidraw (SSR disabled)
const Excalidraw = dynamic(() => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw), {
  ssr: false,
});

export default function Component() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
 

  const updatedata=async ()=>{

    const data=excalidrawAPI.getSceneElements();
    const id_elements:any={}
    const coordinates:any={}
    data.forEach((item)=>{
      id_elements[item.id]=item;
      coordinates[item.id]={
        x:item.x,
        y:item.y,
        width:item.width||0,
        height:item.height||0,
      }
    });
    const new_mermaid=get_mermaid_code();
    const new_mermaid_code=await parseMermaidToExcalidraw(new_mermaid, {
      fontSize: 16,
    });
    // console.log(new_mermaid_code.elements);
    new_mermaid_code.elements.forEach((item, index) => {
      if (item.id in id_elements) {
        // Update the element directly in the array
        new_mermaid_code.elements[index] = id_elements[item.id];
      }
    });
    console.log(new_mermaid_code.elements)
    
    
    // console.log('working',new_mermaid_code)
    const new_excalidrawElements =   convertToExcalidrawElements(new_mermaid_code.elements,{regenerateIds: false});
    // console.log('2',new_excalidrawElements)
      // console.log(new_excalidrawElements);
      
    
      // Update the Excalidraw scene with new elements
      const sceneData = {
        elements: Object.values(id_elements).concat(new_excalidrawElements),
        appState: {
          viewBackgroundColor: "#edf2ff",
        },
      };
      console.log(sceneData.elements);
      // Update the scene in Excalidraw
      if (excalidrawAPI) {
        excalidrawAPI.updateScene(sceneData);
      }
      




  }
  
  // Define the scene data
  const diagramDefinition = `
    graph TD
      A --> B
      B --> C
      C -->|No| D
      C -->|Yes| E
      E --> F
      F -->|Yes| G
      F -->|No| H
      H -->|Yes| I
      H -->|No| J
      I --> C
      J --> C

      A["Start"]
      B["Initialize low = 0, high = n-1"]
      C{"Is low <= high?"}
      D["Return -1"]
      E["Calculate mid = low + (high - low) / 2"]
      F{"Is target == arr[mid]?"}
      G["Return mid"]
      H{"Is target < arr[mid]?"}
      I["Set high = mid - 1"]
      J["Set low = mid + 1"]



  `;

  const updateScene = async () => {
    try {
      // Parse Mermaid diagram into Excalidraw elements
      const { elements, files } = await parseMermaidToExcalidraw(diagramDefinition, {
        fontSize: 16,
      });
      console.log(elements);
      // Convert the parsed elements into Excalidraw's format
      const excalidrawElements =   convertToExcalidrawElements(elements,{regenerateIds: false});
      console.log(excalidrawElements);

      // Update the Excalidraw scene with new elements
      const sceneData = {
        elements: excalidrawElements,
        appState: {
          viewBackgroundColor: "#edf2ff",
        },
      };

      // Update the scene in Excalidraw
      if (excalidrawAPI) {
        excalidrawAPI.updateScene(sceneData);
      }
      
    } catch (error) {
      console.error("Error parsing Mermaid diagram:", error); 
    }
  };
  
  // const updatedata=;
  return (
    <div className="flex h-screen bg-background">
        <div className="w-64 bg-muted p-4 flex flex-col">
            <p style={{ fontSize: "16px" }}> Click to update the scene</p>
                <button className="custom-button" onClick={updateScene}>
            Update Scene
        </button>
        <button onClick={updatedata}>
          updatedata
        </button>
        </div>
        {/* <button className="custom-button" onClick={updatedata}>
            Send data
        </button> */}
      {/* Main Content - Excalidraw Canvas */}
      <div className="flex-1 bg-white p-4">
        <div className="h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api) } />
        </div>
      </div>
    </div>
  );
}
