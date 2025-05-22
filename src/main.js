import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './lenis.js'

gsap.registerPlugin(ScrollTrigger);

let container;
let camera;
let bottle;
let renderer;
let scene;
let model;
let pivot;
let lastRenderTime = 0;
const fps = 60;
const materials = [];
container = document.querySelector(".bottle-3d");
bottle = document.querySelector("#bottle");
scene = new THREE.Scene();
const triggers = [];

const position = 1.4;
camera = new THREE.OrthographicCamera(-position, position, position, -position, 0.1, 1000);
camera.position.set(0, 0, 1);
camera.lookAt(0, 0, 0);

renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true
});

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x46A997, 1.5);
directionalLight.position.set(0, 10, 50);
scene.add(directionalLight);

const loader = new GLTFLoader();
loader.load('/models/Bottle/Juice_Bottle.glb', function(gltf) {
    model = gltf.scene;

    model.traverse(function(node) {
        if (node.isMesh && node.material) {
            node.material.transparent = true;
            node.material.side = THREE.FrontSide;
            materials.push(node.material);
        }
    });

    console.log(model)
    model.scale.set(5, 5, 5);


    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    model.position.sub(center);

    pivot = new THREE.Group();
    pivot.add(model);
    scene.add(pivot);

    setupScrollAnimation(pivot);

}, undefined, function(error) {
    console.error(error);
});

animate();

window.addEventListener('resize', () => {
    camera.updateProjectionMatrix();
});


function animate() {
    requestAnimationFrame(animate);
    const now = Date.now();
    const delta = now - lastRenderTime;

    if (delta > 1000 / fps) {
        renderer.render(scene, camera);
        lastRenderTime = now;
    }
}

let scrollAnimationsInitialized = false;

function resetAnimations() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.killTweensOf("*");

    setupScrollAnimation();
    scrollAnimationsInitialized = true;
}

function setupScrollAnimation() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    const isDesktop = window.innerWidth > 1024;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "+=500%",
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
        }
    });

    if(isDesktop) {
        tl.fromTo(bottle, {
            x: "100vw",
            opacity: 0,
            scale: 0.8,
        }, {
            x: "-40vw",
            opacity: 1,
            scale: 0.95,
            duration: 5,
            ease: "power4.out"
        });
    } else if(isTablet) {
        tl.fromTo(bottle, {
            x: "100vw",
            opacity: 0,
            scale: 0.8,
        }, {
            x: "-40vw",
            opacity: 1,
            scale: 0.95,
            duration: 5,
            ease: "power4.out"
        });
    } else {
        tl.fromTo(bottle, {
            x: "100vw",
            opacity: 0,
            scale: 0.8,
        }, {
            x: "-30vw",
            opacity: 1,
            scale: 0.95,
            duration: 5,
            ease: "power4.out"
        });
    }

    tl.fromTo(".hero__text-box", {
        opacity: 0,
        x: 100,
    }, {
        opacity: 1,
        x: 0,
        ease: "none",
    }, 2);

    tl.fromTo("#hero-number", {
        opacity: 0,
        textContent: 0,
    }, {
        opacity: 1,
        textContent: 100,
        duration: 2,
        ease: "none",
        snap: { textContent: 1 },
    }, "<");

    if(isDesktop) {
        tl.to(bottle, {
            x: "0vw",
            scale: 2,
            duration: 4,
            ease: "power3.inOut",
        });
    } else if(isTablet) {
        tl.to(bottle, {
            x: "0vw",
            scale: 1.5,
            duration: 4,
            ease: "power3.inOut",
        });
    } else if(isMobile) {
        tl.to(bottle, {
            x: "0vw",
            scale: 1.1,
            duration: 4,
            ease: "power3.inOut",
        });
    }

    tl.to(".hero__text-box", {
        y: "-100vh",
        opacity: 0,
        duration: 2,
        ease: "power2.in"
    }, "<");

    tl.to(pivot.rotation, {
        y: Math.PI * 2,
        z: Math.PI * 2,
        duration: 4,
        ease: "none",
    }, "<");

    const tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: ".text-section",
            start: "top top",
            end: "+=500%",
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
        }
    });

    if(isDesktop) {
        tl2.to(bottle, {
            x: "30vw",
            duration: 4,
            ease: "power3.inOut",
        });
    } else if(isTablet) {
        tl2.to(bottle, {
            x: "40vw",
            duration: 4,
            ease: "power3.inOut",
        });
    } else if(isMobile) {
        tl2.to(bottle, {
            x: "40vw",
            duration: 4,
            ease: "power3.inOut",
        });
    }

    if(isDesktop) {
        tl2.to(bottle, {
            x: "-40vw",
            scale: 1.5,
            duration: 4,
            ease: "power1.inOut"
        });
    } else if(isTablet) {
        tl2.to(bottle, {
            x: "-40vw",
            scale: 1.5,
            duration: 4,
            ease: "power1.inOut"
        });
    } else {
        tl2.to(bottle, {
            x: "-50vw",
            scale: 0.8,
            duration: 4,
            ease: "power1.inOut"
        });
    }

    tl2.to(pivot.rotation, {
        y: "+=" + Math.PI * 2,
        duration: 4,
        ease: "power1.inOut"
    }, "<");

    tl2.to(".text-section__text-1", {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 3,
        ease: "power2.out",
    }, "-=2.85");

    if(isDesktop) {
        tl2.to(bottle, {
            x: "35vw",
            scale: 1.5,
            duration: 4,
            ease: "power1.inOut"
        });
    } else if(isTablet) {
        tl2.to(bottle, {
            x: "40vw",
            scale: 1.5,
            duration: 4,
            ease: "power1.inOut"
        });
    } else {
        tl2.to(bottle, {
            x: "40vw",
            scale: 1,
            duration: 4,
            ease: "power1.inOut"
        });
    }

    tl2.to(pivot.rotation, {
        y: "-=" + Math.PI * 2,
        duration: 4,
        ease: "power1.inOut"
    }, "<");

    tl2.to(".text-section__text-1", {
        clipPath: "inset(0% 100% 0% 0)",
        duration: 3,
        ease: "power2.in",
    }, "<");

    tl2.fromTo(".text-section__text-2", {
        clipPath: "inset(0% 100% 0% 0%)",
    }, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 2.8,
        ease: "power2.out"
    }, "-=2.6");

    const tl3 = gsap.timeline({
        scrollTrigger: {
            trigger: ".loader",
            start: "top top",
            end: "+=100%",
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
        }
    });

    tl3.fromTo(".loader__text", {
        opacity: 0,
        x: 100,
    }, {
        opacity: 1,
        x: 0,
        duration: 3,
        ease: "power2.out"
    }, "-=2");

    tl3.to("#juice", {
        height: "400%",
        ease: "power2.out",
        duration: 3,
    })

    const tl4 = gsap.timeline({
        scrollTrigger: {
            trigger: ".final",
            start: "top top",
            end: "+=110%",
            scrub: 1.5
        }
    });

    if(isDesktop) {
        tl4.to(bottle, {
            y: "14.5vh",
            x: "0vw",
            scale: 1.4,
            duration: 4,
            ease: "power3.inOut",
        });
    } else if(isTablet) {
        tl4.to(bottle, {
            y: "14.5vh",
            x: "0vw",
            scale: 1.4,
            duration: 4,
            ease: "power3.inOut",
        });
    } else {
        tl4.to(bottle, {
            y: "20vh",
            x: "-20vw",
            scale: 1.1,
            duration: 4,
            ease: "power3.inOut",
        });
    }

    if(isDesktop) {
        tl4.to(pivot.rotation, {
            y: 6,
            z: 12,
            duration: 10,
            ease: "none",
        }, "<");
    } else if(isTablet) {
        tl4.to(pivot.rotation, {
            y: 6,
            z: 12,
            duration: 10,
            ease: "none",
        }, "<");
    } else {
        tl4.to(pivot.rotation, {
            y: 6,
            z: 25,
            duration: 10,
            ease: "none",
        }, "<");
    }

    if(isDesktop) {
        tl4.fromTo(".final__text", {
            opacity: 0,
            x: 100,
        }, {
            opacity: 1,
            x: 0,
            duration: 1,
            delay: 2,
            ease: "power2.out"
        }, ">");
    } else if(isTablet) {
        tl4.fromTo(".final__text", {
            opacity: 0,
            x: 100,
        }, {
            opacity: 1,
            x: 0,
            duration: 3,
            ease: "power2.out"
        }, ">");
    } else if (isMobile) {
        tl4.fromTo(".final__text", {
            opacity: 0,
            x: 100,
        }, {
            opacity: 1,
            x: 0,
            duration: 5,
            ease: "power2.out"
        }, ">-1");
    }

    tl4.fromTo(".final__btn", {
        opacity: 0,
        y: 100,
    }, {
        opacity: 1,
        y: 0,
        duration: 3,
        ease: "power2.out"
    }, ">");

    tl4.fromTo(".final__second-text", {
        opacity: 0,
        x: 200,
    }, {
        opacity: 1,
        x: 0,
        duration: 3,
        ease: "power2.out"
    }, "<");
}


