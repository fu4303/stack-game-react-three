import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useSpring} from 'react-spring'
import { a } from '@react-spring/three'
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import './App.css';
import create from 'zustand';

const [useStore] = create(set => ({
  count: 0,
  welcome: true,
  api: {
    reset: welcome => set(state => ({ welcome, count: welcome ? state.count : 0 })),
  },
}))

function Light(props) {
  const mesh = useRef();
  useEffect(() => {
    mesh.current.lookAt(new THREE.Vector3(0, 0, 0));
  }, [mesh]);
  return <directionalLight position={[25, 15, 12.5]} {...props} ref={mesh} />;
}
function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const test = useThree();
  const [ready, setReady] = useState(false);
  useFrame(state => {
    setReady(true);
    console.log(test);
    if (props.active) {
      if (props.axis)
        mesh.current.position.x = Math.sin(new Date() / 500) * 1.2;
      else {
        mesh.current.position.x = 0;
        mesh.current.position.z = -Math.sin(new Date() / 500) * 1.2;
      }
      //console.log(mesh.current.position.y);
    }
  });
  // Set up state for the hovered and active state
  const color = new THREE.Color(0xffffff);
  color.setHSL(props.score*20/255 %1,0.6,0.5)
  return (
    <mesh
      {...props}
      position={[0, props.score, 0]}
      ref={mesh}
      scale={[1, 0.2, 1]}
    >
      {ready && (<boxBufferGeometry attach="geometry" args={[1, 1, 1]} />)}
      <meshToonMaterial attach="material" color={color} />
    </mesh>
  );
}
const Boxes = (props) => {
  const [canUpdate, setUpdate] = useState(true);
  const [children, setChildren] = useState(
    [
      {
        active: false,
        bounds: [new THREE.Vector2(1, 1), new THREE.Vector2(0, 0)]
      },
      {
        active: true,
        bounds: [new THREE.Vector2(1, 1), new THREE.Vector2(0, 0)]
      }]);
      const test = useThree();
  const handleClick = () =>{
    const ch = children.slice();
    ch[children.length - 1].active = false;
    ch.push({
      active: true,
      bounds: [new THREE.Vector2(1, 1), new THREE.Vector2(0, 0)]
    })
    setUpdate(false);
    setChildren(ch);
    console.log(children);
    //setY(() => ({ position: [0, (0.2 - 0.2 * children.length), 0] }));
  };
  const grp = useRef();

  useFrame(() => {
    if (canUpdate && props.down)
      handleClick();
    if (!canUpdate && !props.down)
      setUpdate(true);
    const desired =  2+0.2 * children.length;
    if(test.camera.position.y !== desired)
      test.camera.position.y = Math.min(0.2*children.length+2,test.camera.position.y+0.02);
  })
  return (
    <a.group ref={grp}>
        

        
      {children.map((b, index) => (
      
        <Box score={0.2 * index} active={b.active} axis={index % 2} />
    ))}
    </a.group>
)
}
function App() {

  const [down, set] = useState(false);
  return (
    <section style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        //concurrent
        camera={{ position: [2, 2.4, 2], near: 0.01, far: 10000, fov: 80 }}
        onMouseUp={() => set(false)}
        onMouseDown={() => set(true)}
        onCreated={({ gl, camera }) => {
          //actions.init(camera);
          gl.toneMapping = THREE.Uncharted2ToneMapping;
          gl.setClearColor(new THREE.Color('#020207'));
        }}
        
      >
        <fog attach="fog" args={[111, 100, 700]} />
        <ambientLight intensity={0.4} />
        <Light intensity={0.7} />
        <Boxes down={down}/>
          {/* <mesh>
          <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
          <meshToonMaterial attach="material" color={'hotpink'} />
        </mesh> */}
      </Canvas>
    </section>
  );
}

export default App;
