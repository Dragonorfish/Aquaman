
​
<script>
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
  import { CSS3DRenderer, CSS3DObject} from "three/examples/jsm/renderers/CSS3DRenderer.js";
  import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";//rebe加载器
  import { ref,onMounted,nextTick  } from 'vue'
  import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
  import { DoubleSide, MirroredRepeatWrapping, RepeatWrapping, TextureLoader } from "three";
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { TWEEN } from "three/examples/jsm/libs/tween.module.min";

  export default {
    data(){
      return{

      }
    },

    methods:{

    },


    setup(){
// 监听键盘是否按下
      let keyCodeW = false
      let keyCodeS = false
      let keyCodeA = false
      let keyCodeD = false
      let keyShift=false
      let keySpace=false
      //当前激活的弹窗dom
      let selectedDom=null
      //当前激活的弹窗dom所属mesh
      let selectedMesh=null
      //scene
      let scene = new THREE.Scene();
      //摄像机集合
      let cameras=[]
      //轨道控制器
      let orbitControls=[]
      //所有楼层子类
      let floorChild=[]
      //选中的楼层
      let selectedFloor="all"
      //楼层集合
      let storeys=[{story:{},num:'all'}]
      //监控集合
      let sceneHeadCollection=[]
      //管道集合
      let conduitCollection=[]
      //冷却塔集合
      let coolingTowerCollection=[]
      //灭火器集合
      let fireExtinguisherCollection=[]
      //暴露的楼层集合
      let storeysCount=ref([{story:{},num:'all'}])
      let dataPopup=ref({
        name:''
      })
      //加载百分比
      let loadingPercentage=ref({
        value: 0,
      })
      //移除datalabel
      function deleteDiv() {
        if (selectedMesh!=null){
          selectedMesh.children.forEach(item=>{
            if (item.uuid===selectedDom){
              selectedMesh.remove(item)
            }
          })
        }
      }
      //隐藏所有子类按钮
      function disVisibleChild() {
        console.log(storeys)
        storeys.forEach((item)=>{
          if (item.story.children){
            item.story.traverse(function(obj) {
              if (obj.isCSS2DObject === true) {
                obj.visible =false
              }
            })
          }
        })
      }
      //得到当前楼层子类
      function getFloorChild() {
        if (selectedFloor==='all'){
          return []
        }
        if (storeys[selectedFloor].story.children){
          storeys[selectedFloor].story.children.forEach(itemChild=> {
                floorChild.push(itemChild)
            })
        }
        return floorChild
      }


      function animateCamera(camera, target1, orbit, target2) {
        console.log(camera,target1,orbit,target2)
        const tween = new TWEEN.Tween({
          x1: camera.x, // 相机当前位置x
          y1: camera.y, // 相机当前位置y
          z1: camera.z, // 相机当前位置z
          x2: orbit.x, // 控制当前的中心点x
          y2: orbit.y, // 控制当前的中心点y
          z2: orbit.z // 控制当前的中心点z
        });
        tween.to({
          x1: target1.x-20, // 新的相机位置x
          y1: target1.y+30, // 新的相机位置y
          z1: target1.z, // 新的相机位置z
          x2: target2.x, // 新的控制中心点位置x
          y2: target2.y, // 新的控制中心点位置y
          z2: target2.z // 新的控制中心点位置z
        }, 1000);
        tween.onUpdate(function(object) {
          camera.x = object.x1;
          camera.y = object.y1;
          camera.z = object.z1;
          orbit.x = object.x2;
          orbit.y = object.y2;
          orbit.z = object.z2;
          orbitControls[0].update();
        })

        tween.easing(TWEEN.Easing.Cubic.InOut);
        tween.start();
      }
      function changeStorey(e){
        deleteDiv()
        disVisibleChild()
        selectedFloor=e.num
        if (e.story.children){
          e.story.traverse(function(obj) {
            if (obj.isCSS2DObject === true) {
              obj.visible =true
            }
          })
        }
        storeys.forEach(item=>{
          item.story.visible=true
          if (item.num!=='all'&&e.num!=='all'&&item.num>e.num){
            item.story.visible=false
            console.log(item,e)
          }
        })
        if (e.num==='all'){
          animateCamera(cameras[0].position,{x:-50, y:35,z:0 },orbitControls[0].target,{x:0, y:20,z:0 })
        }else {
          animateCamera(cameras[0].position,e.story.position,orbitControls[0].target,e.story.position)
        }

      }


      document.addEventListener(
        'keyup',
        (e) => {
          let ev = e || window.event
          switch (ev.keyCode) {
            case 87:
              keyCodeW = false
              break
            case 83:
              keyCodeS = false
              break
            case 65:
              keyCodeA = false
              break
            case 68:
              keyCodeD = false
              break
            case 16:
              keyShift = false
              break
            case 32:
              keySpace = false
              break
            default:
              break
          }
        },
        false
      )
      document.addEventListener(
        'keydown',
        (e) => {
          let ev = e || window.event
          switch (ev.keyCode) {
            case 87:
              keyCodeW = true
              break
            case 83:
              keyCodeS = true
              break
            case 65:
              keyCodeA = true
              break
            case 68:
              keyCodeD = true
              break
            case 16:
              keyShift = true
              break
            case 32:
              keySpace = true
              break

            default:
              break
          }
        },
        false
      )
      function storeStoryObj(...object) {
        object.forEach((item)=>{
          storeys.push({
            story:item[0],
            num:item[1]
          })
          storeysCount.value.push({
            story:item[0],
            num:item[1]
          })
        })
        console.log(storeys)
      }

      function onCodeMove(mesh,cam) {
        if (keyCodeW) {
          mesh.position.x += 2
          cam.position.x += 2
          mesh.rotation.y = Math.PI * 0.5
        }
        if (keyCodeA) {
          mesh.position.z -= 2
          cam.position.z -= 2
          mesh.rotation.y = Math.PI
        }
        if (keyCodeS) {
          mesh.position.x -= 2
          cam.position.x -= 2
          mesh.rotation.y = Math.PI * 1.5
        }
        if (keyCodeD) {
          mesh.position.z += 2
          cam.position.z += 2
          mesh.rotation.y = Math.PI * 2
        }
        if (keyShift) {
          mesh.position.y -= 2
          cam.position.y -= 2
        }
        if (keySpace) {
          mesh.position.y += 1
          cam.position.y += 1
        }

        if (keyCodeW && keyCodeD) {
          mesh.rotation.y = Math.PI * 0.25
        }
        if (keyCodeW && keyCodeA) {
          mesh.rotation.y = Math.PI * 0.75
        }
        if (keyCodeA && keyCodeS) {
          mesh.rotation.y = Math.PI * 1.25
        }
        if (keyCodeS && keyCodeD) {
          mesh.rotation.y = Math.PI * 1.75
        }
      }


      onMounted(()=> {
        //加载渲染器到dom上
        const canvas = document.querySelector('#three');
        const renderer = new THREE.WebGLRenderer({ canvas: canvas });
        renderer.setClearColor(0xAAAAAA);
        renderer.shadowMap.enabled = true;
        //标签渲染器添加
        let labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '10vh';
        labelRenderer.domElement.style.left = '20.5%'
        labelRenderer.domElement.style.width = '70%'
        labelRenderer.domElement.style.height = '80vh'
        labelRenderer.domElement.style.pointerEvents = 'none';
        document.body.appendChild(labelRenderer.domElement);

        //相机一号
        function makeCamera(fov = 40) {
          const aspect = 2;  // the canvas default
          const zNear = 0.1;
          const zFar = 1000;
          return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
        }

        const axesHelper = new THREE.AxesHelper(30);
        // scene.add(axesHelper);


        const camera = makeCamera();
        cameras.push(camera)
        camera.position.set(-50, 35, 0)
        // 加载控制器
        const controls = new OrbitControls(camera, canvas);
        orbitControls.push(controls)
        controls.target.set(0, 20, 0);
        controls.update();

        //加载模型
        function createManLable() {
          let manDiv = document.createElement('button');//创建div容器
          manDiv.className = 'man_lable';
          manDiv.textContent = "停止跳舞";
          manDiv.style.pointerEvents = 'auto'
          manDiv.style.marginTop = '-1em';
          manDiv.onclick = () => {
            mixer.stopAllAction()
            if (manDiv.textContent === '停止跳舞') {
              mixer.clipAction(man.animations[2]).play()
              manDiv.textContent = '开始跳舞'
            } else {
              manDiv.textContent = '停止跳舞'
              mixer.clipAction(man.animations[0]).play()
            }

          }
          const pointLabel = new CSS2DObject(manDiv);
          pointLabel.position.set(0, 3, 0);
          return pointLabel;
        }

        // 光源一号
        {
          const light = new THREE.DirectionalLight(0xffffff, 1);
          light.position.set(0, 40, 0);
          scene.add(light);
          light.castShadow = true;
          light.shadow.mapSize.width = 2048;
          light.shadow.mapSize.height = 2048;

          const d = 50;
          light.shadow.camera.left = -d;
          light.shadow.camera.right = d;
          light.shadow.camera.top = d;
          light.shadow.camera.bottom = -d;
          light.shadow.camera.near = 1;
          light.shadow.camera.far = 50;
          light.shadow.bias = 0.001;
        }

        //光源二号

        {
          const light = new THREE.DirectionalLight(0xffffff, 1);
          light.position.set(0, -10, 0);
          scene.add(light);
        }
        {
          const light = new THREE.DirectionalLight(0xffffff, 1);
          light.position.set(10, 10, 10);
          scene.add(light);
        }
        {
          const light = new THREE.DirectionalLight(0xffffff, 1);
          light.position.set(-10, 10, -10);
          scene.add(light);
        }
        //创建地板
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        let textureLoad = new TextureLoader();
        const floorTextureLoader = textureLoad.load('src/assets/static/blackWall.jpg');
        floorTextureLoader.wrapS = RepeatWrapping // 相当于x轴的平铺方式为镜像平铺
        floorTextureLoader.wrapT = RepeatWrapping // 相当于y轴的平铺方式
        floorTextureLoader.repeat.set(13, 13)
        const groundMaterial = new THREE.MeshPhongMaterial({
          side: DoubleSide,
          map: floorTextureLoader,
        });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = Math.PI * -.5;
        groundMesh.receiveShadow = true;
        scene.add(groundMesh);

        //x绿z白y蓝
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cubex = new THREE.Mesh(geometry, material);
        cubex.position.set(10,0,0)
        const cubez = cubex.clone()
        cubez.position.set(0, 0, 20)
        cubez.material = new THREE.MeshBasicMaterial({ color: 0xffffff })
        const cubey = cubex.clone()
        cubey.position.set(0, 0, 0)
        cubey.material = new THREE.MeshBasicMaterial({ color: "#013968" })
        scene.add(cubez, cubey);

        //房子
        {
        const wallTextureLoader = textureLoad.load('src/assets/static/wallPic.jpg')
        const floorTextureLoader = textureLoad.load('src/assets/static/floor.jpg')
        floorTextureLoader.wrapS = RepeatWrapping // 相当于x轴的平铺方式为镜像平铺
        floorTextureLoader.wrapT = RepeatWrapping // 相当于y轴的平铺方式
        floorTextureLoader.repeat.set(2, 3)
        wallTextureLoader.wrapS = RepeatWrapping // 相当于x轴的平铺方式为镜像平铺
        wallTextureLoader.wrapT = RepeatWrapping // 相当于y轴的平铺方式
        wallTextureLoader.repeat.set(1, 1)
        const wallGeometry = new THREE.BoxGeometry(30, 10, 30);
        const wallMaterial = new THREE.MeshBasicMaterial({ side: DoubleSide, map: wallTextureLoader });
        const floorMaterial = new THREE.MeshBasicMaterial({ side: DoubleSide, map: floorTextureLoader });
        const mesh1 = new THREE.Mesh(wallGeometry, [wallMaterial, wallMaterial, {}, floorMaterial, wallMaterial, wallMaterial]);
        mesh1.position.set(0, 5.01, 0)
        const mesh2 = mesh1.clone()
        mesh2.position.set(0, 15, 0)
        const mesh3 = groundMesh.clone()
        mesh3.geometry = new THREE.BoxGeometry(30, 1, 30);
        mesh3.material=floorMaterial
        mesh3.rotation.x = 0;
        mesh3.position.set(0, 20.5, 0)
        storeStoryObj([mesh1, 1], [mesh2, 2], [mesh3, 3])
        scene.add(mesh1, mesh2, mesh3);
        // storeys[1].story.add(cubex)
        // conduitCollection.push({conduit:cubex,id:"001"})
      }
        //
        // let manLabel = createManLable();
        //
        // const fbxLoader=new FBXLoader();
        // let man=null;
        // let mixer=null;
        // fbxLoader.load('src/assets/static/Silly Dancing.fbx',function(object) {
        //   console.log(object)
        //   man=object
        //   // 新建一个AnimationMixer, 并取得AnimationClip实例列表
        //   mixer = new THREE.AnimationMixer( man );
        //   console.log(man,man.animations)
        //   const action =mixer.clipAction( man.animations[ 0 ] );
        //   action.play();
        //   object.scale.set(0.05,0.05,0.05)
        //   object.position.set(0,-5,0)
        //   object.add(manLabel)
        //   storeys[2].story.add(object)
        //   disVisibleChild()
        // })
        // fbxLoader.load('src/assets/static/Angry.fbx',function(object) {
        //   console.log(object)
        //   // 新建一个AnimationMixer, 并取得AnimationClip实例列表
        //   man.animations.push(object.animations[0])
        // })

        const gltfLoader=new GLTFLoader()

        //加载监控摄像头
        gltfLoader.load('src/assets/static/scene.gltf',function(object) {
          object.scene.position.set(-10,0,-12.4)
          object.scene.scale.set(0.30,0.30,0.30)
          console.log('111',object)
          storeys[1].story.add(object.scene)
          sceneHeadCollection.push({sceneHead:object.scene,id:'001'})
        })
        //加载灭火器
        gltfLoader.load('src/assets/static/fireExtinguisher.gltf',function(object) {
          object.scene.position.set(13,-5,13)
          object.scene.scale.set(5,5,5)

          storeys[1].story.add(object.scene)
          fireExtinguisherCollection.push({fireExtinguisher:object.scene,id:'001'})
        })
        //加载管道
        gltfLoader.load('src/assets/static/Conduit1.gltf',function(object) {
          object.scene.position.set(13.5,-5,12.9)
          object.scene.scale.set(5,5,5)

          storeys[2].story.add(object.scene)
          conduitCollection.push({conduit:object.scene,id:'001'})
        })
        //加载冷却塔
        gltfLoader.load('src/assets/static/lengque.gltf',function(object) {
          object.scene.position.set(0,0,-5)
          object.scene.scale.set(0.2,0.2,0.2)

          storeys[3].story.add(object.scene)
          coolingTowerCollection.push({coolingTower:object.scene,id:'001'})
        })
        //加载星夜
        gltfLoader.load('src/assets/static/starNight/scene.gltf',function(object) {
          object.scene.position.set(0,0,-5)
          object.scene.scale.set(1,1,1)

          scene.add(object.scene)
          coolingTowerCollection.push({coolingTower:object.scene,id:'001'})
        })



        //对象拾取
        canvas.addEventListener('click', onDocumentMouseDown, false);
        async function onDocumentMouseDown(event) {
          deleteDiv()
          // 点击屏幕创建一个向量
          const Cx=canvas.offsetWidth/2+0.205*window.innerWidth;
          const Cy=canvas.offsetHeight/2+0.1*window.innerHeight;
          const x1=(event.clientX-Cx);
          const y1=(Cy-event.clientY);
          let vector = new THREE.Vector3(x1/canvas.offsetWidth*2,
            y1/canvas.offsetHeight*2,
            0.5);
          vector = vector.unproject(camera); // 将屏幕的坐标转换成三维场景中的坐标
          const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
          floorChild = []
          floorChild = getFloorChild()
          console.log(floorChild)
          const intersects = raycaster.intersectObjects(floorChild, true);
          let popupClassName =null
          let popupId=null
          let itemParent=null
          if (intersects) {
            console.log(intersects)
            sceneHeadCollection.forEach((item,index,collection)=>{
              console.log(item.sceneHead,intersects[0].object)
              item.sceneHead.traverse(function(obj) {
                if (obj.uuid===intersects[0].object.uuid){
                  popupClassName="sceneHead"
                  popupId=collection[index].id
                  itemParent=item.sceneHead
                }
              })
            })
            conduitCollection.forEach((item,index,collection)=>{
              console.log(item.conduit,intersects[0].object)
                if (item.conduit.uuid===intersects[0].object.uuid){
                  popupClassName="conduit"
                  popupId=collection[index].id
                  itemParent=item.conduit
                }
              item.conduit.traverse(function(obj) {
                if (obj.uuid===intersects[0].object.uuid){
                  popupClassName="conduit"
                  popupId=collection[index].id
                  itemParent=item.conduit
                }
              })
            })
            coolingTowerCollection.forEach((item,index,collection)=>{
              console.log(item.coolingTower,intersects[0].object)
              if (item.coolingTower.uuid===intersects[0].object.uuid){
                popupClassName="coolingTower"
                popupId=collection[index].id
                itemParent=item.coolingTower
              }
              item.coolingTower.traverse(function(obj) {
                if (obj.uuid===intersects[0].object.uuid){
                  popupClassName="coolingTower"
                  popupId=collection[index].id
                  itemParent=item.coolingTower
                }
              })
            })
            fireExtinguisherCollection.forEach((item,index,collection)=>{
              console.log(item.fireExtinguisher,intersects[0].object)
              if (item.fireExtinguisher.uuid===intersects[0].object.uuid){
                popupClassName="fireExtinguisher"
                popupId=collection[index].id
                itemParent=item.fireExtinguisher
              }
              item.fireExtinguisher.traverse(function(obj) {
                if (obj.uuid===intersects[0].object.uuid){
                  popupClassName="fireExtinguisher"
                  popupId=collection[index].id
                  itemParent=item.fireExtinguisher
                }
              })
            })
            console.log(popupClassName)
            const popup = await createDataLableObj(popupClassName,popupId)
            console.log(intersects[0].object)
            selectedMesh=intersects[0].object
            selectedDom=popup.uuid
            intersects[0].object.add(popup)
            console.log(selectedFloor)
            const positionx=itemParent.position.x+storeys[selectedFloor].story.position.x
            const positiony=itemParent.position.y+storeys[selectedFloor].story.position.y
            const positionz=itemParent.position.z+storeys[selectedFloor].story.position.z
            animateCamera(cameras[0].position, { x:positionx,y:positiony,z:positionz }
            ,orbitControls[0].target,{ x:positionx,y:positiony,z:positionz })
          }
        }

        // 添加按钮及绑定方法
        function createLableObj(classname) {
          const laberDiv = document.createElement('button');//创建div容器
          laberDiv.className = classname;
          laberDiv.textContent ="点这里";
          laberDiv.style.pointerEvents='auto'
          laberDiv.style.marginTop = '-1em';
          laberDiv.style.borderRadius='15px'
          console.log(laberDiv)
          const pointLabel = new CSS2DObject(laberDiv);
          pointLabel.position.set(0, 3, 0);
          laberDiv.onclick= async () => {
            deleteDiv()
            let dataLabel = await createDataLableObj(classname)
            selectedMesh = pointLabel
            selectedDom = dataLabel.uuid
            if (classname === 'grandHouse') {
              if (grandHouse.position.y === 9.5) {
                man.add(manLabel)
                grandHouse.position.set(0, 19.5, 0)
              } else {
                man.remove(manLabel)
                grandHouse.position.set(0, 9.5, 0)
              }
            } else if (classname === 'cubex') {
            }
            pointLabel.add(dataLabel)
          }
          console.log(laberDiv)
          return pointLabel;
        }


        //弹窗创建方法
        async function createDataLableObj(className,popupId) {
          dataPopup.value.name = className;
          await nextTick()
          if (className==="sceneHead"){
            let laberDiv = document.querySelector('#popDom1');//找到div容器
            let laberDivClone = laberDiv.cloneNode(true)
            let button=laberDivClone.querySelector('#button')
            button.onclick=function(){
              alert('我的名字是'+dataPopup.value.name+",我的id是"+popupId)
            }
            laberDivClone.id = popupId;
            laberDivClone.style.pointerEvents = 'auto';
            laberDivClone.style.marginTop = '-1em';
            const pointLabel = new CSS2DObject(laberDivClone);
            pointLabel.position.set(0, 0, 0);
            return pointLabel;
          }else if (className==="conduit"){
            let laberDiv = document.querySelector('#popDom2');//找到div容器
            let laberDivClone = laberDiv.cloneNode(true)
            laberDivClone.id = popupId;
            laberDivClone.style.pointerEvents = 'auto';
            laberDivClone.style.marginTop = '-1em';
            const pointLabel = new CSS2DObject(laberDivClone);
            pointLabel.position.set(0, 1, 0);
            return pointLabel;
          }else if(className==="coolingTower"){
            let laberDiv = document.querySelector('#popDom3');//找到div容器
            let laberDivClone = laberDiv.cloneNode(true)
            laberDivClone.id = popupId;
            laberDivClone.style.pointerEvents = 'auto';
            laberDivClone.style.marginTop = '-1em';
            const pointLabel = new CSS2DObject(laberDivClone);
            pointLabel.position.set(0, 1, 0);
            return pointLabel;
          }else if(className==="fireExtinguisher"){
            let laberDiv = document.querySelector('#popDom4');//找到div容器
            let laberDivClone = laberDiv.cloneNode(true)
            laberDivClone.id = popupId;
            laberDivClone.style.pointerEvents = 'auto';
            laberDivClone.style.marginTop = '-1em';
            const pointLabel = new CSS2DObject(laberDivClone);
            pointLabel.position.set(0, 1, 0);
            return pointLabel;
          }
        }

        //响应式调整相机或窗口
        function resizeRendererToDisplaySize(renderer) {
          const canvas = renderer.domElement;
          const width = canvas.clientWidth;
          const height = canvas.clientHeight;
          const needResize = canvas.width !== width || canvas.height !== height;
          if (needResize) {
            renderer.setSize(width, height, false);
            labelRenderer.setSize( width, height );
          }
          return needResize;
        }

        disVisibleChild()

        let clock = new THREE.Clock()

        function render(time) {
          if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            cameras.forEach((cameraInfo) => {
              const camera = cameraInfo;
              camera.aspect = canvas.clientWidth / canvas.clientHeight;
              camera.updateProjectionMatrix();
            });
          }
          // onCodeMove(cubeCam,camera)
          // if (mixer){
          //   mixer.update(clock.getDelta())
          // }
          controls.update()
          TWEEN.update(time)
          labelRenderer.render( scene, camera );
          renderer.render(scene, camera);
          requestAnimationFrame(render);
        }
        // //天空盒背景
        // const header=document.querySelector("#header")
        // const rgbeLoader = new RGBELoader();
        // //资源较大，使用异步加载
        // rgbeLoader.loadAsync("src/assets/static/backTextrue.hdr",function onProgress(xhr) {
        //   // 后台打印查看模型文件加载进度
        //
        //   loadingPercentage.value={value:parseInt(xhr.loaded/xhr.total*100+'')}
        // }).then((texture) => {
        //   header.style.visibility="visible";
        //   texture.mapping = THREE.EquirectangularReflectionMapping;
        //   //将加载的材质texture设置给背景和环境
        //   scene.background = texture;
        //   scene.environment = texture;
          requestAnimationFrame(render);
        // });
      })


      return {
        loadingPercentage,
        dataPopup,
        storeysCount,
        changeStorey
      }
    }
  }
</script>
​
<template>
    <div id="loading">
        <dv-percent-pond :config="loadingPercentage" style="width:200px;height:100px;" />
    </div>
    <div id="header" >
        <div v-for="item in storeysCount" :key="item.num">
            <el-button class="story_button" type="info" @click="changeStorey(item)" round>{{item.num}}</el-button>
        </div>
    </div>
    <canvas id="three" style="width: 70%;"></canvas>
    <div id="popDom1" style="display: none">
        <el-form-item >
            <video width="300" height="200" controls>
                <source src="../../assets/static/video.mp4" type="video/mp4">
            </video>
        </el-form-item>
        <button id="button" type="button">我的信息</button>
    </div>
    <div id="popDom2" style="background-color: darkturquoise ;width: 270px;height: 130px;
        border:1px solid darkblue;
        border-radius:10px;">
        <el-descriptions
                class="margin-top"
                title="管道状态"
                style="margin: 15px"
                :column="2"
                :size="size"
        >
            <el-descriptions-item label="编号:">001</el-descriptions-item>
            <el-descriptions-item label="流速:">0.00</el-descriptions-item>
            <el-descriptions-item label="压力:">0.07pa</el-descriptions-item>
            <el-descriptions-item label="布水器状态:">
                <el-tag size="small">正常</el-tag>
            </el-descriptions-item>
        </el-descriptions>
    </div>
    <div id="popDom3" style="background-color: darkturquoise ;width: 270px;height: 130px;
        border:1px solid darkblue;
        border-radius:10px;">
        <el-descriptions
                class="margin-top"
                title="冷却塔状态"
                style="margin: 15px"
                :column="2"
                :size="size"
        >
            <el-descriptions-item label="编号:">001</el-descriptions-item>
            <el-descriptions-item label="运行时间:">7小时</el-descriptions-item>
            <el-descriptions-item label="温度:">31℃</el-descriptions-item>
            <el-descriptions-item label="布水器状态:">
                <el-tag size="small">正常</el-tag>
            </el-descriptions-item>
        </el-descriptions>
    </div>
    <div id="popDom4" style="background-color: darkturquoise ;width: 270px;height: 130px;
        border:1px solid darkblue;
        border-radius:10px;">
        <el-descriptions
                class="margin-top"
                title="灭火器组"
                style="margin: 15px"
                :column="2"
                :size="size"
        >
            <el-descriptions-item label="编号:">001</el-descriptions-item>
            <el-descriptions-item label="存量:">2</el-descriptions-item>
            <el-descriptions-item label="未维护时间:">11天</el-descriptions-item>
            <el-descriptions-item label="状态:">
                <el-tag size="small">正常</el-tag>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<style>
#loading{
    position:absolute;
    /*height: 5vh;*/
    /*width: 10vh;*/
    top: 40%;
    left: 50%;
    color: #36DA43;
}
#header{
    position: absolute;
    display: flex;
    flex-direction: row;
    height: 30px;
    width: 70%;
    left:19.62%;
    background-color: #909399;
    z-index: 9999;
}

.el-form-item__label{
    color: #36DA43;
    font-size: 15px;
}
.story_button{
    width: 1vh;
    height: 3vh;
    background-color: #2e2e2e;
    color: whitesmoke;
    margin: 3px;
    text-align:center;

}
    #popDom2{
        display: none;

    }
    #popDom3{
        display: none;


    }
    #popDom4{
        display: none;

    }
    .el-descriptions__body{
        color: white;
        background-color:darkturquoise ;
    }
</style>
