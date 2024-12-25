import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Component } from 'react';
import ImageDisplay from './Components/ImageDisplay/ImageDisplay';
import SignIn from './Components/SignIn/Signin';
import Register from './Components/Register/Register';
import process from "process";
window.process = process;

// Your PAT (Personal Access Token)
const PAT = '128c6c92e29b442b8da00abc70a07ee3';
const USER_ID = 'haziqsulaimn';
const APP_ID = 'face-recognition';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';


const initialState = {
  input: "",
  boundingBox: [],
  route: 'SignIn',
  user: {
    id: "",
    name: "",
    email: "",
    entries: "0",
    joined: ""
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user : {
        id : data.id,
        name : data.name,
        email: data.email,
        entries : data.entries,
        joined : data.joined,
      }
    })
    // console.log(data);
  }


  // Handles input changes
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  // Calculate Bounding Boxes
  calculateBoundingBoxes = (regions, image) => {
    const width = image.width;
    const height = image.height;

    return regions.map((region) => {
      const box = region.region_info.bounding_box;
      const calculatedBox = {
        top: box.top_row * height,
        left: box.left_col * width,
        bottom: box.bottom_row * height,
        right: box.right_col * width,
      };
      console.log("Calculated Box:", calculatedBox);
      return calculatedBox;
    });
  };

  // Handles button click and makes the Clarifai API call
  onButtonSubmit = () => {
    console.log("Button Clicked");
  
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: this.state.input,
            },
          },
        },
      ],
    });
  
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Key ' + PAT,
      },
      body: raw,
    };
  
    // Step 1: Fetch data from Clarifai API
    fetch(
      `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        // Handle Clarifai API response
        if (
          data.outputs &&
          data.outputs[0].data &&
          data.outputs[0].data.regions
        ) {
          const regions = data.outputs[0].data.regions;
          console.log("Regions Data:", regions);
  
          // Update bounding box after image loads
          const image = document.getElementById('inputImage');
          image.onload = () => {
            const boundingBoxes = this.calculateBoundingBoxes(regions, image);
            this.setState({ boundingBox: boundingBoxes });
          };
          image.src = this.state.input;
  
          // Proceed to update user entries
          return fetch("https://54.253.16.78.nip.io:3001/image", {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          });
        } else {
          throw new Error("No regions detected");
        }
      })
      // Step 2: Handle backend API response
      .then((response) => response.json())
      .then((count) => {
        console.log("Updated user entry count:", count);
        this.setState({
          user: {
            ...this.state.user,
            entries: count.entries, // Make sure 'entries' is being returned correctly
          },
        });
        
      })
      .catch((error) => console.error("Error:", error));
  };
  
  

  // Particle initialization
  particlesInit = async (engine) => {
    await loadFull(engine);
  };

  particlesOptions = {
    particles: {
      number: { value: 200 },
      size: { value: 1 },
      move: { enable: true, speed: 2 },
      links: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.5,
        width: 1,
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        repulse: { distance: 100, duration: 1 },
        push: { quantity: 4 },
      },
    },
  };

  onRouteChange = (route) =>{
    if (route === 'SignIn') {
      this.setState(initialState); // Reset entire state
    } else {
      this.setState({ route: route }); // Change route without resetting everything
    }
    console.log(this.state);
  }

  render() {
    return (
      <div className="App">
        <Particles
          className="particles"
          id="tsparticles"
          init={this.particlesInit}
          options={this.particlesOptions}
        />
        { this.state.route === 'SignIn'
        ?(
          <div className="center-container">
            <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          </div>
        ):
        this.state.route === 'Register'
        ?(
          <div className="center-container">
            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          </div>
        )
        :
        <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo />
          <Navigation onRouteChange={this.onRouteChange}/>
        </div>
        <ImageLinkForm
          name = {this.state.user.name}
          entries = {this.state.user.entries}
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <ImageDisplay image={this.state.input} boundingBox={this.state.boundingBox} />
        </div>
        }
      </div>
       
    );
  }
 
 
}

export default App;
