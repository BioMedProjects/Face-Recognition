const video = document.getElementById('video')
const MODEL_URL = '/models'

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, 
      new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
    console.log("detections: ", detections)

    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
  
    const landmarks = await faceapi.detectFaceLandmarks(video)
    //console.log("landmarks: ", landmarks)
    const landmarksPositions = landmarks.positions 

    const jawOutline = landmarks.getJawOutline()
    const nose = landmarks.getNose()
    const mouth = landmarks.getMouth()
    const leftEye = landmarks.getLeftEye()
    const rightEye = landmarks.getRightEye()
    const leftEyeBbrow = landmarks.getLeftEyeBrow()
    const rightEyeBrow = landmarks.getRightEyeBrow()
    //console.log("jaw: ", jawOutline)

    const descriptor = await faceapi.computeFaceDescriptor(video)
    //console.log("descriptor: ", descriptor)

    if (detections.length != 0){
      const faceMatcher = new faceapi.FaceMatcher(detections)
      //console.log("faceMatcher: ", faceMatcher)
    }

    /*
    const labeledDescriptors = [
      new faceapi.LabeledFaceDescriptors(
        'person 1',
        [descriptor]
      )
    ]

    //var labeledFaceDescriptorsJson = labeledDescriptors.map(x=>x.toJSON())
    //console.log(labeledFaceDescriptorsJson)

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)
    detections.forEach(fd => {
      const bestMatch = faceMatcher.findBestMatch(fd.descriptor)
      //console.log(bestMatch.toString())
    })
    */
  }, 100)
})













