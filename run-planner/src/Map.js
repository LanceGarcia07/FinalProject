import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import List from './List';
import { auth, firestore } from './firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Map.css';

const containerStyle = {
  width: '800px',
  height: '600px'
};

const center = {
  lat: 47.6541,
  lng: -122.3080
};

function Map() {
  const [response, setResponse] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [routeStart, setRouteStart] = useState('');
  const [routeEnd, setRouteEnd] = useState('');
  const [routes, setRoutes] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        loadRoutes(user.uid);
      } else {
        setRoutes([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadRoutes = async (uid) => {
    const q = query(collection(firestore, 'routes'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    const routesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRoutes(routesList);
  };

  const saveRoute = async (route) => {
    if (user) {
      try {
        await addDoc(collection(firestore, 'routes'), {
          ...route,
          uid: user.uid,
          createdAt: new Date(),
        });
        loadRoutes(user.uid); // Refresh the routes list for the current user
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const directionsCallback = (res) => {
    if (res !== null) {
      if (res.status === 'OK') {
        setResponse(res);
        setRouteStart('');
        setRouteEnd('');
      } else {
        console.error('Error fetching directions', res);
      }
    }
  };

  const handleSearch = () => {
    if (start !== '' && end !== '') {
      setRouteStart(start);
      setRouteEnd(end);
    }
  };

  const handleAddRoute = () => {
    if (response && start !== '' && end !== '') {
      const legs = response.routes[0].legs[0];
      const distance = (legs.distance.value / 1609.34).toFixed(2); // Convert meters to miles
      const newRoute = { start, end, distance };
      saveRoute(newRoute);
      setStart('');
      setEnd('');
    }
  };

  const handleRouteClick = (route) => {
    setRouteStart(route.start);
    setRouteEnd(route.end);
  };

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/login'); // Redirect to login page after sign out
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey="AIzaSyDotiAoUs4HtBl7Cy4ezhb4rUzHJATqY_w">
        <div className="header">
          {user ? (
            <>
              <div className="auth-buttons">
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
              <p>Welcome, {user.email}</p>
            </>
          ) : (
            <>
              <p>Please log in to add routes.</p>
              <div className="auth-buttons">
                <button onClick={handleLogin}>Login</button>
                <button onClick={handleSignup}>Signup</button>
              </div>
            </>
          )}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Start location"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
          <input
            type="text"
            placeholder="End location"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
          <button className='mapButton' onClick={handleSearch}>Get Route</button>
          <button onClick={handleAddRoute} disabled={!user}>Add Route</button>
        </div>
        <div className="map">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          >
            {routeStart !== '' && (
              <DirectionsService
                options={{
                  destination: routeEnd,
                  origin: routeStart,
                  travelMode: 'WALKING'
                }}
                callback={directionsCallback}
              />
            )}

            {response && (
              <DirectionsRenderer
                options={{
                  directions: response
                }}
              />
            )}
          </GoogleMap>
        </div>
      </LoadScript>
      <div className="list-container">
        <List routes={routes} onRouteClick={handleRouteClick} />
      </div>
    </div>
  );
}

export default Map;
