const video = document.getElementById('video')
const MODEL_URL = '/models'

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
]).then(startVideo)


function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
  recognizeFace()
}

async function recognizeFace(){

  data = await fetch('http://127.0.0.1:8000/descriptors/list_descriptors/').then(response => response.json());
  const labeledDescriptors = await loadDescriptorData(data);
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

  video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    const button = document.getElementById('button');
  
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
      //detections.map(console.log)
      //console.log(detections[0])

      //console.log(detections[0].descriptor)

      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

      const results = resizedDetections.map((d) => {
        return faceMatcher.findBestMatch(d.descriptor)
      })

      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box
        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
        drawBox.draw(canvas)
      })

      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

      const name = document.getElementById('name').value
      const surname = document.getElementById('surname').value

      button.onclick = function(){postDescriptor(name, surname, detections[0].descriptor)};

    }, 100);
  })
}


let getCookie = (name) => {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}


function postDescriptor(name, surname, descriptor) {
  let data = {
    name: name,
    surname: surname,
    descriptor: JSON.stringify(descriptor)
  }
  fetch('http://127.0.0.1:8000/descriptors/save_descriptor/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(data)
    })
  console.log(name, surname, descriptor);
}


function loadDescriptorData(data) {

  //let labels = data.map(record => record.name + " " + record.surname)
  //let descriptors = data.map(record => record.descriptor)
  //console.log(descriptors);

  const descriptors = data.map(record => new Float32Array(Object.values(JSON.parse(record.descriptor))))
  //for (i of descriptors) console.log(i.length)

  return Promise.all(
    data.map(async (record)=>{
          let label = record.name + " " + record.surname;
          return new faceapi.LabeledFaceDescriptors(label, [new Float32Array(Object.values(JSON.parse(record.descriptor)))])
      })
  )
}
