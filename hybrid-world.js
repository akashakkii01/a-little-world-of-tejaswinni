import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

(() => {
  const host = document.getElementById('hybridCanvasWrap');
  if (!host) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x172a27, 0.045);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 90);
  camera.position.set(0, 1.25, 10.8);
  camera.lookAt(0, -0.15, -1.5);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, powerPreference:'high-performance' });
  } catch (error) {
    host.dataset.fallback = 'true';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden','true');
  host.appendChild(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0xdde9e3, 0x253a2f, 2.1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffdfb0, 3.1);
  sun.position.set(-5, 8, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024,1024);
  sun.shadow.camera.left = -12; sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 10; sun.shadow.camera.bottom = -8;
  scene.add(sun);

  const groundMat = new THREE.MeshStandardMaterial({ color:0x233d32, roughness:1 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40,24), groundMat);
  ground.rotation.x = -Math.PI/2;
  ground.position.set(0,-1.62,-2);
  ground.receiveShadow = true;
  scene.add(ground);

  const trunkGeo = new THREE.CylinderGeometry(.055,.12,1,7);
  const leafGeo = new THREE.ConeGeometry(0.55,1.35,8,1);
  const trunks = new THREE.InstancedMesh(trunkGeo,new THREE.MeshStandardMaterial({color:0x493b2d,roughness:1}),46);
  const leaves = new THREE.InstancedMesh(leafGeo,new THREE.MeshStandardMaterial({color:0x244438,roughness:.92}),138);
  trunks.castShadow = true; leaves.castShadow = true;
  const dummy = new THREE.Object3D();
  let ti=0, li=0;
  for(let i=0;i<46;i++){
    const x=(Math.random()-.5)*22;
    const z=-5+Math.random()*7;
    const scale=.62+Math.random()*1.12;
    dummy.position.set(x,-1.08+scale*.5,z);
    dummy.scale.set(scale,scale,scale);
    dummy.rotation.y=Math.random()*Math.PI;
    dummy.updateMatrix(); trunks.setMatrixAt(ti++,dummy.matrix);
    for(let layer=0;layer<3;layer++){
      dummy.position.set(x,-.58+scale*(.45+layer*.31),z-.015);
      const s=scale*(1.04-layer*.22);
      dummy.scale.set(s,s,s);
      dummy.rotation.y=Math.random()*.3;
      dummy.updateMatrix(); leaves.setMatrixAt(li,dummy.matrix);
      leaves.setColorAt(li,new THREE.Color().setHSL(.37+Math.random()*.045,.27,.17+Math.random()*.09));
      li++;
    }
  }
  const fallbackTrees = new THREE.Group();
  fallbackTrees.add(trunks,leaves);
  scene.add(fallbackTrees);
  // A real, textured CC0 Scots pine model replaces the simple fallback canopy when loaded.
  const treeLoader = new GLTFLoader();
  treeLoader.load('https://files.innerscene.com/library/mature-scots-pine-tree-280307e1/e52dca598822dfa9ffa9/mature-scots-pine-tree.glb', gltf => {
    fallbackTrees.visible = false;
    const source = gltf.scene;
    for (let i=0;i<24;i++) {
      const tree = source.clone(true);
      const scale = .095 + Math.random()*.055;
      tree.scale.setScalar(scale);
      tree.position.set((Math.random()-.5)*22,-1.58,-5+Math.random()*7);
      tree.rotation.y = Math.random()*Math.PI*2;
      tree.traverse(node => { if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; } });
      scene.add(tree);
    }
  }, undefined, () => { fallbackTrees.visible = true; });

  const rockGeo = new THREE.DodecahedronGeometry(.42,1);
  const rockMat = new THREE.MeshStandardMaterial({color:0x59625a,roughness:.96});
  for(let i=0;i<22;i++){
    const rock=new THREE.Mesh(rockGeo,rockMat);
    rock.position.set((Math.random()-.5)*18,-1.48,-.2+Math.random()*5);
    rock.scale.set(.5+Math.random(),.28+Math.random()*.5,.55+Math.random()*.7);
    rock.rotation.set(Math.random(),Math.random()*2,Math.random());
    rock.castShadow=true;rock.receiveShadow=true;scene.add(rock);
  }

  const fireflyGeo = new THREE.BufferGeometry();
  const count=54, positions=new Float32Array(count*3), phases=new Float32Array(count);
  for(let i=0;i<count;i++){
    positions[i*3]=(Math.random()-.5)*17;
    positions[i*3+1]=Math.random()*3.3-.1;
    positions[i*3+2]=-2+Math.random()*4;
    phases[i]=Math.random()*Math.PI*2;
  }
  fireflyGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const fireflies=new THREE.Points(fireflyGeo,new THREE.PointsMaterial({color:0xf3d9a5,size:.045,transparent:true,opacity:.7,sizeAttenuation:true}));
  scene.add(fireflies);

  const pointer={x:0,y:0,tx:0,ty:0};
  window.addEventListener('pointermove',e=>{
    pointer.tx=(e.clientX/window.innerWidth-.5)*.7;
    pointer.ty=(e.clientY/window.innerHeight-.5)*.28;
  },{passive:true});
  const resize=()=>{
    const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);
    renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(host);resize();
  let frame=0,raf=0;
  const draw=()=>{
    raf=requestAnimationFrame(draw);frame++;
    pointer.x+=(pointer.tx-pointer.x)*.025;pointer.y+=(pointer.ty-pointer.y)*.025;
    camera.position.x=pointer.x;
    camera.position.y=1.25-pointer.y;
    camera.lookAt(pointer.x*.22,-.2,-1.5);
    if(!reduced){
      leaves.rotation.y=Math.sin(frame*.0012)*.006;
      fireflies.material.opacity=.46+Math.sin(frame*.035)*.18;
      const p=fireflyGeo.attributes.position;
      for(let i=0;i<count;i++)p.array[i*3+1]+=.0008*Math.sin(frame*.012+phases[i]);
      p.needsUpdate=true;
    }
    renderer.render(scene,camera);
  };
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else if(!reduced)draw();});
  draw();
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);renderer.dispose();},{once:true});
})();
