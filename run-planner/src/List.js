import React from 'react';
import './List.css';

function List({ routes, onRouteClick }) {
  return (
    <div>
      <h2>Saved Routes</h2>
      <div className="list-container">
        {routes.map((route, index) => (
          <div 
            key={index} 
            className="list-item"
            onClick={() => onRouteClick(route)} 
          >
            <div>
              <strong>{route.start} to {route.end}</strong>
            </div>
            <div>
              Distance: {route.distance} miles
            </div>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(route.start)}&destination=${encodeURIComponent(route.end)}&travelmode=walking`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <button>Get Directions</button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default List;
