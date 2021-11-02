const width = 600;
const height = 400;
const fov = 60;
const aspect = width / height;
const near = 100;
const far = 100000;

const heightLegH = 720;
const heightLegL = 420;

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
let faceY = 28;
let faceZ = 700;
let heightLeg = heightLegH;

let legX;
let legZ;
let offsetX;
let jointX;
let jointZ;
let outsideX;
let outsideZ;
let insideX;
let insideZ;
let gapTopZ;
let gapBottomZ;
let inTopZ;
let outTopZ;
let inBottomZ;
let outBottomZ;
let xRange;

let verticesLeg = [];
let geometryLeg;
let materialLeg;
let meshLeg;

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
      { pos: [          faceX / 2, faceY + heightLeg,        - faceZ / 2], norm: [ 0,  1,  0], uv: [0, 0], }, //a 0
      { pos: [        - faceX / 2, faceY + heightLeg,        - faceZ / 2], norm: [ 0,  1,  0], uv: [1, 0], }, //b 1
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
      { pos: [        - faceX / 2, faceY + heightLeg,        - faceZ / 2], norm: [-1, -1,  0], uv: [1, 0], }, //b 14
      { pos: [        - faceX / 2, faceY + heightLeg,          faceZ / 2], norm: [-1, -1,  0], uv: [1, 1], }, //d 15
      
      // front
      { pos: [- edgeX + faceX / 2,         heightLeg, -edgeZ + faceZ / 2], norm: [ 0,  0,  1], uv: [0, 0], }, //e 16
      { pos: [          faceX / 2, faceY + heightLeg,          faceZ / 2], norm: [ 0,  0,  1], uv: [0, 1], }, //c 18
      { pos: [  edgeX - faceX / 2,         heightLeg, -edgeZ + faceZ / 2], norm: [ 0,  0,  1], uv: [1, 0], }, //f 17
      { pos: [        - faceX / 2, faceY + heightLeg,          faceZ / 2], norm: [ 0,  0,  1], uv: [1, 1], }, //f 19
      
      // back
      { pos: [          faceX / 2, faceY + heightLeg,        - faceZ / 2], norm: [ 0,  0, -1], uv: [0, 0], }, //b 20
      { pos: [- edgeX + faceX / 2,         heightLeg,  edgeZ - faceZ / 2], norm: [ 0,  0, -1], uv: [0, 1], }, //e 22
      { pos: [        - faceX / 2, faceY + heightLeg,        - faceZ / 2], norm: [ 0,  0, -1], uv: [1, 0], }, //a 21
      { pos: [  edgeX - faceX / 2,         heightLeg,  edgeZ - faceZ / 2], norm: [ 0,  0, -1], uv: [1, 1], }, //f 23
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
  
  switch(flgLeg){
  case 'M4': //金属4本脚
    legX = 50;
    legZ = 50;

    outsideX = (faceX + legX) / 2 - offsetLegX;
    insideX  = (faceX - legX) / 2 - offsetLegX;
    outsideZ = (faceZ + legZ) / 2 - offsetLegZ;
    insideZ  = (faceZ - legZ) / 2 - offsetLegZ;

    verticesLeg = [
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
    geometryLeg = new THREE.BufferGeometry();

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

    materialLeg = new THREE.MeshPhongMaterial( { color: 0x555555 } );
    meshLeg = new THREE.Mesh( geometryLeg, materialLeg );
    meshLeg.castShadow = true;
    scene.add( meshLeg );
    break;

  case 'M2': //金物2本脚
    legX = 50;
    legZ = 60;

    offsetX = 150;
    gapTopZ = 300;
    gapBottomZ = 600;

    jointX = 150;
    jointZ = 600;

    inTopZ  = gapTopZ / 2;
    outTopZ = inTopZ + legZ;

    inBottomZ  = gapBottomZ / 2;
    outBottomZ = inBottomZ+ legZ;

    xRange = faceX / 2 - offsetX; 
    verticesLeg = [
      // side +
      // joint
      { pos: [- jointX / 2 + xRange, heightLegH - 1, - jointZ / 2], norm: [ 0,  -1,  0], uv: [0, 0], },
      { pos: [  jointX / 2 + xRange, heightLegH - 1, - jointZ / 2], norm: [ 0,  -1,  0], uv: [1, 0], },
      { pos: [- jointX / 2 + xRange, heightLegH - 1,   jointZ / 2], norm: [ 0,  -1,  0], uv: [0, 1], },
      { pos: [  jointX / 2 + xRange, heightLegH - 1,   jointZ / 2], norm: [ 0,  -1,  0], uv: [1, 1], },

      //leg-0
      //top
      { pos: [- legX / 2 + xRange,          heightLegH, - outTopZ], norm: [ 0,  1,  0], uv: [0, 0], },
      { pos: [- legX / 2 + xRange,          heightLegH,   outTopZ], norm: [ 0,  1,  0], uv: [0, 1], },
      { pos: [  legX / 2 + xRange,          heightLegH, - outTopZ], norm: [ 0,  1,  0], uv: [1, 0], },
      { pos: [  legX / 2 + xRange,          heightLegH,   outTopZ], norm: [ 0,  1,  0], uv: [1, 1], },
      //botom
      { pos: [  legX / 2 + xRange, - legZ + heightLegH, - outTopZ], norm: [ 0, -1,  0], uv: [0, 0], },
      { pos: [  legX / 2 + xRange, - legZ + heightLegH,   outTopZ], norm: [ 0, -1,  0], uv: [0, 1], },
      { pos: [- legX / 2 + xRange, - legZ + heightLegH, - outTopZ], norm: [ 0, -1,  0], uv: [1, 0], },
      { pos: [- legX / 2 + xRange, - legZ + heightLegH,   outTopZ], norm: [ 0, -1,  0], uv: [1, 1], },
      //right
      { pos: [  legX / 2 + xRange,          heightLegH, - outTopZ], norm: [ 1,  0,  0], uv: [0, 0], },
      { pos: [  legX / 2 + xRange,          heightLegH,   outTopZ], norm: [ 1,  0,  0], uv: [0, 1], },
      { pos: [  legX / 2 + xRange, - legZ + heightLegH, - outTopZ], norm: [ 1,  0,  0], uv: [1, 0], },
      { pos: [  legX / 2 + xRange, - legZ + heightLegH,   outTopZ], norm: [ 1,  0,  0], uv: [1, 1], },
      //left
      { pos: [- legX / 2 + xRange, - legZ + heightLegH, - outTopZ], norm: [-1,  0,  0], uv: [0, 0], },
      { pos: [- legX / 2 + xRange, - legZ + heightLegH,   outTopZ], norm: [-1,  0,  0], uv: [0, 1], },
      { pos: [- legX / 2 + xRange,          heightLegH, - outTopZ], norm: [-1,  0,  0], uv: [1, 0], },
      { pos: [- legX / 2 + xRange,          heightLegH,   outTopZ], norm: [-1,  0,  0], uv: [1, 1], },
      //front
      { pos: [  legX / 2 + xRange, - legZ + heightLegH,   outTopZ], norm: [ 0,  0,  1], uv: [0, 0], },
      { pos: [  legX / 2 + xRange,          heightLegH,   outTopZ], norm: [ 0,  0,  1], uv: [0, 1], },
      { pos: [- legX / 2 + xRange, - legZ + heightLegH,   outTopZ], norm: [ 0,  0,  1], uv: [1, 0], },
      { pos: [- legX / 2 + xRange,          heightLegH,   outTopZ], norm: [ 0,  0,  1], uv: [1, 1], },
      //back
      { pos: [  legX / 2 + xRange,          heightLegH, - outTopZ], norm: [ 0,  0, -1], uv: [0, 0], },
      { pos: [  legX / 2 + xRange, - legZ + heightLegH, - outTopZ], norm: [ 0,  0, -1], uv: [0, 1], },
      { pos: [- legX / 2 + xRange,          heightLegH, - outTopZ], norm: [ 0,  0, -1], uv: [1, 0], },
      { pos: [- legX / 2 + xRange, - legZ + heightLegH, - outTopZ], norm: [ 0,  0, -1], uv: [1, 1], },

      // leg-1
      // top
      { pos: [- legX / 2 + xRange, heightLegH,      inTopZ], norm: [ 0,  1,  0], uv: [0, 0], },
      { pos: [- legX / 2 + xRange, heightLegH,     outTopZ], norm: [ 0,  1,  0], uv: [0, 1], }, 
      { pos: [  legX / 2 + xRange, heightLegH,      inTopZ], norm: [ 0,  1,  0], uv: [1, 0], },
      { pos: [  legX / 2 + xRange, heightLegH,     outTopZ], norm: [ 0,  1,  0], uv: [1, 1], },
      
      // right
      { pos: [  legX / 2 + xRange, heightLegH,      inTopZ], norm: [ 1,  0,  0], uv: [0, 0], },
      { pos: [  legX / 2 + xRange, heightLegH,     outTopZ], norm: [ 1,  0,  0], uv: [0, 1], },
      { pos: [  legX / 2 + xRange,          0,   inBottomZ], norm: [ 1,  0,  0], uv: [1, 0], },
      { pos: [  legX / 2 + xRange,          0,  outBottomZ], norm: [ 1,  0,  0], uv: [1, 1], },
      
      // bottom
      { pos: [  legX / 2 + xRange,          0,   inBottomZ], norm: [ 0, -1,  0], uv: [0, 0], },
      { pos: [  legX / 2 + xRange,          0,  outBottomZ], norm: [ 0, -1,  0], uv: [0, 1], },
      { pos: [- legX / 2 + xRange,          0,   inBottomZ], norm: [ 0, -1,  0], uv: [1, 0], },
      { pos: [- legX / 2 + xRange,          0,  outBottomZ], norm: [ 0, -1,  0], uv: [1, 1], },
      
      // left
      { pos: [- legX / 2 + xRange,          0,   inBottomZ], norm: [-1,  0,  0], uv: [0, 0], },
      { pos: [- legX / 2 + xRange,          0,  outBottomZ], norm: [-1,  0,  0], uv: [0, 1], },
      { pos: [- legX / 2 + xRange, heightLegH,      inTopZ], norm: [-1,  0,  0], uv: [1, 0], },
      { pos: [- legX / 2 + xRange, heightLegH,     outTopZ], norm: [-1,  0,  0], uv: [1, 1], },
      
      // front
      { pos: [  legX / 2 + xRange,          0,  outBottomZ], norm: [ 0,  0,  1], uv: [0, 0], },
      { pos: [  legX / 2 + xRange, heightLegH,     outTopZ], norm: [ 0,  0,  1], uv: [0, 1], },
      { pos: [- legX / 2 + xRange,          0,  outBottomZ], norm: [ 0,  0,  1], uv: [1, 0], },
      { pos: [- legX / 2 + xRange, heightLegH,     outTopZ], norm: [ 0,  0,  1], uv: [1, 1], },
      
      // back
      { pos: [  legX / 2 + xRange, heightLegH,      inTopZ], norm: [ 0,  0, -1], uv: [0, 0], },
      { pos: [  legX / 2 + xRange,          0,   inBottomZ], norm: [ 0,  0, -1], uv: [0, 1], },
      { pos: [- legX / 2 + xRange, heightLegH,      inTopZ], norm: [ 0,  0, -1], uv: [1, 0], },
      { pos: [- legX / 2 + xRange,          0,   inBottomZ], norm: [ 0,  0, -1], uv: [1, 1], },

      // leg-2
      // top
      { pos: [- legX / 2 + xRange, heightLegH, -   outTopZ], norm: [ 0,  1,  0], uv: [0, 0], },
      { pos: [- legX / 2 + xRange, heightLegH, -    inTopZ], norm: [ 0,  1,  0], uv: [0, 1], },
      { pos: [  legX / 2 + xRange, heightLegH, -   outTopZ], norm: [ 0,  1,  0], uv: [1, 0], },
      { pos: [  legX / 2 + xRange, heightLegH, -    inTopZ], norm: [ 0,  1,  0], uv: [1, 1], },
      
      // right
      { pos: [  legX / 2 + xRange, heightLegH, -    outTopZ], norm: [ 1,  0,  0], uv: [0, 0], },
      { pos: [  legX / 2 + xRange, heightLegH, -     inTopZ], norm: [ 1,  0,  0], uv: [0, 1], },
      { pos: [  legX / 2 + xRange,          0, - outBottomZ], norm: [ 1,  0,  0], uv: [1, 0], },
      { pos: [  legX / 2 + xRange,          0, -  inBottomZ], norm: [ 1,  0,  0], uv: [1, 1], },
      
      // bottom
      { pos: [  legX / 2 + xRange,          0, - outBottomZ], norm: [ 0, -1,  0], uv: [0, 0], },
      { pos: [  legX / 2 + xRange,          0, -  inBottomZ], norm: [ 0, -1,  0], uv: [0, 1], },
      { pos: [- legX / 2 + xRange,          0, - outBottomZ], norm: [ 0, -1,  0], uv: [1, 0], },
      { pos: [- legX / 2 + xRange,          0, -  inBottomZ], norm: [ 0, -1,  0], uv: [1, 1], },
      
      // left
      { pos: [- legX / 2 + xRange,          0, - outBottomZ], norm: [-1,  0,  0], uv: [0, 0], },
      { pos: [- legX / 2 + xRange,          0, -  inBottomZ], norm: [-1,  0,  0], uv: [0, 1], },
      { pos: [- legX / 2 + xRange, heightLegH, -    outTopZ], norm: [-1,  0,  0], uv: [1, 0], },
      { pos: [- legX / 2 + xRange, heightLegH, -     inTopZ], norm: [-1,  0,  0], uv: [1, 1], },
      
      // front
      { pos: [  legX / 2 + xRange,          0, -  inBottomZ], norm: [ 0,  0,  1], uv: [0, 0], },
      { pos: [  legX / 2 + xRange, heightLegH, -     inTopZ], norm: [ 0,  0,  1], uv: [0, 1], },
      { pos: [- legX / 2 + xRange,          0, -  inBottomZ], norm: [ 0,  0,  1], uv: [1, 0], },
      { pos: [- legX / 2 + xRange, heightLegH, -     inTopZ], norm: [ 0,  0,  1], uv: [1, 1], },
      
      // back
      { pos: [  legX / 2 + xRange, heightLegH, -    outTopZ], norm: [ 0,  0, -1], uv: [0, 0], },
      { pos: [  legX / 2 + xRange,          0, - outBottomZ], norm: [ 0,  0, -1], uv: [0, 1], },
      { pos: [- legX / 2 + xRange, heightLegH, -    outTopZ], norm: [ 0,  0, -1], uv: [1, 0], },
      { pos: [- legX / 2 + xRange,          0, - outBottomZ], norm: [ 0,  0, -1], uv: [1, 1], },

      // side -
      // joint
      { pos: [- jointX / 2 - xRange, heightLegH - 1, - jointZ / 2], norm: [ 0,  -1,  0], uv: [0, 0], },
      { pos: [  jointX / 2 - xRange, heightLegH - 1, - jointZ / 2], norm: [ 0,  -1,  0], uv: [1, 0], },
      { pos: [- jointX / 2 - xRange, heightLegH - 1,   jointZ / 2], norm: [ 0,  -1,  0], uv: [0, 1], },
      { pos: [  jointX / 2 - xRange, heightLegH - 1,   jointZ / 2], norm: [ 0,  -1,  0], uv: [1, 1], },

      //leg-0
      //top
      { pos: [- legX / 2 - xRange,          heightLegH, - outTopZ], norm: [ 0,  1,  0], uv: [0, 0], },
      { pos: [- legX / 2 - xRange,          heightLegH,   outTopZ], norm: [ 0,  1,  0], uv: [0, 1], },
      { pos: [  legX / 2 - xRange,          heightLegH, - outTopZ], norm: [ 0,  1,  0], uv: [1, 0], },
      { pos: [  legX / 2 - xRange,          heightLegH,   outTopZ], norm: [ 0,  1,  0], uv: [1, 1], },
      //botom
      { pos: [  legX / 2 - xRange, - legZ + heightLegH, - outTopZ], norm: [ 0, -1,  0], uv: [0, 0], },
      { pos: [  legX / 2 - xRange, - legZ + heightLegH,   outTopZ], norm: [ 0, -1,  0], uv: [0, 1], },
      { pos: [- legX / 2 - xRange, - legZ + heightLegH, - outTopZ], norm: [ 0, -1,  0], uv: [1, 0], },
      { pos: [- legX / 2 - xRange, - legZ + heightLegH,   outTopZ], norm: [ 0, -1,  0], uv: [1, 1], },
      //right
      { pos: [  legX / 2 - xRange,          heightLegH, - outTopZ], norm: [ 1,  0,  0], uv: [0, 0], },
      { pos: [  legX / 2 - xRange,          heightLegH,   outTopZ], norm: [ 1,  0,  0], uv: [0, 1], },
      { pos: [  legX / 2 - xRange, - legZ + heightLegH, - outTopZ], norm: [ 1,  0,  0], uv: [1, 0], },
      { pos: [  legX / 2 - xRange, - legZ + heightLegH,   outTopZ], norm: [ 1,  0,  0], uv: [1, 1], },
      //left
      { pos: [- legX / 2 - xRange, - legZ + heightLegH, - outTopZ], norm: [-1,  0,  0], uv: [0, 0], },
      { pos: [- legX / 2 - xRange, - legZ + heightLegH,   outTopZ], norm: [-1,  0,  0], uv: [0, 1], },
      { pos: [- legX / 2 - xRange,          heightLegH, - outTopZ], norm: [-1,  0,  0], uv: [1, 0], },
      { pos: [- legX / 2 - xRange,          heightLegH,   outTopZ], norm: [-1,  0,  0], uv: [1, 1], },
      //front
      { pos: [  legX / 2 - xRange, - legZ + heightLegH,   outTopZ], norm: [ 0,  0,  1], uv: [0, 0], },
      { pos: [  legX / 2 - xRange,          heightLegH,   outTopZ], norm: [ 0,  0,  1], uv: [0, 1], },
      { pos: [- legX / 2 - xRange, - legZ + heightLegH,   outTopZ], norm: [ 0,  0,  1], uv: [1, 0], },
      { pos: [- legX / 2 - xRange,          heightLegH,   outTopZ], norm: [ 0,  0,  1], uv: [1, 1], },
      //back
      { pos: [  legX / 2 - xRange,          heightLegH, - outTopZ], norm: [ 0,  0, -1], uv: [0, 0], },
      { pos: [  legX / 2 - xRange, - legZ + heightLegH, - outTopZ], norm: [ 0,  0, -1], uv: [0, 1], },
      { pos: [- legX / 2 - xRange,          heightLegH, - outTopZ], norm: [ 0,  0, -1], uv: [1, 0], },
      { pos: [- legX / 2 - xRange, - legZ + heightLegH, - outTopZ], norm: [ 0,  0, -1], uv: [1, 1], },

      // leg-1
      // top
      { pos: [- legX / 2 - xRange, heightLegH,      inTopZ], norm: [ 0,  1,  0], uv: [0, 0], },
      { pos: [- legX / 2 - xRange, heightLegH,     outTopZ], norm: [ 0,  1,  0], uv: [0, 1], }, 
      { pos: [  legX / 2 - xRange, heightLegH,      inTopZ], norm: [ 0,  1,  0], uv: [1, 0], },
      { pos: [  legX / 2 - xRange, heightLegH,     outTopZ], norm: [ 0,  1,  0], uv: [1, 1], },
      
      // right
      { pos: [  legX / 2 - xRange, heightLegH,      inTopZ], norm: [ 1,  0,  0], uv: [0, 0], },
      { pos: [  legX / 2 - xRange, heightLegH,     outTopZ], norm: [ 1,  0,  0], uv: [0, 1], },
      { pos: [  legX / 2 - xRange,          0,   inBottomZ], norm: [ 1,  0,  0], uv: [1, 0], },
      { pos: [  legX / 2 - xRange,          0,  outBottomZ], norm: [ 1,  0,  0], uv: [1, 1], },
      
      // bottom
      { pos: [  legX / 2 - xRange,          0,   inBottomZ], norm: [ 0, -1,  0], uv: [0, 0], },
      { pos: [  legX / 2 - xRange,          0,  outBottomZ], norm: [ 0, -1,  0], uv: [0, 1], },
      { pos: [- legX / 2 - xRange,          0,   inBottomZ], norm: [ 0, -1,  0], uv: [1, 0], },
      { pos: [- legX / 2 - xRange,          0,  outBottomZ], norm: [ 0, -1,  0], uv: [1, 1], },
      
      // left
      { pos: [- legX / 2 - xRange,          0,   inBottomZ], norm: [-1,  0,  0], uv: [0, 0], },
      { pos: [- legX / 2 - xRange,          0,  outBottomZ], norm: [-1,  0,  0], uv: [0, 1], },
      { pos: [- legX / 2 - xRange, heightLegH,      inTopZ], norm: [-1,  0,  0], uv: [1, 0], },
      { pos: [- legX / 2 - xRange, heightLegH,     outTopZ], norm: [-1,  0,  0], uv: [1, 1], },
      
      // front
      { pos: [  legX / 2 - xRange,          0,  outBottomZ], norm: [ 0,  0,  1], uv: [0, 0], },
      { pos: [  legX / 2 - xRange, heightLegH,     outTopZ], norm: [ 0,  0,  1], uv: [0, 1], },
      { pos: [- legX / 2 - xRange,          0,  outBottomZ], norm: [ 0,  0,  1], uv: [1, 0], },
      { pos: [- legX / 2 - xRange, heightLegH,     outTopZ], norm: [ 0,  0,  1], uv: [1, 1], },
      
      // back
      { pos: [  legX / 2 - xRange, heightLegH,      inTopZ], norm: [ 0,  0, -1], uv: [0, 0], },
      { pos: [  legX / 2 - xRange,          0,   inBottomZ], norm: [ 0,  0, -1], uv: [0, 1], },
      { pos: [- legX / 2 - xRange, heightLegH,      inTopZ], norm: [ 0,  0, -1], uv: [1, 0], },
      { pos: [- legX / 2 - xRange,          0,   inBottomZ], norm: [ 0,  0, -1], uv: [1, 1], },

      // leg-2
      // top
      { pos: [- legX / 2 - xRange, heightLegH, -   outTopZ], norm: [ 0,  1,  0], uv: [0, 0], },
      { pos: [- legX / 2 - xRange, heightLegH, -    inTopZ], norm: [ 0,  1,  0], uv: [0, 1], },
      { pos: [  legX / 2 - xRange, heightLegH, -   outTopZ], norm: [ 0,  1,  0], uv: [1, 0], },
      { pos: [  legX / 2 - xRange, heightLegH, -    inTopZ], norm: [ 0,  1,  0], uv: [1, 1], },
      
      // right
      { pos: [  legX / 2 - xRange, heightLegH, -    outTopZ], norm: [ 1,  0,  0], uv: [0, 0], },
      { pos: [  legX / 2 - xRange, heightLegH, -     inTopZ], norm: [ 1,  0,  0], uv: [0, 1], },
      { pos: [  legX / 2 - xRange,          0, - outBottomZ], norm: [ 1,  0,  0], uv: [1, 0], },
      { pos: [  legX / 2 - xRange,          0, -  inBottomZ], norm: [ 1,  0,  0], uv: [1, 1], },
      
      // bottom
      { pos: [  legX / 2 - xRange,          0, - outBottomZ], norm: [ 0, -1,  0], uv: [0, 0], },
      { pos: [  legX / 2 - xRange,          0, -  inBottomZ], norm: [ 0, -1,  0], uv: [0, 1], },
      { pos: [- legX / 2 - xRange,          0, - outBottomZ], norm: [ 0, -1,  0], uv: [1, 0], },
      { pos: [- legX / 2 - xRange,          0, -  inBottomZ], norm: [ 0, -1,  0], uv: [1, 1], },
      
      // left
      { pos: [- legX / 2 - xRange,          0, - outBottomZ], norm: [-1,  0,  0], uv: [0, 0], },
      { pos: [- legX / 2 - xRange,          0, -  inBottomZ], norm: [-1,  0,  0], uv: [0, 1], },
      { pos: [- legX / 2 - xRange, heightLegH, -    outTopZ], norm: [-1,  0,  0], uv: [1, 0], },
      { pos: [- legX / 2 - xRange, heightLegH, -     inTopZ], norm: [-1,  0,  0], uv: [1, 1], },
      
      // front
      { pos: [  legX / 2 - xRange,          0, -  inBottomZ], norm: [ 0,  0,  1], uv: [0, 0], },
      { pos: [  legX / 2 - xRange, heightLegH, -     inTopZ], norm: [ 0,  0,  1], uv: [0, 1], },
      { pos: [- legX / 2 - xRange,          0, -  inBottomZ], norm: [ 0,  0,  1], uv: [1, 0], },
      { pos: [- legX / 2 - xRange, heightLegH, -     inTopZ], norm: [ 0,  0,  1], uv: [1, 1], },
      
      // back
      { pos: [  legX / 2 - xRange, heightLegH, -    outTopZ], norm: [ 0,  0, -1], uv: [0, 0], },
      { pos: [  legX / 2 - xRange,          0, - outBottomZ], norm: [ 0,  0, -1], uv: [0, 1], },
      { pos: [- legX / 2 - xRange, heightLegH, -    outTopZ], norm: [ 0,  0, -1], uv: [1, 0], },
      { pos: [- legX / 2 - xRange,          0, - outBottomZ], norm: [ 0,  0, -1], uv: [1, 1], },
    ];

    var positions = [];
    var normals = [];
    var uvs = [];
    for (var vertex of verticesLeg) {
      positions.push(...vertex.pos);
      normals.push(...vertex.norm);
      uvs.push(...vertex.uv);
    }
    geometryLeg = new THREE.BufferGeometry();

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
     96,  97,  98,  98,  97,  99,
    100, 101, 102, 102, 101, 103,

    104, 105, 106, 106, 105, 107,
    108, 109, 110, 110, 109, 111,
    112, 113, 114, 114, 113, 115,
    116, 117, 118, 118, 117, 119,
    120, 121, 122, 122, 121, 123,
    124, 125, 126, 126, 125, 127,

    128, 129, 130, 130, 129, 131,
    132, 133, 134, 134, 133, 135,
    136, 137, 138, 138, 137, 139,
    140, 141, 142, 142, 141, 143,
    144, 145, 146, 146, 145, 147,
    148, 149, 150, 150, 149, 151,
    ]);
    
    materialLeg = new THREE.MeshPhongMaterial( { color: 0x555555 } );
    meshLeg = new THREE.Mesh( geometryLeg, materialLeg );
    meshLeg.castShadow = true;
    scene.add( meshLeg );
    break;

  case 'MX': //金物X型脚
    legX = 50;
    legZ = 70;

    gapTopZ = 400;
    gapBottomZ = 500;

    jointX = 150;
    jointZ = 600;

    inTopZ  = gapTopZ / 2;
    outTopZ = inTopZ + legZ;

    inBottomZ = gapBottomZ / 2;
    outBottomZ = inBottomZ+ legZ;

    xRange = faceX / 2 - offsetX; 
    verticesLeg = [
      // side +
      // joint
      { pos: [- jointX / 2 + xRange, heightLegH - 1, - jointZ / 2], norm: [ 0,  -1,  0], uv: [0, 0], },
      { pos: [  jointX / 2 + xRange, heightLegH - 1, - jointZ / 2], norm: [ 0,  -1,  0], uv: [1, 0], },
      { pos: [- jointX / 2 + xRange, heightLegH - 1,   jointZ / 2], norm: [ 0,  -1,  0], uv: [0, 1], },
      { pos: [  jointX / 2 + xRange, heightLegH - 1,   jointZ / 2], norm: [ 0,  -1,  0], uv: [1, 1], },
      
      // leg-1
      // top
      { pos: [- legX /2 + xRange, heightLegH,   inTopZ], norm: [ 0, 1, 0], uv: [0, 0], },
      { pos: [- legX /2 + xRange, heightLegH,  outTopZ], norm: [ 0, 1, 0], uv: [0, 1], }, 
      { pos: [  legX /2 + xRange, heightLegH,   inTopZ], norm: [ 0, 1, 0], uv: [1, 0], },
      { pos: [  legX /2 + xRange, heightLegH,  outTopZ], norm: [ 0, 1, 0], uv: [1, 1], },
      // bottom
      { pos: [  legX /2 + xRange,          0, - outBottomZ], norm: [ 0,-1, 0], uv: [0, 0], },
      { pos: [  legX /2 + xRange,          0, -  inBottomZ], norm: [ 0,-1, 0], uv: [0, 1], },
      { pos: [- legX /2 + xRange,          0, - outBottomZ], norm: [ 0,-1, 0], uv: [1, 0], },
      { pos: [- legX /2 + xRange,          0, -  inBottomZ], norm: [ 0,-1, 0], uv: [1, 1], },
      // right
      { pos: [  legX /2 + xRange, heightLegH,      outTopZ], norm: [ 1, 0, 0], uv: [0, 0], },
      { pos: [  legX /2 + xRange,          0, -  inBottomZ], norm: [ 1, 0, 0], uv: [0, 1], },
      { pos: [  legX /2 + xRange, heightLegH,       inTopZ], norm: [ 1, 0, 0], uv: [1, 0], },
      { pos: [  legX /2 + xRange,          0, - outBottomZ], norm: [ 1, 0, 0], uv: [1, 1], },
      // left
      { pos: [- legX /2 + xRange,          0, - outBottomZ], norm: [-1, 0, 0], uv: [0, 0], },
      { pos: [- legX /2 + xRange,          0, -  inBottomZ], norm: [-1, 0, 0], uv: [0, 1], },
      { pos: [- legX /2 + xRange, heightLegH,       inTopZ], norm: [-1, 0, 0], uv: [1, 0], },
      { pos: [- legX /2 + xRange, heightLegH,      outTopZ], norm: [-1, 0, 0], uv: [1, 1], },
      // front
      { pos: [  legX /2 + xRange,          0, -  inBottomZ], norm: [ 0, 0, 1], uv: [0, 0], },
      { pos: [  legX /2 + xRange, heightLegH,      outTopZ], norm: [ 0, 0, 1], uv: [0, 1], },
      { pos: [- legX /2 + xRange,          0, -  inBottomZ], norm: [ 0, 0, 1], uv: [1, 0], },
      { pos: [- legX /2 + xRange, heightLegH,      outTopZ], norm: [ 0, 0, 1], uv: [1, 1], },
      // back
      { pos: [  legX /2 + xRange, heightLegH,       inTopZ], norm: [ 0, 0,-1], uv: [0, 0], },
      { pos: [  legX /2 + xRange,          0, - outBottomZ], norm: [ 0, 0,-1], uv: [0, 1], },
      { pos: [- legX /2 + xRange, heightLegH,       inTopZ], norm: [ 0, 0,-1], uv: [1, 0], },
      { pos: [- legX /2 + xRange,          0, - outBottomZ], norm: [ 0, 0,-1], uv: [1, 1], },
    
      // leg-2
      // top
      { pos: [- legX /2 + xRange, heightLegH, -     inTopZ], norm: [ 0, 1, 0], uv: [0, 0], },
      { pos: [  legX /2 + xRange, heightLegH, -     inTopZ], norm: [ 0, 1, 0], uv: [1, 0], },
      { pos: [- legX /2 + xRange, heightLegH, -    outTopZ], norm: [ 0, 1, 0], uv: [0, 1], },
      { pos: [  legX /2 + xRange, heightLegH, -    outTopZ], norm: [ 0, 1, 0], uv: [1, 1], },
      // bottom
      { pos: [  legX /2 + xRange,          0,   outBottomZ], norm: [ 0,-1, 0], uv: [0, 0], },
      { pos: [- legX /2 + xRange,          0,   outBottomZ], norm: [ 0,-1, 0], uv: [1, 0], },
      { pos: [  legX /2 + xRange,          0,    inBottomZ], norm: [ 0,-1, 0], uv: [0, 1], },
      { pos: [- legX /2 + xRange,          0,    inBottomZ], norm: [ 0,-1, 0], uv: [1, 1], },
      // right
      { pos: [  legX /2 + xRange, heightLegH, -     inTopZ], norm: [ 1, 0, 0], uv: [0, 0], },
      { pos: [  legX /2 + xRange,          0,   outBottomZ], norm: [ 1, 0, 0], uv: [1, 0], },
      { pos: [  legX /2 + xRange, heightLegH, -    outTopZ], norm: [ 1, 0, 0], uv: [0, 1], },
      { pos: [  legX /2 + xRange,          0,    inBottomZ], norm: [ 1, 0, 0], uv: [1, 1], },
      // left
      { pos: [- legX /2 + xRange,          0,   outBottomZ], norm: [-1, 0, 0], uv: [0, 0], },
      { pos: [- legX /2 + xRange, heightLegH, -     inTopZ], norm: [-1, 0, 0], uv: [1, 0], },
      { pos: [- legX /2 + xRange,          0,    inBottomZ], norm: [-1, 0, 0], uv: [0, 1], },
      { pos: [- legX /2 + xRange, heightLegH, -    outTopZ], norm: [-1, 0, 0], uv: [1, 1], },
      // front
      { pos: [  legX /2 + xRange,          0,    inBottomZ], norm: [ 0, 0,-1], uv: [0, 0], },
      { pos: [- legX /2 + xRange,          0,    inBottomZ], norm: [ 0, 0,-1], uv: [1, 0], },
      { pos: [  legX /2 + xRange, heightLegH, -    outTopZ], norm: [ 0, 0,-1], uv: [0, 1], },
      { pos: [- legX /2 + xRange, heightLegH, -    outTopZ], norm: [ 0, 0,-1], uv: [1, 1], },
      // back
      { pos: [  legX /2 + xRange, heightLegH, -     inTopZ], norm: [ 0, 0, 1], uv: [0, 0], },
      { pos: [- legX /2 + xRange, heightLegH, -     inTopZ], norm: [ 0, 0, 1], uv: [1, 0], },
      { pos: [  legX /2 + xRange,          0,   outBottomZ], norm: [ 0, 0, 1], uv: [0, 1], },
      { pos: [- legX /2 + xRange,          0,   outBottomZ], norm: [ 0, 0, 1], uv: [1, 1], },
      
      // side -
      // joint
      { pos: [- jointX / 2 - xRange, heightLegH - 1, - jointZ / 2], norm: [ 0,  -1,  0], uv: [0, 0], },
      { pos: [  jointX / 2 - xRange, heightLegH - 1, - jointZ / 2], norm: [ 0,  -1,  0], uv: [1, 0], },
      { pos: [- jointX / 2 - xRange, heightLegH - 1,   jointZ / 2], norm: [ 0,  -1,  0], uv: [0, 1], },
      { pos: [  jointX / 2 - xRange, heightLegH - 1,   jointZ / 2], norm: [ 0,  -1,  0], uv: [1, 1], },
      
      // leg-1
      // top
      { pos: [- legX /2 - xRange, heightLegH,   inTopZ], norm: [ 0, 1, 0], uv: [0, 0], },
      { pos: [- legX /2 - xRange, heightLegH,  outTopZ], norm: [ 0, 1, 0], uv: [0, 1], }, 
      { pos: [  legX /2 - xRange, heightLegH,   inTopZ], norm: [ 0, 1, 0], uv: [1, 0], },
      { pos: [  legX /2 - xRange, heightLegH,  outTopZ], norm: [ 0, 1, 0], uv: [1, 1], },
      // bottom
      { pos: [  legX /2 - xRange,          0, - outBottomZ], norm: [ 0,-1, 0], uv: [0, 0], },
      { pos: [  legX /2 - xRange,          0, -  inBottomZ], norm: [ 0,-1, 0], uv: [0, 1], },
      { pos: [- legX /2 - xRange,          0, - outBottomZ], norm: [ 0,-1, 0], uv: [1, 0], },
      { pos: [- legX /2 - xRange,          0, -  inBottomZ], norm: [ 0,-1, 0], uv: [1, 1], },
      // right
      { pos: [  legX /2 - xRange, heightLegH,      outTopZ], norm: [ 1, 0, 0], uv: [0, 0], },
      { pos: [  legX /2 - xRange,          0, -  inBottomZ], norm: [ 1, 0, 0], uv: [0, 1], },
      { pos: [  legX /2 - xRange, heightLegH,       inTopZ], norm: [ 1, 0, 0], uv: [1, 0], },
      { pos: [  legX /2 - xRange,          0, - outBottomZ], norm: [ 1, 0, 0], uv: [1, 1], },
      // left
      { pos: [- legX /2 - xRange,          0, - outBottomZ], norm: [-1, 0, 0], uv: [0, 0], },
      { pos: [- legX /2 - xRange,          0, -  inBottomZ], norm: [-1, 0, 0], uv: [0, 1], },
      { pos: [- legX /2 - xRange, heightLegH,       inTopZ], norm: [-1, 0, 0], uv: [1, 0], },
      { pos: [- legX /2 - xRange, heightLegH,      outTopZ], norm: [-1, 0, 0], uv: [1, 1], },
      // front
      { pos: [  legX /2 - xRange,          0, -  inBottomZ], norm: [ 0, 0, 1], uv: [0, 0], },
      { pos: [  legX /2 - xRange, heightLegH,      outTopZ], norm: [ 0, 0, 1], uv: [0, 1], },
      { pos: [- legX /2 - xRange,          0, -  inBottomZ], norm: [ 0, 0, 1], uv: [1, 0], },
      { pos: [- legX /2 - xRange, heightLegH,      outTopZ], norm: [ 0, 0, 1], uv: [1, 1], },
      // back
      { pos: [  legX /2 - xRange, heightLegH,       inTopZ], norm: [ 0, 0,-1], uv: [0, 0], },
      { pos: [  legX /2 - xRange,          0, - outBottomZ], norm: [ 0, 0,-1], uv: [0, 1], },
      { pos: [- legX /2 - xRange, heightLegH,       inTopZ], norm: [ 0, 0,-1], uv: [1, 0], },
      { pos: [- legX /2 - xRange,          0, - outBottomZ], norm: [ 0, 0,-1], uv: [1, 1], },
    
      // leg-2
      // top
      { pos: [- legX /2 - xRange, heightLegH, -     inTopZ], norm: [ 0, 1, 0], uv: [0, 0], },
      { pos: [  legX /2 - xRange, heightLegH, -     inTopZ], norm: [ 0, 1, 0], uv: [1, 0], },
      { pos: [- legX /2 - xRange, heightLegH, -    outTopZ], norm: [ 0, 1, 0], uv: [0, 1], },
      { pos: [  legX /2 - xRange, heightLegH, -    outTopZ], norm: [ 0, 1, 0], uv: [1, 1], },
      // bottom
      { pos: [  legX /2 - xRange,          0,   outBottomZ], norm: [ 0,-1, 0], uv: [0, 0], },
      { pos: [- legX /2 - xRange,          0,   outBottomZ], norm: [ 0,-1, 0], uv: [1, 0], },
      { pos: [  legX /2 - xRange,          0,    inBottomZ], norm: [ 0,-1, 0], uv: [0, 1], },
      { pos: [- legX /2 - xRange,          0,    inBottomZ], norm: [ 0,-1, 0], uv: [1, 1], },
      // right
      { pos: [  legX /2 - xRange, heightLegH, -     inTopZ], norm: [ 1, 0, 0], uv: [0, 0], },
      { pos: [  legX /2 - xRange,          0,   outBottomZ], norm: [ 1, 0, 0], uv: [1, 0], },
      { pos: [  legX /2 - xRange, heightLegH, -    outTopZ], norm: [ 1, 0, 0], uv: [0, 1], },
      { pos: [  legX /2 - xRange,          0,    inBottomZ], norm: [ 1, 0, 0], uv: [1, 1], },
      // left
      { pos: [- legX /2 - xRange,          0,   outBottomZ], norm: [-1, 0, 0], uv: [0, 0], },
      { pos: [- legX /2 - xRange, heightLegH, -     inTopZ], norm: [-1, 0, 0], uv: [1, 0], },
      { pos: [- legX /2 - xRange,          0,    inBottomZ], norm: [-1, 0, 0], uv: [0, 1], },
      { pos: [- legX /2 - xRange, heightLegH, -    outTopZ], norm: [-1, 0, 0], uv: [1, 1], },
      // front
      { pos: [  legX /2 - xRange,          0,    inBottomZ], norm: [ 0, 0,-1], uv: [0, 0], },
      { pos: [- legX /2 - xRange,          0,    inBottomZ], norm: [ 0, 0,-1], uv: [1, 0], },
      { pos: [  legX /2 - xRange, heightLegH, -    outTopZ], norm: [ 0, 0,-1], uv: [0, 1], },
      { pos: [- legX /2 - xRange, heightLegH, -    outTopZ], norm: [ 0, 0,-1], uv: [1, 1], },
      // back
      { pos: [  legX /2 - xRange, heightLegH, -     inTopZ], norm: [ 0, 0, 1], uv: [0, 0], },
      { pos: [- legX /2 - xRange, heightLegH, -     inTopZ], norm: [ 0, 0, 1], uv: [1, 0], },
      { pos: [  legX /2 - xRange,          0,   outBottomZ], norm: [ 0, 0, 1], uv: [0, 1], },
      { pos: [- legX /2 - xRange,          0,   outBottomZ], norm: [ 0, 0, 1], uv: [1, 1], },
    ];

    var positions = [];
    var normals = [];
    var uvs = [];
    for (var vertex of verticesLeg) {
      positions.push(...vertex.pos);
      normals.push(...vertex.norm);
      uvs.push(...vertex.uv);
    }
    geometryLeg = new THREE.BufferGeometry();

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
        96,  97,  98,  98,  97,  99,
       100, 101, 102, 102, 101, 103,
    ]);
    
    materialLeg = new THREE.MeshPhongMaterial( { color: 0x555555 } );
    
    meshLeg = new THREE.Mesh( geometryLeg, materialLeg );
    meshLeg.castShadow = true;
    scene.add( meshLeg );
    break;
  
    case 'W4': //金属4本脚
    legX = 70;
    legZ = 70;

    outsideX = (faceX + legX) / 2 - offsetLegX;
    insideX  = (faceX - legX) / 2 - offsetLegX;
    outsideZ = (faceZ + legZ) / 2 - offsetLegZ;
    insideZ  = (faceZ - legZ) / 2 - offsetLegZ;

    verticesLeg = [
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
    geometryLeg = new THREE.BufferGeometry();

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

    materialLeg = new THREE.MeshPhongMaterial( { color: 0x664422 } );
    meshLeg = new THREE.Mesh( geometryLeg, materialLeg );
    meshLeg.castShadow = true;
    scene.add( meshLeg );
    break;

  default:
      console.log('脚を指定してください。');
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
    }else if(flgLeg == 'MX'){
      flgLeg = 'W4';
    }else{
      flgLeg = 'M4';
    }
    DrawModel();
});