const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('globe-container').appendChild(renderer.domElement);

        // --- YANGI QISM: Tekstura yuklash ---
        const textureLoader = new THREE.TextureLoader();
        // Bu yerda internetdan oq-qora yer xaritasi yuklanmoqda.
        // Oq joylar quruqlik, qora joylar okean deb hisoblanadi.
        const landTexture = textureLoader.load('https://i.imgur.com/v4cKj3O.jpg');

        // Umumiy geometriya (ikkala shar uchun ham)
        const geometry = new THREE.SphereGeometry(10, 64, 64); // Silliqroq bo'lishi uchun segmentlarni ko'paytirdik

        // 1-GLOBUS: Ko'k Simli (Wireframe) globus
        const wireframeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x0088ff,
            wireframe: true,
            transparent: true, 
            opacity: 0.15 // Chiziqlar sal xiraroq bo'lsin
        });
        const sphereWireframe = new THREE.Mesh(geometry, wireframeMaterial);
        scene.add(sphereWireframe);

        // 2-GLOBUS: Kumush Materiklar (Solid) globusi
        const silverMaterial = new THREE.MeshBasicMaterial({
            color: 0xC0C0C0, // Ochiq Kumush rang (Silver)
            
            // Eng muhim joyi: Alpha Map.
            // Yuklagan rasmimizning oq joylarini ko'rsatadi, qora joylarini shaffof qiladi.
            alphaMap: landTexture, 
            transparent: true,
            opacity: 0.7, // Materiklar biroz shaffof bo'lsin
        });
        const sphereSilverLand = new THREE.Mesh(geometry, silverMaterial);
        scene.add(sphereSilverLand);


        // Yulduzlar
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1500;
        const starPositions = new Float32Array(starCount * 3);
        for(let i=0; i<starCount*3; i++) {
            starPositions[i] = (Math.random() - 0.5) * 70;
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08 });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        camera.position.z = 18;

        // Animatsiya
        function animate() {
            requestAnimationFrame(animate);
            
            // Ikkala globusni bir xil aylantiramiz
            const rotationSpeedY = 0.002;
            const rotationSpeedX = 0.0005;

            sphereWireframe.rotation.y += rotationSpeedY;
            sphereWireframe.rotation.x += rotationSpeedX;

            // Kumush globus simli globusga aniq mos tushishi kerak
            sphereSilverLand.rotation.y = sphereWireframe.rotation.y;
            sphereSilverLand.rotation.x = sphereWireframe.rotation.x;
            
            stars.rotation.y -= 0.0002;
            
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });