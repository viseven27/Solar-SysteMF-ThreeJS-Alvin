import * as THREE from "./three.js-r145-compressed/build/three.module.js";
import { OrbitControls } from './three.js-r145-compressed/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from './three.js-r145-compressed/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from './three.js-r145-compressed/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from './three.js-r145-compressed/examples/jsm/geometries/TextGeometry.js';

var scene, camera, renderer, controls;
var sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, saturnRing, uranusRing;
var Satellite;
var textList;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let hoveredObject = null;
let rotationSpeeds = {};
var model;
var speed = 0.5;



const colorList = [
    "#00FFFF", "#00FF00", "#FFCC00", "#E6E6FA", "#FF69B4",
    "#FF8C00", "#FFB6C1", "#00FFFF", "#87CEEB", "#A8FFB2",
    "#EE82EE", "#ADD8E6"
];

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onMouseClick, false);

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

const init = () => {
    scene = new THREE.Scene();

    let fov = 75;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let aspect = w / h;
    let near = 0.1;
    let far = 10000;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(640, 480, 240);
    camera.lookAt(640, 320, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    createObjects();
    createSkybox();
    createSpotlights();

    const txt = [
        {
          text: "MERCURY",
          size: 5,
          height: 1,
          pos: new THREE.Vector3(58, 350, 0),
          name: "mercury",
        },
        {
          text: "VENUS",
          size: 3.5,
          height: 1,
          pos: new THREE.Vector3(8, 350, 0),
          name: "venus",
        },
        {
          text: "EARTH",
          size: 3.5,
          height: 1,
          pos: new THREE.Vector3(100, 350, 0),
          name: "earth",
        },
        {
          text: "MARS",
          size: 3.5,
          height: 1,
          pos: new THREE.Vector3(130, 350, 0),
          name: "mars",
        },
        {
          text: "JUPITER",
          size: 3.5,
          height: 1,
          pos: new THREE.Vector3(175, 350, 0),
          name: "jupiter",
        },
        {
          text: "SATURN",
          size: 3.5,
          height: 1,
          pos: new THREE.Vector3(240, 350, 0),
          name: "saturn",
        },
        {
          text: "URANUS",
          size: 3.5,
          height: 1,
          pos: new THREE.Vector3(280, 350, 0),
          name: "uranus",
        },
        {
          text: "NEPTUNE",
          size: 3.5,
          height: 1,
          pos: new THREE.Vector3(320, 350, 0),
          name: "neptune",
        },
      ];
    
      textList = new THREE.Group();
    
      txt.forEach((t) => createText(t.text, t.size, t.height, t.pos, t.name));
      scene.add(textList);

      createSunText("SUN", 7, 1, new THREE.Vector3(640, 320, 0), "sun");
};

const render = () => {
    requestAnimationFrame(render);
    animatePlanets();
    moving();
    updateSpotlight();
    controls.update();
    renderer.render(scene, camera);
};

window.onresize = () => {
    let w = window.innerWidth;
    let h = window.innerHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
};

window.onload = () => {
    init();
    render();
};

let isThirdPerson = true;

const updateCamera = () => {
  if (!model) return;

  if (isThirdPerson) {
      const distance = -16;
      const height = 16;
      
      var offset = new THREE.Vector3(0, height, distance);
      offset.applyQuaternion(model.quaternion); 
      
      camera.position.copy(model.position).add(offset);
      
      camera.lookAt(model.position);
      
      controls.target.copy(model.position);
      controls.update();
  } else {
      controls.target.set(640, 320, 0);
      controls.update();
      animate();
      animateText();
  }
};


window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        isThirdPerson = !isThirdPerson;
    }
});

const moving = () =>{
    if(keypressed.w == true){
      moveForward();
    }
  
    if(keypressed.a == true){
      rotateLeft();
    }
  
    if(keypressed.d == true){
      rotateRight();
    }
  
    if(keypressed.s == true){
      rotateDown();
    }
  
    if(keypressed.space == true){
      rotateUp();
    }
  
    updateCamera();
  }
  
  var keypressed = {
    w:false,
    a:false,
    d:false,
    space:false,
    s:false
  };
  
  window.addEventListener("keydown", (event) =>{
    if(event.key === "w" || event.key === "W" ){
      keypressed.w = true;
    }
    else if(event.key === "a" || event.key === "A" ){
      keypressed.a = true;
    }
    else if(event.key === "d" || event.key === "D" ){
      keypressed.d = true;
    }
    else if(event.key === "s" || event.key === "S" ){
      keypressed.s = true;
    }
    else if(event.key === " " || event.key === "Spacebar" ){
      keypressed.space = true;
    }
  })
  
  window.addEventListener("keyup", (event) =>{
    if(event.key === "w" || event.key === "W" ){
      keypressed.w = false;
    }
    else if(event.key === "a" || event.key === "A" ){
      keypressed.a = false;
    }
    else if(event.key === "d" || event.key === "D" ){
      keypressed.d = false;
    }
    else if(event.key === "s" || event.key === "S" ){
      keypressed.s = false;
    }
    else if(event.key === " " || event.key === "Spacebar" ){
      keypressed.space = false;
    }
  })
  
  const moveForward = () => {
    const direction = new THREE.Vector3(0, 0, 1); 
    direction.applyQuaternion(model.quaternion); 
    model.position.add(direction.multiplyScalar(speed));
  };
  
  const rotateLeft = () =>{
    model.rotation.y += 0.03;
  }
  
  const rotateRight = () =>{
    model.rotation.y -= 0.03;
  }
  
  const rotateUp = () =>{
    model.rotation.z -= -0.01;
  }
  
  const rotateDown = () =>{
    model.rotation.z += -0.01;
  }
  
  const createText = (text, size, height, pos, name) => {
    let loader = new FontLoader();
    loader.load("./three.js-r145-compressed/examples/fonts/helvetiker_regular.typeface.json", 
      (font) => {
        let geometry = new TextGeometry(text, {
          font: font,
          size: size,
          height: height
        });
        geometry.center();
        let material = new THREE.MeshBasicMaterial({
          color: "orange",
          transparent: true,  
          opacity: 0 
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(pos);
        mesh.name = `${name}_text`; 
        textList.add(mesh);
      });
};

const createSunText = (text, size, height, pos, name) => {
  const loader = new FontLoader();
  loader.load(
      "./three.js-r145-compressed/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
          const geometry = new TextGeometry(text, {
              font: font,
              size: size,
              height: height,
          });
          geometry.center();

          const material = new THREE.MeshBasicMaterial({
              color: "orange",
              transparent: true, 
              opacity: 0, 
          });

          const mesh = new THREE.Mesh(geometry, material);

  
          const adjustedPos = pos.clone(); 
          adjustedPos.y += 50; 
          mesh.position.copy(adjustedPos);

          mesh.name = `${name}_text`; 

          textList.add(mesh);

          const animateText = () => {
              mesh.lookAt(camera.position);
              requestAnimationFrame(animateText);
          };
          animateText();
      }
  );
};

  const load3DModel = (url) => {
    return new Promise((resolve, reject) => {
      let loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => resolve(gltf.scene),
        undefined,
        (error) => reject(error)
      );
    });
  };

const createObjects = async () => {
    let pointLight = createPointLight();
    pointLight.position.set(640, 320, 0);
    scene.add(pointLight); 

    let spotLight = createSpotLight();
    spotLight.position.set(640, 480, 240); 
    scene.add(spotLight); 

    let loader = new THREE.TextureLoader();
    let sunTexture = loader.load('./assets/textures/sun.jpg');
    let mercuryTexture = loader.load('./assets/textures/mercury.jpg');
    let venusTexture = loader.load('./assets/textures/venus.jpg');
    let earthTexture = loader.load('./assets/textures/earth.jpg');
    let marsTexture = loader.load('./assets/textures/mars.jpg');
    let jupiterTexture = loader.load('./assets/textures/jupiter.jpg');
    let saturnTexture = loader.load('./assets/textures/saturn.jpg');
    let uranusTexture = loader.load('./assets/textures/uranus.jpg');
    let neptuneTexture = loader.load('./assets/textures/neptune.jpg');

    sun = createSphereNoShadow(40, sunTexture);
    sun.position.set(640, 320, 0);
    sun.name = "sun";

    mercury = createSphere(3.2, mercuryTexture);
    venus = createSphere(4.8, venusTexture);
    earth = createSphere(4.8, earthTexture);
    mars = createSphere(4, marsTexture);
    jupiter = createSphere(13, jupiterTexture);
    saturn = createSphere(10, saturnTexture);
    uranus = createSphere(8, uranusTexture);
    neptune = createSphere(6, neptuneTexture);
    Satellite = createCylinder(1, 0.5, 0.4, 8, '#CCCCCC', 0.5, 0.5)
    mercury.name = "mercury";
    venus.name = "venus";
    earth.name = "earth";
    mars.name = "mars";
    jupiter.name = "jupiter";
    saturn.name = "saturn";
    uranus.name = "uranus";
    neptune.name = "neptune";

    mercury.position.set(58, 320, 0);
    venus.position.set(80, 320, 0);
    earth.position.set(100, 320, 0);
    mars.position.set(130, 320, 0);
    jupiter.position.set(175, 320, 0);
    saturn.position.set(240, 320, 0);
    uranus.position.set(280, 320, 0);
    neptune.position.set(320, 320, 0);
    Satellite.position.set((100 + 8), 320, 0);

    uranusRing = createRing(16, 20, 64, '#FFFFFF', './assets/textures/uranus_ring.png');
    saturnRing = createRing(16, 32, 64, '#FFFFFF', './assets/textures/saturn_ring.png');
    uranusRing.rotation.x = Math.PI / 2;
    saturnRing.rotation.x = Math.PI / 2;
    uranus.add(uranusRing);
    saturn.add(saturnRing);
    scene.add(Satellite)
    createSatelliteLighting(Satellite);
    createRingLighting();

    let objects = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];
    objects.forEach(obj => {
        scene.add(obj);
    });
    
    try {
      model = await load3DModel("./assets/model/spaceship/scene.gltf");
      model.position.set(750, 320, 0);
  
      model.name = "spaceship";  
      scene.add(model);
  } catch (error) {
      console.error("Error loading model: ", error);
  }
  
};

const createPathString = () => {
  const basePath = "./assets/skybox/";
  const sides = [
    "right.png",   
    "left.png",    
    "top.png",    
    "bottom.png", 
    "front.png",   
    "back.png"     
  ];
  return sides.map((side) => basePath + side);
};

const createMaterialArray = () => {
  const loader = new THREE.TextureLoader();
  const skyboxImagePaths = createPathString();
  const materialArray = [];

  skyboxImagePaths.forEach((image) => {
    const texture = loader.load(
      image,
      () => console.log(`Loaded texture: ${image}`),
      undefined,
      (err) => console.error(`Failed to load texture: ${image}`, err)
    );
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
    });
    materialArray.push(material);
  });
  return materialArray;
};

const createSkybox = () => {
  let skyboxMat = createMaterialArray();
  let skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
  let skybox = new THREE.Mesh(skyboxGeo, skyboxMat);

  scene.add(skybox);
  console.log("Skybox added:", skybox);
};

const orbitalRadii = {
    mercury: 58,
    venus: 80,
    earth: 100,
    mars: 130,
    jupiter: 175,
    saturn: 240,
    uranus: 280,
    neptune: 320
};

const speeds = {
    mercury: { orbit: 0.2, rotation: 0.03 },
    venus: { orbit: 0.1, rotation: 0.01 },
    earth: { orbit: 0.05, rotation: 0.05 },
    mars: { orbit: 0.04, rotation: 0.04 },
    jupiter: { orbit: 0.02, rotation: 0.1 },
    saturn: { orbit: 0.01, rotation: 0.08 },
    uranus: { orbit: 0.005, rotation: 0.06 },
    neptune: { orbit: 0.003, rotation: 0.07 }
};

function onMouseClick() {
  if (hoveredObject && hoveredObject.name) {
      const planetName = hoveredObject.name.toLowerCase();

      if (speeds[planetName] && speeds[planetName].rotation !== undefined) {
          const originalRotationSpeed = speeds[planetName].rotation;
          speeds[planetName].rotation *= 5;

          console.log(`Increased rotation speed for ${planetName}`);

          setTimeout(() => {
              speeds[planetName].rotation = originalRotationSpeed;
              console.log(`Reset rotation speed for ${planetName}`);
          }, 2000);
      } else {
          console.warn(`No speed data found for planet: ${planetName}`);
      }
  }
}

const getRandomColor = () => {
    return colorList[Math.floor(Math.random() * colorList.length)];
};

Object.keys(speeds).forEach(planetName => {
    rotationSpeeds[planetName] = speeds[planetName].rotation;
});

const animatePlanets = () => {
    const time = Date.now() * 0.0001;

    Object.keys(speeds).forEach(planetName => {
        let planet = eval(planetName);
        let orbitRadius = orbitalRadii[planetName];
        let speed = speeds[planetName];

        planet.position.x = sun.position.x + orbitRadius * Math.cos(time * speed.orbit);
        planet.position.z = sun.position.z + orbitRadius * Math.sin(time * speed.orbit);
        planet.rotation.y += speed.rotation;
        if (planetName === 'earth') {
            Satellite.position.x = planet.position.x + 8; 
            Satellite.position.z = planet.position.z;
            Satellite.position.y = planet.position.y;
        }
    });
};

const animateText = () => {
    const time = Date.now() * 0.0001;

    textList.children.forEach((mesh, index) => {
        const planetNames = Object.keys(orbitalRadii);
        if (index >= planetNames.length) return; 

        let planetName = planetNames[index]; 
        let planet = eval(planetName); 

        if (!planet || !speeds[planetName]) return; 

        let orbitRadius = orbitalRadii[planetName]; 
        let speed = speeds[planetName]; 

        mesh.position.x = sun.position.x + orbitRadius * Math.cos(time * speed.orbit);
        mesh.position.z = sun.position.z + orbitRadius * Math.sin(time * speed.orbit);

        mesh.rotation.y += speed.rotation;
        mesh.lookAt(camera.position);
    });
};

const animate = () => {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const firstIntersect = intersects[0].object;

    const allowedObjects = ["sun", "mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"]; 

    if (firstIntersect.name !== "spaceship") {
      if (hoveredObject !== firstIntersect) {

        if (hoveredObject && hoveredObject.name) {
          const prevText = textList.children.find(t => t.name === `${hoveredObject.name}_text`);
          if (prevText) prevText.material.opacity = 0;

          if (allowedObjects.includes(hoveredObject.name)) {
            hoveredObject.material.color.set(hoveredObject.originalColor);
          }
        }

        hoveredObject = firstIntersect;

        if (allowedObjects.includes(hoveredObject.name)) {
          hoveredObject.originalColor = hoveredObject.material.color.getHex(); 
          hoveredObject.material.color.set(getRandomColor()); 
        }


        if (hoveredObject.name) {
          const newText = textList.children.find(t => t.name === `${hoveredObject.name}_text`);
          if (newText) newText.material.opacity = 1;
        }
      }
    }
  } else if (hoveredObject) {
    if (hoveredObject.name) {
      const textToHide = textList.children.find(t => t.name === `${hoveredObject.name}_text`);
      if (textToHide) textToHide.material.opacity = 0;

      if (allowedObjects.includes(hoveredObject.name)) {
        hoveredObject.material.color.set(hoveredObject.originalColor);
      }
    }
    hoveredObject = null;
  }
};




const createPointLight = () => {
    let pointLight = new THREE.PointLight('#FFFFFF', 1, 1280);
    pointLight.castShadow = true;

    return pointLight;
};

const createSpotLight = () => {
    let spotLight = new THREE.SpotLight('#FFFFFF', 8, 8);
    spotLight.castShadow = true;

    return spotLight;
};

let spotlights;

const createSpotlights = () => {
  spotlights = new THREE.SpotLight(0xFFFFFF, 8);
  spotlights.castShadow = false; 
  spotlights.distance = 8;

  scene.add(spotlights); 

  spotlights.target = new THREE.Object3D();
  scene.add(spotlights.target); 
};



const updateSpotlight = () => {
  if (!model) return;

  spotlights.position.copy(model.position).add(new THREE.Vector3(0, 6, 0));

  spotlights.target.position.copy(model.position);
  spotlights.target.updateMatrixWorld(); 
};


const createSphereNoShadow = (r, texture) => {
    let geo = new THREE.SphereGeometry(r);
    let mat = new THREE.MeshBasicMaterial({
        color: '#FFFFFF',
        map: texture
    });
    let mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = false;
    mesh.receiveShadow = false;

    return mesh;
};

const createSphere = (r, texture) => {
    let geo = new THREE.SphereGeometry(r);
    let mat = new THREE.MeshBasicMaterial({
        color: '#FFFFFF',
        map: texture
    });
    let mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
};

const createRing = (innerRadius, outerRadius, thetaSegments, color, texturePath) => {
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(texturePath);
    const material = new THREE.MeshStandardMaterial({ 
        map: texture,
        transparent: true,
        side: THREE.DoubleSide 
    });
    const ring = new THREE.Mesh(geometry, material);
    ring.receiveShadow = true;
    ring.castShadow = false;

    return ring;
};


const createCylinder = (radiusTop, radiusBot, height, radialSeg, color, metalness, roughness) =>{
    let geometry = new THREE.CylinderGeometry(radiusTop, radiusBot, height, radialSeg);
    let material = new THREE.MeshStandardMaterial({color: color, metalness: metalness, roughness: roughness})
    let mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
}

function createSatelliteLighting(satellite) {
  const spotlight = new THREE.SpotLight(0xffffff, 1);
  spotlight.position.set(satellite.position.x + 5, satellite.position.y + 5, satellite.position.z + 5);
  spotlight.target = satellite;

  spotlight.angle = Math.PI / 6; 
  spotlight.penumbra = 0.3; 
  spotlight.decay = 2; 
  spotlight.distance = 50;

  scene.add(spotlight);
}

function createRingLighting() {
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(20, 10, 0); 
  scene.add(directionalLight);
}