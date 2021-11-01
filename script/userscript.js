const width = 600;
const height = 400;
const fov = 60;
const aspect = width / height;
const near = 1;
const far = 100000;

const heightLegH = 750;
const heightLegL = 350;

const offsetLegX = 80;
const offsetLegZ = 120;

const positionNumComponents = 3;
const normalNumComponents = 3;
const uvNumComponents = 2;

let flgLeg = 'M4';
let flgFace = 'N';

let flgEdge = 0;
let degEdge = 90;

let faceX = 1200;
let faceY = 　28;
let faceZ = 700;
let heightLeg = heightLegH;

let DrawModel = function () {
    const canvas = document.querySelector('#three');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
     
    renderer.shadowMap.enabled = true;
    renderer.setSize( width, height );

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0);

    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 1000, 2500 );

    const controls = new THREE.OrbitControls(camera, document.getElementById('three'));

    const light = new THREE.PointLight(0xFFFFFF, 0.25, 1000000, 0.5);
    
    light.position.set(1500, 2000, 1000);
    light.castShadow = true;
    scene.add(light);

    let  ambientLight = new THREE.AmbientLight( 0xffffff, 0.7 );
    scene.add(  ambientLight );

    let edgeZ = 0; 
    let edgeX = 0;

    let verticesFace = [
      // top
      { pos: [          faceX / 2, faceY + heightLeg,         -faceZ / 2], norm: [ 0,  1,  0], uv: [0, 0], }, //a 0
      { pos: [        - faceX / 2, faceY + heightLeg,         -faceZ / 2], norm: [ 0,  1,  0], uv: [1, 0], }, //b 1
      { pos: [          faceX / 2, faceY + heightLeg,          faceZ / 2], norm: [ 0,  1,  0], uv: [0, 1], }, //c 2
      { pos: [        - faceX / 2, faceY + heightLeg,          faceZ / 2], norm: [ 0,  1,  0], uv: [1, 1], }, //d 3

      // right
      { pos: [          faceX / 2, faceY + heightLeg,          faceZ / 2], norm: [ 1, -1,  0], uv: [1, 0], }, //c 4
      { pos: [- edgeX + faceX / 2,         heightLeg, -edgeZ + faceZ / 2], norm: [ 1, -1,  0], uv: [0, 1], }, //e 5
      { pos: [          faceX / 2, faceY + heightLeg,        - faceZ / 2], norm: [ 1, -1,  0], uv: [1, 1], }, //a 6
      { pos: [- edgeX + faceX / 2,         heightLeg,  edgeZ - faceZ / 2], norm: [ 1, -1,  0], uv: [0, 0], }, //g 7
      
      // bottom
      { pos: [- edgeX + faceX / 2,         heightLeg, -edgeZ + faceZ / 2], norm: [ 0, -1,  0], uv: [0, 0], }, //e 8
      { pos: [  edgeX - faceX / 2,         heightLeg, -edgeZ + faceZ / 2], norm: [ 0, -1,  0], uv: [1, 0], }, //f 9
      { pos: [- edgeX + faceX / 2,         heightLeg,  edgeZ - faceZ / 2], norm: [ 0, -1,  0], uv: [0, 1], }, //g 10
      { pos: [  edgeX - faceX / 2,         heightLeg,  edgeZ - faceZ / 2], norm: [ 0, -1,  0], uv: [1, 1], }, //h 11
      
      // left
      { pos: [  edgeX - faceX / 2,         heightLeg,  edgeZ - faceZ / 2], norm: [-1, -1,  0], uv: [0, 1], }, //h 12
      { pos: [  edgeX - faceX / 2,         heightLeg, -edgeZ + faceZ / 2], norm: [-1, -1,  0], uv: [0, 0], }, //f 13
      { pos: [        - faceX / 2, faceY + heightLeg,         -faceZ / 2], norm: [-1, -1,  0], uv: [1, 0], }, //b 14
      { pos: [        - faceX / 2, faceY + heightLeg,          faceZ / 2], norm: [-1, -1,  0], uv: [1, 1], }, //d 15
      
      // front
      { pos: [- edgeX + faceX / 2,         heightLeg, -edgeZ + faceZ / 2], norm: [ 0,  0,  1], uv: [0, 0], }, //e 16
      { pos: [          faceX / 2, faceY + heightLeg,          faceZ / 2], norm: [ 0,  0,  1], uv: [0, 1], }, //c 18
      { pos: [  edgeX - faceX / 2,         heightLeg, -edgeZ + faceZ / 2], norm: [ 0,  0,  1], uv: [1, 0], }, //f 17
      { pos: [        - faceX / 2, faceY + heightLeg,          faceZ / 2], norm: [ 0,  0,  1], uv: [1, 1], }, //f 19
      
      // back
      { pos: [         faceX / 2, faceY + heightLeg,         -faceZ / 2], norm: [ 0,  0, -1], uv: [0, 0], }, //b 20
      { pos: [-edgeX + faceX / 2,         heightLeg,  edgeZ - faceZ / 2], norm: [ 0,  0, -1], uv: [0, 1], }, //e 22
      { pos: [        -faceX / 2, faceY + heightLeg,         -faceZ / 2], norm: [ 0,  0, -1], uv: [1, 0], }, //a 21
      { pos: [ edgeX - faceX / 2,         heightLeg,  edgeZ - faceZ / 2], norm: [ 0,  0, -1], uv: [1, 1], }, //f 23
    ];

    var positions = [];
    var normals = [];
    var uvs = [];
    for (var vertex of verticesFace) {
      positions.push(...vertex.pos);
      normals.push(...vertex.norm);
      uvs.push(...vertex.uv);
    }
    const geometryFace = new THREE.BufferGeometry();

    geometryFace.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
    geometryFace.setAttribute(
      'normal',
      new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
    geometryFace.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));

    geometryFace.setIndex([
         0,   1,   2,   2,   1,   3,
         4,   5,   6,   6,   5,   7,
         8,   9,  10,  10,   9,  11,
        12,  13,  14,  14,  13,  15,
        16,  17,  18,  18,  17,  19,
        20,  21,  22,  22,  21,  23,
    ]);

    const materialFace = new THREE.MeshPhongMaterial( { color: 0xaaaaaa } );
    const meshFace = new THREE.Mesh( geometryFace, materialFace );
    meshFace.castShadow = true;
    scene.add( meshFace );
  
  if(flgLeg == 'M4'){
  //金属4本脚
    const legX = 50;
    const legZ = 50;

    let outsideX = (faceX + legX) / 2 - offsetLegX;
    let  insideX = (faceX - legX) / 2 - offsetLegX;
    let outsideZ = (faceZ + legZ) / 2 - offsetLegZ;
    let  insideZ = (faceZ - legZ) / 2 - offsetLegZ;

    let verticesLeg = [
      // leg1
      //top
      { pos: [- outsideX, heightLeg, - outsideZ], norm: [ 0, 1, 0], uv: [0,0], },
      { pos: [- outsideX, heightLeg, -  insideZ], norm: [ 0, 1, 0], uv: [0,0], },
      { pos: [-  insideX, heightLeg, - outsideZ], norm: [ 0, 1, 0], uv: [0,0], },
      { pos: [-  insideX, heightLeg, -  insideZ], norm: [ 0, 1, 0], uv: [0,0], },
      
      //bottom
      { pos: [- outsideX,         0, - outsideZ], norm: [ 0,-1, 0], uv: [0,0], },
      { pos: [-  insideX,         0, - outsideZ], norm: [ 0,-1, 0], uv: [0,0], },
      { pos: [- outsideX,         0, -  insideZ], norm: [ 0,-1, 0], uv: [0,0], },
      { pos: [-  insideX,         0, -  insideZ], norm: [ 0,-1, 0], uv: [0,0], },
      
      //right
      { pos: [-  insideX, heightLeg, - outsideZ], norm: [ 1, 0, 0], uv: [0,0], },
      { pos: [-  insideX, heightLeg, -  insideZ], norm: [ 1, 0, 0], uv: [0,0], },
      { pos: [-  insideX,         0, - outsideZ], norm: [ 1, 0, 0], uv: [0,0], },
      { pos: [-  insideX,         0, -  insideZ], norm: [ 1, 0, 0], uv: [0,0], },
      
      //left
      { pos: [- outsideX, heightLeg, - outsideZ], norm: [-1, 0, 0], uv: [0,0], },
      { pos: [- outsideX,         0, - outsideZ], norm: [-1, 0, 0], uv: [0,0], },
      { pos: [- outsideX, heightLeg, -  insideZ], norm: [-1, 0, 0], uv: [0,0], },
      { pos: [- outsideX,         0, -  insideZ], norm: [-1, 0, 0], uv: [0,0], },
      
      //front
      { pos: [- outsideX, heightLeg, -  insideZ], norm: [ 0, 0, 1], uv: [0,0], },
      { pos: [- outsideX,         0, -  insideZ], norm: [ 0, 0, 1], uv: [0,0], },
      { pos: [-  insideX, heightLeg, -  insideZ], norm: [ 0, 0, 1], uv: [0,0], },
      { pos: [-  insideX,         0, -  insideZ], norm: [ 0, 0, 1], uv: [0,0], },
      
      //back
      { pos: [- outsideX, heightLeg, - outsideZ], norm: [ 0, 0,-1], uv: [0,0], },
      { pos: [-  insideX, heightLeg, - outsideZ], norm: [ 0, 0,-1], uv: [0,0], },
      { pos: [- outsideX,         0, - outsideZ], norm: [ 0, 0,-1], uv: [0,0], },
      { pos: [-  insideX,         0, - outsideZ], norm: [ 0, 0,-1], uv: [0,0], },

      // leg2
      //top
      { pos: [  outsideX, heightLeg, - outsideZ], norm: [ 0, 1, 0], uv: [0,0], },
      { pos: [   insideX, heightLeg, - outsideZ], norm: [ 0, 1, 0], uv: [0,0], },
      { pos: [  outsideX, heightLeg, -  insideZ], norm: [ 0, 1, 0], uv: [0,0], },
      { pos: [   insideX, heightLeg, -  insideZ], norm: [ 0, 1, 0], uv: [0,0], },
      
      //bottom
      { pos: [  outsideX,         0, - outsideZ], norm: [ 0,-1, 0], uv: [0,0], },
      { pos: [  outsideX,         0, -  insideZ], norm: [ 0,-1, 0], uv: [0,0], },
      { pos: [   insideX,         0, - outsideZ], norm: [ 0,-1, 0], uv: [0,0], },
      { pos: [   insideX,         0, -  insideZ], norm: [ 0,-1, 0], uv: [0,0], },
      
      //right
      { pos: [   insideX, heightLeg, - outsideZ], norm: [-1, 0, 0], uv: [0,0], },
      { pos: [   insideX,         0, - outsideZ], norm: [-1, 0, 0], uv: [0,0], },
      { pos: [   insideX, heightLeg, -  insideZ], norm: [-1, 0, 0], uv: [0,0], },
      { pos: [   insideX,         0, -  insideZ], norm: [-1, 0, 0], uv: [0,0], },
      
      //left
      { pos: [  outsideX, heightLeg, - outsideZ], norm: [ 1, 0, 0], uv: [0,0], },
      { pos: [  outsideX, heightLeg, -  insideZ], norm: [ 1, 0, 0], uv: [0,0], },
      { pos: [  outsideX,         0, - outsideZ], norm: [ 1, 0, 0], uv: [0,0], },
      { pos: [  outsideX,         0, -  insideZ], norm: [ 1, 0, 0], uv: [0,0], },
      
      //front
      { pos: [  outsideX, heightLeg, -  insideZ], norm: [ 0, 0, 1], uv: [0,0], },
      { pos: [   insideX, heightLeg, -  insideZ], norm: [ 0, 0, 1], uv: [0,0], },
      { pos: [  outsideX,         0, -  insideZ], norm: [ 0, 0, 1], uv: [0,0], },
      { pos: [   insideX,         0, -  insideZ], norm: [ 0, 0, 1], uv: [0,0], },
      
      //back
      { pos: [  outsideX, heightLeg, - outsideZ], norm: [ 0, 0,-1], uv: [0,0], },
      { pos: [  outsideX,         0, - outsideZ], norm: [ 0, 0,-1], uv: [0,0], },
      { pos: [   insideX, heightLeg, - outsideZ], norm: [ 0, 0,-1], uv: [0,0], },
      { pos: [   insideX,         0, - outsideZ], norm: [ 0, 0,-1], uv: [0,0], },

      // leg3
      //top
      { pos: [- outsideX, heightLeg,    insideZ], norm: [ 0, 1, 0], uv: [0,0], },
      { pos: [- outsideX, heightLeg,   outsideZ], norm: [ 0, 1, 0], uv: [0,0], },
      { pos: [-  insideX, heightLeg,    insideZ], norm: [ 0, 1, 0], uv: [0,0], },
      { pos: [-  insideX, heightLeg,   outsideZ], norm: [ 0, 1, 0], uv: [0,0], },
      
      //bottom
      { pos: [- outsideX,         0,    insideZ], norm: [ 0,-1, 0], uv: [0,0], },
      { pos: [-  insideX,         0,    insideZ], norm: [ 0,-1, 0], uv: [0,0], },
      { pos: [- outsideX,         0,   outsideZ], norm: [ 0,-1, 0], uv: [0,0], },
      { pos: [-  insideX,         0,   outsideZ], norm: [ 0,-1, 0], uv: [0,0], },
      
      //right
      { pos: [-  insideX, heightLeg,    insideZ], norm: [ 1, 0, 0], uv: [0,0], },
      { pos: [-  insideX, heightLeg,   outsideZ], norm: [ 1, 0, 0], uv: [0,0], },
      { pos: [-  insideX,         0,    insideZ], norm: [ 1, 0, 0], uv: [0,0], },
      { pos: [-  insideX,         0,   outsideZ], norm: [ 1, 0, 0], uv: [0,0], },
      
      //left
      { pos: [- outsideX, heightLeg,    insideZ], norm: [-1, 0, 0], uv: [0,0], },
      { pos: [- outsideX,         0,    insideZ], norm: [-1, 0, 0], uv: [0,0], },
      { pos: [- outsideX, heightLeg,   outsideZ], norm: [-1, 0, 0], uv: [0,0], },
      { pos: [- outsideX,         0,   outsideZ], norm: [-1, 0, 0], uv: [0,0], },
      
      //front
      { pos: [- outsideX, heightLeg,   outsideZ], norm: [ 0, 0, 1], uv: [0,0], },
      { pos: [- outsideX,         0,   outsideZ], norm: [ 0, 0, 1], uv: [0,0], },
      { pos: [-  insideX, heightLeg,   outsideZ], norm: [ 0, 0, 1], uv: [0,0], },
      { pos: [-  insideX,         0,   outsideZ], norm: [ 0, 0, 1], uv: [0,0], },
      
      //back
      { pos: [- outsideX, heightLeg,    insideZ], norm: [ 0, 0,-1], uv: [0,0], },
      { pos: [-  insideX, heightLeg,    insideZ], norm: [ 0, 0,-1], uv: [0,0], },
      { pos: [- outsideX,         0,    insideZ], norm: [ 0, 0,-1], uv: [0,0], },
      { pos: [-  insideX,         0,    insideZ], norm: [ 0, 0,-1], uv: [0,0], },

      // leg4
      //top
      { pos: [  outsideX, heightLeg,    insideZ], norm: [ 0, 1, 0], uv: [0,0], },
      { pos: [   insideX, heightLeg,    insideZ], norm: [ 0, 1, 0], uv: [0,0], },
      { pos: [  outsideX, heightLeg,   outsideZ], norm: [ 0, 1, 0], uv: [0,0], },
      { pos: [   insideX, heightLeg,   outsideZ], norm: [ 0, 1, 0], uv: [0,0], },
      
      //bottom
      { pos: [  outsideX,         0,    insideZ], norm: [ 0,-1, 0], uv: [0,0], },
      { pos: [  outsideX,         0,   outsideZ], norm: [ 0,-1, 0], uv: [0,0], },
      { pos: [   insideX,         0,    insideZ], norm: [ 0,-1, 0], uv: [0,0], },
      { pos: [   insideX,         0,   outsideZ], norm: [ 0,-1, 0], uv: [0,0], },
      
      //right
      { pos: [   insideX, heightLeg,    insideZ], norm: [-1, 0, 0], uv: [0,0], },
      { pos: [   insideX,         0,    insideZ], norm: [-1, 0, 0], uv: [0,0], },
      { pos: [   insideX, heightLeg,   outsideZ], norm: [-1, 0, 0], uv: [0,0], },
      { pos: [   insideX,         0,   outsideZ], norm: [-1, 0, 0], uv: [0,0], },
      
      //left
      { pos: [  outsideX, heightLeg,    insideZ], norm: [ 1, 0, 0], uv: [0,0], },
      { pos: [  outsideX, heightLeg,   outsideZ], norm: [ 1, 0, 0], uv: [0,0], },
      { pos: [  outsideX,         0,    insideZ], norm: [ 1, 0, 0], uv: [0,0], },
      { pos: [  outsideX,         0,   outsideZ], norm: [ 1, 0, 0], uv: [0,0], },
      
      //front
      { pos: [  outsideX, heightLeg,   outsideZ], norm: [ 0, 0, 1], uv: [0,0], },
      { pos: [   insideX, heightLeg,   outsideZ], norm: [ 0, 0, 1], uv: [0,0], },
      { pos: [  outsideX,         0,   outsideZ], norm: [ 0, 0, 1], uv: [0,0], },
      { pos: [   insideX,         0,   outsideZ], norm: [ 0, 0, 1], uv: [0,0], },
      
      //back
      { pos: [  outsideX, heightLeg,    insideZ], norm: [ 0, 0,-1], uv: [0,0], },
      { pos: [  outsideX,         0,    insideZ], norm: [ 0, 0,-1], uv: [0,0], },
      { pos: [   insideX, heightLeg,    insideZ], norm: [ 0, 0,-1], uv: [0,0], },
      { pos: [   insideX,         0,    insideZ], norm: [ 0, 0,-1], uv: [0,0], },
    ];
    var positions = [];
    var normals = [];
    var uvs = [];
    for (var vertex of verticesLeg) {
      positions.push(...vertex.pos);
      normals.push(...vertex.norm);
      uvs.push(...vertex.uv);
    }
    const geometryLeg = new THREE.BufferGeometry();

    geometryLeg.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
    geometryLeg.setAttribute(
      'normal',
      new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
    geometryLeg.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));

    geometryLeg.setIndex([
         0,   1,   2,   2,   1,   3,
         4,   5,   6,   6,   5,   7,
         8,   9,  10,  10,   9,  11,
        12,  13,  14,  14,  13,  15,
        16,  17,  18,  18,  17,  19,
        20,  21,  22,  22,  21,  23,

        24,  25,  26,  26,  25,  27,
        28,  29,  30,  30,  29,  31,
        32,  33,  34,  34,  33,  35,
        36,  37,  38,  38,  37,  39,
        40,  41,  42,  42,  41,  43,
        44,  45,  46,  46,  45,  47,

        48,  49,  50,  50,  49,  51,
        52,  53,  54,  54,  53,  55,
        56,  57,  58,  58,  57,  59,
        60,  61,  62,  62,  61,  63,
        64,  65,  66,  66,  65,  67,
        68,  69,  70,  70,  69,  71,

        72,  73,  74,  74,  73,  75,
        76,  77,  78,  78,  77,  79,
        80,  81,  82,  82,  81,  83,
        84,  85,  86,  86,  85,  87,
        88,  89,  90,  90,  89,  91,
        92,  93,  94,  94,  93,  95,
    ]);

    const materialLeg = new THREE.MeshPhongMaterial( { color: 0x555555 } );
    const meshLeg = new THREE.Mesh( geometryLeg, materialLeg );
    meshLeg.castShadow = true;
    scene.add( meshLeg );
 
  }else if(flgLeg == 'MX'){
    let xRange = faceX / 2 - 150; 
    let verticesLegB = [
      // side +
      // joint
      { pos: [ -50 + xRange, heightLegH - 1, -250], norm: [ 0, -1, 0], uv: [0, 0], }, //0
      { pos: [  50 + xRange, heightLegH - 1, -250], norm: [ 0, -1, 0], uv: [1, 0], }, //1
      { pos: [ -50 + xRange, heightLegH - 1,  250], norm: [ 0, -1, 0], uv: [0, 1], }, //2
      { pos: [  50 + xRange, heightLegH - 1,  250], norm: [ 0, -1, 0], uv: [1, 1], }, //3
      
      // leg-1
      // top
      { pos: [ -35 + xRange,     heightLegH,  250], norm: [ 0, 1, 0], uv: [0, 0], }, //a 4
      { pos: [ -35 + xRange,     heightLegH,  300], norm: [ 0, 1, 0], uv: [0, 1], }, //b 5 
      { pos: [  35 + xRange,     heightLegH,  250], norm: [ 0, 1, 0], uv: [1, 0], }, //c 6
      { pos: [  35 + xRange,     heightLegH,  300], norm: [ 0, 1, 0], uv: [1, 1], }, //d 7
      
      // right
      { pos: [  35 + xRange,     heightLegH,  250], norm: [ 1, 0, 0], uv: [0, 0], }, //c 8
      { pos: [  35 + xRange,     heightLegH,  300], norm: [ 1, 0, 0], uv: [0, 1], }, //d 9
      { pos: [  35 + xRange,              0, -250], norm: [ 1, 0, 0], uv: [1, 0], }, //e 10
      { pos: [  35 + xRange,              0, -200], norm: [ 1, 0, 0], uv: [1, 1], }, //f 11
      
      // bottom
      { pos: [  35 + xRange,              0, -250], norm: [ 0,-1, 0], uv: [0, 0], }, //e 12
      { pos: [  35 + xRange,              0, -200], norm: [ 0,-1, 0], uv: [0, 1], }, //f 13
      { pos: [ -35 + xRange,              0, -250], norm: [ 0,-1, 0], uv: [1, 0], }, //g 14
      { pos: [ -35 + xRange,              0, -200], norm: [ 0,-1, 0], uv: [1, 1], }, //h 15
      
      // left
      { pos: [ -35 + xRange,              0, -250], norm: [-1, 0, 0], uv: [0, 0], }, //g 16
      { pos: [ -35 + xRange,              0, -200], norm: [-1, 0, 0], uv: [0, 1], }, //h 17
      { pos: [ -35 + xRange,     heightLegH,  250], norm: [-1, 0, 0], uv: [1, 0], }, //a 18
      { pos: [ -35 + xRange,     heightLegH,  300], norm: [-1, 0, 0], uv: [1, 1], }, //b 19
      
      // front
      { pos: [  35 + xRange,              0, -200], norm: [ 0, 0, 1], uv: [0, 0], }, //f 20
      { pos: [  35 + xRange,     heightLegH,  300], norm: [ 0, 0, 1], uv: [0, 1], }, //d 21
      { pos: [ -35 + xRange,              0, -200], norm: [ 0, 0, 1], uv: [1, 0], }, //h 22
      { pos: [ -35 + xRange,     heightLegH,  300], norm: [ 0, 0, 1], uv: [1, 1], }, //b 23
      
      // back
      { pos: [  35 + xRange,     heightLegH,  250], norm: [ 0, 0,-1], uv: [0, 0], }, //c 24
      { pos: [  35 + xRange,              0, -250], norm: [ 0, 0,-1], uv: [0, 1], }, //e 25
      { pos: [ -35 + xRange,     heightLegH,  250], norm: [ 0, 0,-1], uv: [1, 0], }, //a 25
      { pos: [ -35 + xRange,              0, -250], norm: [ 0, 0,-1], uv: [1, 1], }, //g 27
    
      // leg-2
      // top
      { pos: [ -35 + xRange,     heightLegH, -250], norm: [ 0, 1, 0], uv: [0, 0], }, //a 28
      { pos: [  35 + xRange,     heightLegH, -250], norm: [ 0, 1, 0], uv: [1, 0], }, //b 29
      { pos: [ -35 + xRange,     heightLegH, -300], norm: [ 0, 1, 0], uv: [0, 1], }, //c 30
      { pos: [  35 + xRange,     heightLegH, -300], norm: [ 0, 1, 0], uv: [1, 1], }, //d 31
      
      // right
      { pos: [  35 + xRange,     heightLegH, -250], norm: [ 1, 0, 0], uv: [0, 0], }, //b 32
      { pos: [  35 + xRange,              0,  250], norm: [ 1, 0, 0], uv: [1, 0], }, //e 33
      { pos: [  35 + xRange,     heightLegH, -300], norm: [ 1, 0, 0], uv: [0, 1], }, //d 34
      { pos: [  35 + xRange,              0,  200], norm: [ 1, 0, 0], uv: [1, 1], }, //g 35
      
      // bottom
      { pos: [  35 + xRange,              0,  250], norm: [ 0,-1, 0], uv: [0, 0], }, //e 36
      { pos: [ -35 + xRange,              0,  250], norm: [ 0,-1, 0], uv: [1, 0], }, //f 37
      { pos: [  35 + xRange,              0,  200], norm: [ 0,-1, 0], uv: [0, 1], }, //g 38
      { pos: [ -35 + xRange,              0,  200], norm: [ 0,-1, 0], uv: [1, 1], }, //h 39
      
      // left
      { pos: [ -35 + xRange,              0,  250], norm: [-1, 0, 0], uv: [0, 0], }, //f 40
      { pos: [ -35 + xRange,     heightLegH, -250], norm: [-1, 0, 0], uv: [1, 0], }, //a 41
      { pos: [ -35 + xRange,              0,  200], norm: [-1, 0, 0], uv: [0, 1], }, //h 42
      { pos: [ -35 + xRange,     heightLegH, -300], norm: [-1, 0, 0], uv: [1, 1], }, //c 43
      
      // front
      { pos: [  35 + xRange,              0,  200], norm: [ 0, 0,-1], uv: [0, 0], }, //g 44
      { pos: [ -35 + xRange,              0,  200], norm: [ 0, 0,-1], uv: [1, 0], }, //h 45
      { pos: [  35 + xRange,     heightLegH, -300], norm: [ 0, 0,-1], uv: [0, 1], }, //d 46
      { pos: [ -35 + xRange,     heightLegH, -300], norm: [ 0, 0,-1], uv: [1, 1], }, //c 47
      
      // back
      { pos: [  35 + xRange,     heightLegH, -250], norm: [ 0, 0, 1], uv: [0, 0], }, //b 48
      { pos: [ -35 + xRange,     heightLegH, -250], norm: [ 0, 0, 1], uv: [1, 0], }, //a 49
      { pos: [  35 + xRange,              0,  250], norm: [ 0, 0, 1], uv: [0, 1], }, //e 50
      { pos: [ -35 + xRange,              0,  250], norm: [ 0, 0, 1], uv: [1, 1], }, //f 51
      
      // side -
      // joint
      { pos: [ -70 - xRange, heightLegH - 1, -300], norm: [ 0,-1, 0], uv: [0, 0], }, //52
      { pos: [  70 - xRange, heightLegH - 1, -300], norm: [ 0,-1, 0], uv: [1, 0], }, //53
      { pos: [ -70 - xRange, heightLegH - 1,  300], norm: [ 0,-1, 0], uv: [0, 1], }, //54
      { pos: [  70 - xRange, heightLegH - 1,  300], norm: [ 0,-1, 0], uv: [1, 1], }, //55
      
      // leg-1
      // top
      { pos: [ -35 - xRange,     heightLegH,  250], norm: [ 0, 1, 0], uv: [0, 0], }, //a 56
      { pos: [ -35 - xRange,     heightLegH,  300], norm: [ 0, 1, 0], uv: [0, 1], }, //c 58
      { pos: [  35 - xRange,     heightLegH,  250], norm: [ 0, 1, 0], uv: [1, 0], }, //b 57
      { pos: [  35 - xRange,     heightLegH,  300], norm: [ 0, 1, 0], uv: [1, 1], }, //d 59
      
      // right
      { pos: [  35 - xRange,     heightLegH,  250], norm: [ 1, 0, 0], uv: [0, 0], }, //b 60
      { pos: [  35 - xRange,     heightLegH,  300], norm: [ 1, 0, 0], uv: [0, 1], }, //d 62
      { pos: [  35 - xRange,              0, -250], norm: [ 1, 0, 0], uv: [1, 0], }, //e 61
      { pos: [  35 - xRange,              0, -200], norm: [ 1, 0, 0], uv: [1, 1], }, //g 63
      
      // bottom
      { pos: [  35 - xRange,              0, -250], norm: [ 0,-1, 0], uv: [0, 0], }, //e 64
      { pos: [  35 - xRange,              0, -200], norm: [ 0,-1, 0], uv: [0, 1], }, //g 66
      { pos: [ -35 - xRange,              0, -250], norm: [ 0,-1, 0], uv: [1, 0], }, //f 65
      { pos: [ -35 - xRange,              0, -200], norm: [ 0,-1, 0], uv: [1, 1], }, //h 67
      
      // left
      { pos: [ -35 - xRange,              0, -250], norm: [-1, 0, 0], uv: [0, 0], }, //f 68
      { pos: [ -35 - xRange,              0, -200], norm: [-1, 0, 0], uv: [0, 1], }, //h 70
      { pos: [ -35 - xRange,     heightLegH,  250], norm: [-1, 0, 0], uv: [1, 0], }, //a 89
      { pos: [ -35 - xRange,     heightLegH,  300], norm: [-1, 0, 0], uv: [1, 1], }, //c 71
      
      // front
      { pos: [  35 - xRange,              0, -200], norm: [ 0, 0, 1], uv: [0, 0], }, //g 72
      { pos: [  35 - xRange,     heightLegH,  300], norm: [ 0, 0, 1], uv: [0, 1], }, //d 74
      { pos: [ -35 - xRange,              0, -200], norm: [ 0, 0, 1], uv: [1, 0], }, //h 73
      { pos: [ -35 - xRange,     heightLegH,  300], norm: [ 0, 0, 1], uv: [1, 1], }, //c 75
      
      // back
      { pos: [  35 - xRange,     heightLegH,  250], norm: [ 0, 0,-1], uv: [0, 0], }, //b 76
      { pos: [  35 - xRange,              0, -250], norm: [ 0, 0,-1], uv: [0, 1], }, //e 78
      { pos: [ -35 - xRange,     heightLegH,  250], norm: [ 0, 0,-1], uv: [1, 0], }, //a 77
      { pos: [ -35 - xRange,              0, -250], norm: [ 0, 0,-1], uv: [1, 1], }, //f 79
      
      // leg-2
      // top
      { pos: [ -35 - xRange,     heightLegH, -250], norm: [ 0, 1, 0], uv: [0, 0], }, //a 80
      { pos: [  35 - xRange,     heightLegH, -250], norm: [ 0, 1, 0], uv: [1, 0], }, //b 81
      { pos: [ -35 - xRange,     heightLegH, -300], norm: [ 0, 1, 0], uv: [0, 1], }, //c 82
      { pos: [  35 - xRange,     heightLegH, -300], norm: [ 0, 1, 0], uv: [1, 1], }, //d 83
      
      // right
      { pos: [  35 - xRange,     heightLegH, -250], norm: [ 1, 0, 0], uv: [0, 0], }, //b 84
      { pos: [  35 - xRange,              0,  250], norm: [ 1, 0, 0], uv: [1, 0], }, //e 85
      { pos: [  35 - xRange,     heightLegH, -300], norm: [ 1, 0, 0], uv: [0, 1], }, //d 86
      { pos: [  35 - xRange,              0,  200], norm: [ 1, 0, 0], uv: [1, 1], }, //g 87
      
      // bottom
      { pos: [  35 - xRange,              0,  250], norm: [ 0,-1, 0], uv: [0, 0], }, //e 88
      { pos: [ -35 - xRange,              0,  250], norm: [ 0,-1, 0], uv: [1, 0], }, //f 89
      { pos: [  35 - xRange,              0,  200], norm: [ 0,-1, 0], uv: [0, 1], }, //g 90
      { pos: [ -35 - xRange,              0,  200], norm: [ 0,-1, 0], uv: [1, 1], }, //h 91
      
      // left
      { pos: [ -35 - xRange,              0,  250], norm: [-1, 0, 0], uv: [0, 0], }, //f 92
      { pos: [ -35 - xRange,     heightLegH, -250], norm: [-1, 0, 0], uv: [1, 0], }, //a 93
      { pos: [ -35 - xRange,              0,  200], norm: [-1, 0, 0], uv: [0, 1], }, //h 94
      { pos: [ -35 - xRange,     heightLegH, -300], norm: [-1, 0, 0], uv: [1, 1], }, //c 95
      
      // front
      { pos: [  35 - xRange,              0,  200], norm: [ 0, 0,-1], uv: [0, 0], }, //g 96
      { pos: [ -35 - xRange,              0,  200], norm: [ 0, 0,-1], uv: [1, 0], }, //h 97
      { pos: [  35 - xRange,     heightLegH, -300], norm: [ 0, 0,-1], uv: [0, 1], }, //d 98
      { pos: [ -35 - xRange,     heightLegH, -300], norm: [ 0, 0,-1], uv: [1, 1], }, //c 99
      
      // back
      { pos: [  35 - xRange,     heightLegH, -250], norm: [ 0, 0, 1], uv: [0, 0], }, //b 100
      { pos: [ -35 - xRange,     heightLegH, -250], norm: [ 0, 0, 1], uv: [1, 0], }, //a 101
      { pos: [  35 - xRange,              0,  250], norm: [ 0, 0, 1], uv: [0, 1], }, //e 102
      { pos: [ -35 - xRange,              0,  250], norm: [ 0, 0, 1], uv: [1, 1], }, //f 103
    ];

    var positions = [];
    var normals = [];
    var uvs = [];
    for (var vertex of verticesLegB) {
      positions.push(...vertex.pos);
      normals.push(...vertex.norm);
      uvs.push(...vertex.uv);
    }
    const geometryLegB = new THREE.BufferGeometry();

    geometryLegB.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
    geometryLegB.setAttribute(
      'normal',
      new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
    geometryLegB.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));

    geometryLegB.setIndex([
         0,   1,   2,   2,   1,   3,
         4,   5,   6,   6,   5,   7,
         8,   9,  10,  10,   9,  11,
        12,  13,  14,  14,  13,  15,
        16,  17,  18,  18,  17,  19,
        20,  21,  22,  22,  21,  23,
        24,  25,  26,  26,  25,  27,
        28,  29,  30,  30,  29,  31,
        32,  33,  34,  34,  33,  35,
        36,  37,  38,  38,  37,  39,
        40,  41,  42,  42,  41,  43,
        44,  45,  46,  46,  45,  47,
        48,  49,  50,  50,  49,  51,
        52,  53,  54,  54,  53,  55,
        56,  57,  58,  58,  57,  59,
        60,  61,  62,  62,  61,  63,
        64,  65,  66,  66,  65,  67,
        68,  69,  70,  70,  69,  71,
        72,  73,  74,  74,  73,  75,
        76,  77,  78,  78,  77,  79,
        80,  81,  82,  82,  81,  83,
        84,  85,  86,  86,  85,  87,
        88,  89,  90,  90,  89,  91,
        92,  93,  94,  94,  93,  95,
        96,  97,  98,  98,  97,  99,
       100, 101, 102, 102, 101, 103,
    ]);
    
    const materialLegB = new THREE.MeshPhongMaterial( { color: 0x555555 } );
    
    const meshLegB = new THREE.Mesh( geometryLegB, materialLegB );
    meshLegB.castShadow = true;
    scene.add( meshLegB );
  }else if(flgLeg == 'M2'){
    let xRange = faceX / 2 - 150; 
    let verticesLegC = [
      // side +
      // joint
      { pos: [ -50 + xRange, heightLegH - 1, -250], norm: [ 0,  -1,  0], uv: [0, 0], }, //0
      { pos: [  50 + xRange, heightLegH - 1, -250], norm: [ 0,  -1,  0], uv: [1, 0], }, //1
      { pos: [ -50 + xRange, heightLegH - 1,  250], norm: [ 0,  -1,  0], uv: [0, 1], }, //2
      { pos: [  50 + xRange, heightLegH - 1,  250], norm: [ 0,  -1,  0], uv: [1, 1], }, //3
      
      // leg-1
      // top
      { pos: [ -35 + xRange,     heightLegH,  150], norm: [ 0,  1,  0], uv: [0, 0], }, //a 4
      { pos: [ -35 + xRange,     heightLegH,  200], norm: [ 0,  1,  0], uv: [0, 1], }, //b 5 
      { pos: [  35 + xRange,     heightLegH,  150], norm: [ 0,  1,  0], uv: [1, 0], }, //c 6
      { pos: [  35 + xRange,     heightLegH,  200], norm: [ 0,  1,  0], uv: [1, 1], }, //d 7
      
      // right
      { pos: [  35 + xRange,     heightLegH,  150], norm: [ 1,  0,  0], uv: [0, 0], }, //c 8
      { pos: [  35 + xRange,     heightLegH,  200], norm: [ 1,  0,  0], uv: [0, 1], }, //d 9
      { pos: [  35 + xRange,              0,  300], norm: [ 1,  0,  0], uv: [1, 0], }, //e 10
      { pos: [  35 + xRange,              0,  350], norm: [ 1,  0,  0], uv: [1, 1], }, //f 11
      
      // bottom
      { pos: [  35 + xRange,              0,  300], norm: [ 0, -1,  0], uv: [0, 0], }, //e 12
      { pos: [  35 + xRange,              0,  350], norm: [ 0, -1,  0], uv: [0, 1], }, //f 13
      { pos: [ -35 + xRange,              0,  300], norm: [ 0, -1,  0], uv: [1, 0], }, //g 14
      { pos: [ -35 + xRange,              0,  350], norm: [ 0, -1,  0], uv: [1, 1], }, //h 15
      
      // left
      { pos: [ -35 + xRange,              0,  300], norm: [-1,  0,  0], uv: [0, 0], }, //g 16
      { pos: [ -35 + xRange,              0,  350], norm: [-1,  0,  0], uv: [0, 1], }, //h 17
      { pos: [ -35 + xRange,     heightLegH,  150], norm: [-1,  0,  0], uv: [1, 0], }, //a 18
      { pos: [ -35 + xRange,     heightLegH,  200], norm: [-1,  0,  0], uv: [1, 1], }, //b 19
      
      // front
      { pos: [  35 + xRange,              0,  350], norm: [ 0,  0,  1], uv: [0, 0], }, //f 20
      { pos: [  35 + xRange,     heightLegH,  200], norm: [ 0,  0,  1], uv: [0, 1], }, //d 21
      { pos: [ -35 + xRange,              0,  350], norm: [ 0,  0,  1], uv: [1, 0], }, //h 22
      { pos: [ -35 + xRange,     heightLegH,  200], norm: [ 0,  0,  1], uv: [1, 1], }, //b 23
      
      // back
      { pos: [  35 + xRange,     heightLegH,  150], norm: [ 0,  0, -1], uv: [0, 0], }, //c 24
      { pos: [  35 + xRange,              0,  300], norm: [ 0,  0, -1], uv: [0, 1], }, //e 25
      { pos: [ -35 + xRange,     heightLegH,  150], norm: [ 0,  0, -1], uv: [1, 0], }, //a 25
      { pos: [ -35 + xRange,              0,  300], norm: [ 0,  0, -1], uv: [1, 1], }, //g 27

      // leg-2
      // top
      { pos: [ -35 + xRange,     heightLegH, -200], norm: [ 0,  1,  0], uv: [0, 0], }, //a 28
      { pos: [ -35 + xRange,     heightLegH, -150], norm: [ 0,  1,  0], uv: [0, 1], }, //b 29
      { pos: [  35 + xRange,     heightLegH, -200], norm: [ 0,  1,  0], uv: [1, 0], }, //c 30
      { pos: [  35 + xRange,     heightLegH, -150], norm: [ 0,  1,  0], uv: [1, 1], }, //d 31
      
      // right
      { pos: [  35 + xRange,     heightLegH, -200], norm: [ 1,  0,  0], uv: [0, 0], }, //c 32
      { pos: [  35 + xRange,     heightLegH, -150], norm: [ 1,  0,  0], uv: [0, 1], }, //d 33
      { pos: [  35 + xRange,              0, -350], norm: [ 1,  0,  0], uv: [1, 0], }, //e 34
      { pos: [  35 + xRange,              0, -300], norm: [ 1,  0,  0], uv: [1, 1], }, //f 35
      
      // bottom
      { pos: [  35 + xRange,              0, -350], norm: [ 0, -1,  0], uv: [0, 0], }, //e 36
      { pos: [  35 + xRange,              0, -300], norm: [ 0, -1,  0], uv: [0, 1], }, //f 37
      { pos: [ -35 + xRange,              0, -350], norm: [ 0, -1,  0], uv: [1, 0], }, //g 38
      { pos: [ -35 + xRange,              0, -300], norm: [ 0, -1,  0], uv: [1, 1], }, //h 39
      
      // left
      { pos: [ -35 + xRange,              0, -350], norm: [-1,  0,  0], uv: [0, 0], }, //g 40
      { pos: [ -35 + xRange,              0, -300], norm: [-1,  0,  0], uv: [0, 1], }, //h 41
      { pos: [ -35 + xRange,     heightLegH, -200], norm: [-1,  0,  0], uv: [1, 0], }, //a 42
      { pos: [ -35 + xRange,     heightLegH, -150], norm: [-1,  0,  0], uv: [1, 1], }, //b 43
      
      // front
      { pos: [  35 + xRange,              0, -300], norm: [ 0,  0,  1], uv: [0, 0], }, //f 44
      { pos: [  35 + xRange,     heightLegH, -150], norm: [ 0,  0,  1], uv: [0, 1], }, //d 45
      { pos: [ -35 + xRange,              0, -300], norm: [ 0,  0,  1], uv: [1, 0], }, //h 46
      { pos: [ -35 + xRange,     heightLegH, -150], norm: [ 0,  0,  1], uv: [1, 1], }, //b 47
      
      // back
      { pos: [  35 + xRange,     heightLegH, -200], norm: [ 0,  0, -1], uv: [0, 0], }, //c 48
      { pos: [  35 + xRange,              0, -350], norm: [ 0,  0, -1], uv: [0, 1], }, //e 49
      { pos: [ -35 + xRange,     heightLegH, -200], norm: [ 0,  0, -1], uv: [1, 0], }, //a 50
      { pos: [ -35 + xRange,              0, -350], norm: [ 0,  0, -1], uv: [1, 1], }, //g 51

      // side -
      // joint
      { pos: [ -70 - xRange, heightLegH - 1, -300], norm: [ 0,  -1,  0], uv: [0, 0], }, //0
      { pos: [  70 - xRange, heightLegH - 1, -300], norm: [ 0,  -1,  0], uv: [1, 0], }, //1
      { pos: [ -70 - xRange, heightLegH - 1,  300], norm: [ 0,  -1,  0], uv: [0, 1], }, //2
      { pos: [  70 - xRange, heightLegH - 1,  300], norm: [ 0,  -1,  0], uv: [1, 1], }, //3
      
      // leg-1
      // top
      { pos: [ -35 - xRange,     heightLegH,  150], norm: [ 0,  1,  0], uv: [0, 0], }, //a 4
      { pos: [ -35 - xRange,     heightLegH,  200], norm: [ 0,  1,  0], uv: [0, 1], }, //b 5 
      { pos: [  35 - xRange,     heightLegH,  150], norm: [ 0,  1,  0], uv: [1, 0], }, //c 6
      { pos: [  35 - xRange,     heightLegH,  200], norm: [ 0,  1,  0], uv: [1, 1], }, //d 7
      
      // right
      { pos: [  35 - xRange,     heightLegH,  150], norm: [ 1,  0,  0], uv: [0, 0], }, //c 8
      { pos: [  35 - xRange,     heightLegH,  200], norm: [ 1,  0,  0], uv: [0, 1], }, //d 9
      { pos: [  35 - xRange,              0,  300], norm: [ 1,  0,  0], uv: [1, 0], }, //e 10
      { pos: [  35 - xRange,              0,  350], norm: [ 1,  0,  0], uv: [1, 1], }, //f 11
      
      // bottom
      { pos: [  35 - xRange,              0,  300], norm: [ 0, -1,  0], uv: [0, 0], }, //e 12
      { pos: [  35 - xRange,              0,  350], norm: [ 0, -1,  0], uv: [0, 1], }, //f 13
      { pos: [ -35 - xRange,              0,  300], norm: [ 0, -1,  0], uv: [1, 0], }, //g 14
      { pos: [ -35 - xRange,              0,  350], norm: [ 0, -1,  0], uv: [1, 1], }, //h 15
      
      // left
      { pos: [ -35 - xRange,              0,  300], norm: [-1,  0,  0], uv: [0, 0], }, //g 16
      { pos: [ -35 - xRange,              0,  350], norm: [-1,  0,  0], uv: [0, 1], }, //h 17
      { pos: [ -35 - xRange,     heightLegH,  150], norm: [-1,  0,  0], uv: [1, 0], }, //a 18
      { pos: [ -35 - xRange,     heightLegH,  200], norm: [-1,  0,  0], uv: [1, 1], }, //b 19
      
      // front
      { pos: [  35 - xRange,              0,  350], norm: [ 0,  0,  1], uv: [0, 0], }, //f 20
      { pos: [  35 - xRange,     heightLegH,  200], norm: [ 0,  0,  1], uv: [0, 1], }, //d 21
      { pos: [ -35 - xRange,              0,  350], norm: [ 0,  0,  1], uv: [1, 0], }, //h 22
      { pos: [ -35 - xRange,     heightLegH,  200], norm: [ 0,  0,  1], uv: [1, 1], }, //b 23
      
      // back
      { pos: [  35 - xRange,     heightLegH,  150], norm: [ 0,  0, -1], uv: [0, 0], }, //c 24
      { pos: [  35 - xRange,              0,  300], norm: [ 0,  0, -1], uv: [0, 1], }, //e 25
      { pos: [ -35 - xRange,     heightLegH,  150], norm: [ 0,  0, -1], uv: [1, 0], }, //a 25
      { pos: [ -35 - xRange,              0,  300], norm: [ 0,  0, -1], uv: [1, 1], }, //g 27

      // leg-2
      // top
      { pos: [ -35 - xRange,     heightLegH, -200], norm: [ 0,  1,  0], uv: [0, 0], }, //a 28
      { pos: [ -35 - xRange,     heightLegH, -150], norm: [ 0,  1,  0], uv: [0, 1], }, //b 29
      { pos: [  35 - xRange,     heightLegH, -200], norm: [ 0,  1,  0], uv: [1, 0], }, //c 30
      { pos: [  35 - xRange,     heightLegH, -150], norm: [ 0,  1,  0], uv: [1, 1], }, //d 31
      
      // right
      { pos: [  35 - xRange,     heightLegH, -200], norm: [ 1,  0,  0], uv: [0, 0], }, //c 32
      { pos: [  35 - xRange,     heightLegH, -150], norm: [ 1,  0,  0], uv: [0, 1], }, //d 33
      { pos: [  35 - xRange,              0, -350], norm: [ 1,  0,  0], uv: [1, 0], }, //e 34
      { pos: [  35 - xRange,              0, -300], norm: [ 1,  0,  0], uv: [1, 1], }, //f 35
      
      // bottom
      { pos: [  35 - xRange,              0, -350], norm: [ 0, -1,  0], uv: [0, 0], }, //e 36
      { pos: [  35 - xRange,              0, -300], norm: [ 0, -1,  0], uv: [0, 1], }, //f 37
      { pos: [ -35 - xRange,              0, -350], norm: [ 0, -1,  0], uv: [1, 0], }, //g 38
      { pos: [ -35 - xRange,              0, -300], norm: [ 0, -1,  0], uv: [1, 1], }, //h 39
      
      // left
      { pos: [ -35 - xRange,              0, -350], norm: [-1,  0,  0], uv: [0, 0], }, //g 40
      { pos: [ -35 - xRange,              0, -300], norm: [-1,  0,  0], uv: [0, 1], }, //h 41
      { pos: [ -35 - xRange,     heightLegH, -200], norm: [-1,  0,  0], uv: [1, 0], }, //a 42
      { pos: [ -35 - xRange,     heightLegH, -150], norm: [-1,  0,  0], uv: [1, 1], }, //b 43
      
      // front
      { pos: [  35 - xRange,              0, -300], norm: [ 0,  0,  1], uv: [0, 0], }, //f 44
      { pos: [  35 - xRange,     heightLegH, -150], norm: [ 0,  0,  1], uv: [0, 1], }, //d 45
      { pos: [ -35 - xRange,              0, -300], norm: [ 0,  0,  1], uv: [1, 0], }, //h 46
      { pos: [ -35 - xRange,     heightLegH, -150], norm: [ 0,  0,  1], uv: [1, 1], }, //b 47
      
      // back
      { pos: [  35 - xRange,     heightLegH, -200], norm: [ 0,  0, -1], uv: [0, 0], }, //c 48
      { pos: [  35 - xRange,              0, -350], norm: [ 0,  0, -1], uv: [0, 1], }, //e 49
      { pos: [ -35 - xRange,     heightLegH, -200], norm: [ 0,  0, -1], uv: [1, 0], }, //a 50
      { pos: [ -35 - xRange,              0, -350], norm: [ 0,  0, -1], uv: [1, 1], }, //g 51
    ];

    var positions = [];
    var normals = [];
    var uvs = [];
    for (var vertex of verticesLegC) {
      positions.push(...vertex.pos);
      normals.push(...vertex.norm);
      uvs.push(...vertex.uv);
    }
    const geometryLegC = new THREE.BufferGeometry();

    geometryLegC.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
    geometryLegC.setAttribute(
      'normal',
      new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
    geometryLegC.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));

    geometryLegC.setIndex([
      0,   1,   2,   2,   1,   3,
      4,   5,   6,   6,   5,   7,
      8,   9,  10,  10,   9,  11,
     12,  13,  14,  14,  13,  15,
     16,  17,  18,  18,  17,  19,
     20,  21,  22,  22,  21,  23,
     24,  25,  26,  26,  25,  27,
     28,  29,  30,  30,  29,  31,
     32,  33,  34,  34,  33,  35,
     36,  37,  38,  38,  37,  39,
     40,  41,  42,  42,  41,  43,
     44,  45,  46,  46,  45,  47,
     48,  49,  50,  50,  49,  51,
     52,  53,  54,  54,  53,  55,
     56,  57,  58,  58,  57,  59,
     60,  61,  62,  62,  61,  63,
     64,  65,  66,  66,  65,  67,
     68,  69,  70,  70,  69,  71,
     72,  73,  74,  74,  73,  75,
     76,  77,  78,  78,  77,  79,
     80,  81,  82,  82,  81,  83,
     84,  85,  86,  86,  85,  87,
     88,  89,  90,  90,  89,  91,
     92,  93,  94,  94,  93,  95,
     96,  97,  98,  98,  97,  99,
    100, 101, 102, 102, 101, 103,
    ]);
    
    const materialLegC = new THREE.MeshPhongMaterial( { color: 0x555555 } );
    
    const meshLegC = new THREE.Mesh( geometryLegC, materialLegC );
    meshLegC.castShadow = true;
    scene.add( meshLegC );
  }
    let verticesFloor = [
      { pos: [  25000,  -2, -25000], norm: [ 0,  1,  0], uv: [0, 0], }, //0
      { pos: [ -25000,  -2, -25000], norm: [ 0,  1,  0], uv: [1, 0], }, //1
      { pos: [  25000,  -2,  25000], norm: [ 0,  1,  0], uv: [0, 1], }, //2
      { pos: [ -25000,  -2,  25000], norm: [ 0,  1,  0], uv: [1, 1], }, //3
    ];

    var positions = [];
    var normals = [];
    var uvs = [];
    for (var vertex of verticesFloor) {
      positions.push(...vertex.pos);
      normals.push(...vertex.norm);
      uvs.push(...vertex.uv);
    }

    const geometryFloor = new THREE.BufferGeometry();

    geometryFloor.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
    geometryFloor.setAttribute(
        'normal',
        new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
    geometryFloor.setAttribute(
        'uv',
        new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
     
    geometryFloor.setIndex([
      0, 1, 2,  2, 1, 3,  // top
    ]);

    //let geometryFloor = new THREE.PlaneGeometry( 500, 50, 1);
    let materialFloor = new THREE.MeshPhongMaterial( { color: 0xffffff, side: THREE.FrontSide } );
    let meshFloor = new THREE.Mesh( geometryFloor, materialFloor );
    meshFloor.receiveShadow = true;
    scene.add( meshFloor );

    tick();

    function tick() {
        requestAnimationFrame(tick);
        renderer.render(scene, camera);
    };
};
DrawModel();


/* OnChange使うかは別として置いておく
関数名が被ると面倒いのかも */
function OnChangeRangeX(){
  console.log('OnChangeRangeX()');
};

function OnChangeRangeY(){
  console.log('OnChangeRangeY()');
};

function OnChangeTextX(){
  console.log('OnChangeTextX()');
};

function OnChangeTextY(){
  console.log('OnChangeTextY()');
};

function OnChangeHeight(){
  console.log('OnChangeHeight()');
};

function OnChangeRadioT(param){
  console.log('OnChangeRadioT(' + param + ')');
};

/* Loading表示制御 */
window.addEventListener( 'load', function(){
    const spinner = document.getElementById('loading');
    spinner.classList.add('loaded');
}, false);

/* イベントリスナーでもいいんじゃないかと */
const toggleLeg = document.getElementById('toggleLeg');

toggleLeg.addEventListener( 'click', () => {
    console.log('toggleLeg: ' + flgLeg);
    if(flgLeg == 'M4'){
      flgLeg = 'M2';
    }else if(flgLeg == 'M2'){
      flgLeg = 'MX';
    }else{
      flgLeg = 'M4';
    }
    DrawModel();
});