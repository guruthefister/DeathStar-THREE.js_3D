import * as THREE from "three";
import { InteractionManager } from "three.interactive";
import {gsap} from "gsap"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export default class Initialize {
    constructor() {
        const scene = new THREE.Scene();

        const size = 20;
        const division = 20;
        const GridHelper = new THREE.GridHelper(size, division);
        scene.add(GridHelper);

        const fov = 50;
        const aspect = 2;
        const near = 0.4;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 2, 4);
        scene.add(camera);

        const geometryFloor = new THREE.PlaneGeometry(5, 5);
        const materialFloor = new THREE.MeshBasicMaterial( {color: 0xcccccc, side:
        THREE.DoubleSide} );
        const floor = new THREE.Mesh( geometryFloor, materialFloor );
        floor.rotation.x = Math.PI/2;
        scene.add( floor );

        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshNormalMaterial();

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.26
        scene.add(mesh);

        const renderer = new THREE.WebGLRenderer({ antialias:true });

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

        // mesh.rotation.x = 10;
        // mesh.rotation.y = 10;

        renderer.render(scene, camera);
        document.body.appendChild(renderer.domElement);

        renderer.setAnimationLoop((time) => this.animation(
            time, { camera, scene, mesh, renderer }
        ));

        window.addEventListener('resize', () => this.onWindowResize(renderer, camera));

    }

    animation(time, obj) {

        // obj.mesh.rotation.x = time / 1000;
        // obj.mesh.rotation.y = time / 2000;
        obj.renderer.render(obj.scene, obj.camera)

    }

    onWindowResize(renderer, camera) {

        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProtjectionMatrix();
    }
}