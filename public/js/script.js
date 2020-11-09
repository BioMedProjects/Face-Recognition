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
  const labeledDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6)

  video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
  
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
      //detections.map(console.log)
      //console.log(detections[0])

      console.log(detections[0].descriptor)

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

    }, 100);
  })
}



function loadLabeledImages() {
  const labels = ['Black Widow', 'Captain America', 'PG']
  return Promise.all(
      labels.map(async (label)=>{
          const descriptions = []
          const number_of_imgs = 1
          for(let i=1; i<=number_of_imgs; i++) {
              const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`)
              const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
              console.log(label + JSON.stringify(detections.descriptor))
              descriptions.push(detections.descriptor)
          }

          //const dist = faceapi.euclideanDistance([0, 0], [0, 10])
          //console.log(dist) // 10
          return new faceapi.LabeledFaceDescriptors(label, descriptions)
      })
  )
}















