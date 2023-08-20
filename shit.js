/*--------------------
Vars
--------------------*/
let progress = 50
let startX = 0
let active = 0
let isDown = false

/*--------------------
Contants
--------------------*/
const speedWheel = 0.02
const speedDrag = -0.1

/*--------------------
Get Z
--------------------*/
const getZindex = (array, index) => (array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i)))

/*--------------------
Items
--------------------*/
const $items = document.querySelectorAll('.carousel-item')
const $cursors = document.querySelectorAll('.cursor')

const displayItems = (item, index, active) => {
  const zIndex = getZindex([...$items], active)[index]
  item.style.setProperty('--zIndex', zIndex)
  item.style.setProperty('--active', (index-active)/$items.length)
}

/*--------------------
Animate
--------------------*/
const animate = () => {
  progress = Math.max(0, Math.min(progress, 100))
  active = Math.floor(progress/100*($items.length-1))
  
  $items.forEach((item, index) => displayItems(item, index, active))
}
animate()

/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
  item.addEventListener('click', () => {
    progress = (i/$items.length) * 100 + 10
    animate()
  })
})

/*--------------------
Handlers
--------------------*/
const handleWheel = e => {
  const wheelProgress = e.deltaY * speedWheel
  progress = progress + wheelProgress
  animate()
}

const handleMouseMove = (e) => {
  if (e.type === 'mousemove') {
    $cursors.forEach(($cursor) => {
      $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    })
  }
  if (!isDown) return
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
  const mouseProgress = (x - startX) * speedDrag
  progress = progress + mouseProgress
  startX = x
  animate()
}

const handleMouseDown = e => {
  isDown = true
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0
}

const handleMouseUp = () => {
  isDown = false
}

/*--------------------
Listeners
--------------------*/
document.addEventListener('mousewheel', handleWheel)
document.addEventListener('mousedown', handleMouseDown)
document.addEventListener('mousemove', handleMouseMove)
document.addEventListener('mouseup', handleMouseUp)
document.addEventListener('touchstart', handleMouseDown)
document.addEventListener('touchmove', handleMouseMove)
document.addEventListener('touchend', handleMouseUp)
document.querySelectorAll('.button').forEach(button => {

  let duration = 3000,
      svg = button.querySelector('svg'),
      svgPath = new Proxy({
          y: null,
          smoothing: null
      }, {
          set(target, key, value) {
              target[key] = value;
              if(target.y !== null && target.smoothing !== null) {
                  svg.innerHTML = getPath(target.y, target.smoothing, null);
              }
              return true;
          },
          get(target, key) {
              return target[key];
          }
      });

  button.style.setProperty('--duration', duration);

  svgPath.y = 20;
  svgPath.smoothing = 0;

  button.addEventListener('click', e => {
      
      e.preventDefault();

      if(!button.classList.contains('loading')) {

          button.classList.add('loading');

          gsap.to(svgPath, {
              smoothing: .3,
              duration: duration * .065 / 1000
          });

          gsap.to(svgPath, {
              y: 12,
              duration: duration * .265 / 1000,
              delay: duration * .065 / 1000,
              ease: Elastic.easeOut.config(1.12, .4)
          });

          setTimeout(() => {
              svg.innerHTML = getPath(0, 0, [
                  [3, 14],
                  [8, 19],
                  [21, 6]
              ]);
          }, duration / 2);

      }

  });

});

function getPoint(point, i, a, smoothing) {
  let cp = (current, previous, next, reverse) => {
          let p = previous || current,
              n = next || current,
              o = {
                  length: Math.sqrt(Math.pow(n[0] - p[0], 2) + Math.pow(n[1] - p[1], 2)),
                  angle: Math.atan2(n[1] - p[1], n[0] - p[0])
              },
              angle = o.angle + (reverse ? Math.PI : 0),
              length = o.length * smoothing;
          return [current[0] + Math.cos(angle) * length, current[1] + Math.sin(angle) * length];
      },
      cps = cp(a[i - 1], a[i - 2], point, false),
      cpe = cp(point, a[i - 1], a[i + 1], true);
  return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
}

function getPath(update, smoothing, pointsNew) {
  let points = pointsNew ? pointsNew : [
          [4, 12],
          [12, update],
          [20, 12]
      ],
      d = points.reduce((acc, point, i, a) => i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${getPoint(point, i, a, smoothing)}`, '');
  return `<path d="${d}" />`;
}
document.getElementById("rads").onmousemove = e => {
  for(const rad of document.getElementsByClassName("rad")) {
    const rect = rad.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;

    rad.style.setProperty("--mouse-x", `${x}px`);
    rad.style.setProperty("--mouse-y", `${y}px`);
  };
}
// function on() {
//   document.getElementById("overlay").style.display = "block";
// }

// function off() {
//   document.getElementById("overlay").style.display = "none";
// }

document.getElementById('bnt').onclick=function(){
  document.getElementById('form').style.display='block';
}
document.getElementById('cancel').onclick=function(){
  document.getElementById('form').style.display='none';
}
document.getElementById('bn').onclick=function(){
  document.getElementById('form').style.display='block';
}