import * as THREE from "three";
import { InteractionManager } from "three.interactive";
import {gsap} from "gsap";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Initialize {
    constructor() {
        const scene = new THREE.Scene();

        const size = 20;
        const division = 20;
        const GridHelper = new THREE.GridHelper(size, division);
        // scene.add(GridHelper);

        const fov = 40;
        const aspect = window.innerWidth / window.innerHeight; //canvas default
        const near = 1;
        const far = 1000;

        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(1, 2, 6);
        scene.add(camera);

        const al = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(al);

        const spotLight = new THREE.SpotLight(0xff5733, 7.5);
          spotLight.position.set(0, 2, 0);
          spotLight.angle = 0.8//spreading
          spotLight.penumbra = 1//blur in my world

          spotLight.decay = 2;
          spotLight.distance = 100;
          spotLight.castShadow = true;
        //   scene.add(spotLight);

          spotLight.shadow.mapSize.width = 1024;
          spotLight.shadow.mapSize.height = 1024;
          spotLight.shadow.camera.near = 1;
          spotLight.shadow.camera.far = 5;

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcccccc, 2);
        scene.add(hemiLight);

        const spotLightB = new THREE.SpotLight(0xffffff, 10);
        spotLightB.position.set(0, 3, 0);
        scene.add(spotLightB);

        const d1Helper = new THREE.SpotLightHelper(spotLightB);
        // scene.add(d1Helper);
        
        const floorTexture = new THREE.TextureLoader().load("assets/cement-texture.jpg");
        const geometryFloor = new THREE.PlaneGeometry(7.5, 7.5);
        const materialFloor = new THREE.MeshPhongMaterial({
          map: floorTexture, 
          side: THREE.DoubleSide  
        });
        const floor = new THREE.Mesh( geometryFloor, materialFloor );
        floor.receiveShadow = true;
        floor.rotation.x = Math.PI/2;
        // scene.add(floor);

        const texture = new THREE.TextureLoader().load("assets/crate.gif");
        const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const material = new THREE.MeshPhongMaterial({ map: texture });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // scene.add(mesh);
        mesh.position.y = .6;

        const loader = new GLTFLoader();
            loader.load("assets/models/scene.gltf", (gltf) => {
                let model = gltf.scene;
                model.position.set(0, .5, 0);
                model.scale.set(0.03, 0.03, 0.03);

                this.animationGlobe(model, camera);

                    model.traverse((n) => {
                        if (n.isMesh) {
                            n.castShadow = true;
                            // n.receiveShadow = true;
                        }
                    });
                    scene.add(model);
            })

        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });

        renderer.shadowMap.enabled = true;

        let constrols = new OrbitControls(camera, renderer.domElement);

        const interactionManager = new InteractionManager(
            renderer,
            camera,
            renderer.domElement
        )
        interactionManager.add(mesh)

        mesh.addEventListener('click', (event) => {
            gsap.to(event.target.scale, {
                duration:1,
                y: 0.15,
                x: 0.15,
                z: 0.15,
                repeat:1,
                yoyo:true,
                ease:"bounce.out"
            });
        })
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        mesh.rotation.x = 10;
        mesh.rotation.y = 10;

        renderer.render(scene, camera);
        document.body.appendChild(renderer.domElement);

        renderer.setAnimationLoop((time) => this.animation(
            time, { camera, scene, mesh, renderer }
        ));

        window.addEventListener('resize', () => this.onWindowResize(renderer, camera));

    }

    animation(time, obj) {

        obj.mesh.rotation.x = time / 1000;
        obj.mesh.rotation.y = time / 2000;
        obj.renderer.render(obj.scene, obj.camera)

    }

    onWindowResize(renderer, camera) {

        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProtjectionMatrix();
    }

    animationGlobe(model, camera) {
        gsap.to(model.rotation, {
            delay: 1,
            y: 0.5,
            x: -0.5,
            duration: 2,

            onComplete: () => {
                gsap.to(model.rotation, {
                    duration: 5,
                    y: 0.015,
                    x: 0.015,
                    z: 0.015,
                    repeat: -1,
                    yoyo: true,
                });
            },
        });
    }
}