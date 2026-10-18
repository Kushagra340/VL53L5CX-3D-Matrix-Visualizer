// --- Three.js Setup ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0b0f19, 0.0015);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
// Zoomed out camera so tall bars don't go off-window
camera.position.set(0, 500, 500);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 + 0.1;

// Lighting - Made much brighter!
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5, 2000);
pointLight.position.set(0, 600, 0);
scene.add(pointLight);

// Create 8x8 Grid of bars
const gridSize = 8;
const spacing = 30;
const offset = (gridSize * spacing) / 2 - (spacing / 2);

const bars = [];
const geometry = new THREE.BoxGeometry(20, 1, 20); 
// Shift pivot back to bottom (grows UPWARDS)
geometry.translate(0, 0.5, 0);

for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
        const material = new THREE.MeshPhongMaterial({
            color: 0x4facfe,
            transparent: true,
            opacity: 0.95,
            shininess: 150
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x * spacing - offset, 0, y * spacing - offset);
        
        scene.add(mesh);
        bars.push(mesh);
    }
}

// Add a cool base plane
const planeGeo = new THREE.PlaneGeometry(800, 800);
const planeMat = new THREE.MeshBasicMaterial({ color: 0x1d2438, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = Math.PI / 2;
plane.position.y = -1;
scene.add(plane);

// Grid Helper
const gridHelper = new THREE.GridHelper(800, 32, 0x4facfe, 0x4facfe);
gridHelper.material.opacity = 0.3;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- Web Serial API Setup ---
const connectBtn = document.getElementById('connect-btn');
const statusEl = document.getElementById('status');
let port;
let reader;
let keepReading = true;

connectBtn.addEventListener('click', async () => {
    if ('serial' in navigator) {
        try {
            port = await navigator.serial.requestPort();
            await port.open({ baudRate: 115200 });
            
            statusEl.textContent = 'Status: Connected';
            statusEl.className = 'connected';
            connectBtn.style.display = 'none';

            readLoop();
        } catch (error) {
            console.error('Error opening port:', error);
            statusEl.textContent = 'Status: Connection Failed';
        }
    } else {
        alert('Web Serial API not supported in this browser. Please use Chrome or Edge.');
    }
});

async function readLoop() {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();

    let buffer = "";

    try {
        while (keepReading) {
            const { value, done } = await reader.read();
            if (done) break;
            
            buffer += value;
            let lines = buffer.split('\n');
            
            buffer = lines.pop();

            for (const line of lines) {
                const cleanLine = line.trim();
                if (cleanLine.startsWith('START,')) {
                    processData(cleanLine);
                }
            }
        }
    } catch (error) {
        console.error('Read error:', error);
    } finally {
        reader.releaseLock();
    }
}

// Data format: START,d0,d1,...,d63
function processData(line) {
    const parts = line.split(',');
    if (parts.length === 65) {
        // Values from index 1 to 64
        for (let i = 0; i < 64; i++) {
            const distance = parseInt(parts[i + 1]);
            
            if (!isNaN(distance)) {
                // Direct mapping: 10mm = 1 unit
                // Closer objects = Shorter bars
                // Farther objects = Taller bars
                let mappedHeight = Math.max(1, distance) / 10;
                
                // Cap max height so it never breaks the camera view
                if(mappedHeight > 250) mappedHeight = 250; 

                bars[i].scale.y += (mappedHeight - bars[i].scale.y) * 0.2;

                // Color mapping: closer = red/hot, farther = blue/cold
                const hue = Math.min(240, Math.max(0, (distance / 2000) * 240));
                
                // Increased Lightness from 0.5 to 0.65 to make colors much brighter!
                bars[i].material.color.setHSL(hue / 360, 1, 0.65);
            }
        }
    }
}
