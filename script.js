// 1) Pega aquí la URL publicada de tu modelo de IMAGEN (termina en "/")
  const URL = "https://teachablemachine.withgoogle.com/models/myhKNXNmg/";

  let model, webcam, labelContainer, maxPredictions;

  const $emoji = document.getElementById("emoji");
  const $badge = document.getElementById("insignia");
  const $btn   = document.getElementById("btnStart");

  function emojiFor(name){
    const k = String(name).toLowerCase();
    if (k.includes("arriba"))     return "⬆️";
    if (k.includes("abajo"))      return "⬇️";
    if (k.includes("izquierda"))  return "⬅️";
    if (k.includes("derecha"))    return "➡️";
    if (k.includes("yo"))         return "🙂";
    return "❓";
  }

  async function init(){
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    webcam = new tmImage.Webcam(224, 224, true);
    await webcam.setup();
    await webcam.play();
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }
    window.requestAnimationFrame(loop);
  }

  async function loop(){
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  }

  async function predict(){
    const prediction = await model.predict(webcam.canvas);
    // listar todas
    for (let i = 0; i < maxPredictions; i++) {
      const p = prediction[i];
      labelContainer.childNodes[i].textContent =
        `${p.className}: ${p.probability.toFixed(2)}`;
    }
    // top-1
    const top = prediction.slice().sort((a,b)=>b.probability-a.probability)[0];
    $emoji.textContent = emojiFor(top.className);
    $badge.textContent = `${top.className} ${top.probability.toFixed(2)}`;
  }

  $btn.addEventListener("click", init);