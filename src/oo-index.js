const hogForm = document.getElementById("hog-form")
const hogContainer = document.getElementById("hog-container")

function fetchHogs() {
  fetch("http://localhost:3000/hogs")
  .then(r => r.json())
  .then(data => {
    data.forEach(hog => {
      new Hog(hog)
      const foundHog = Hog.find(hog.id)
      hogContainer.innerHTML += foundHog.renderFullHog()
    })
  })
}

hogContainer.addEventListener("click", e => {
  if (e.target.className === "grease-check") {
    let foundHog = Hog.find(parseInt(e.target.dataset.id))
    if (e.target.dataset.greased === "true") {
      foundHog.hogGreaser(false)
    } else {
      foundHog.hogGreaser(true)
    }
  } else if (e.target.className === "delete") {
    let foundHog = Hog.find(parseInt(e.target.dataset.id))
    foundHog.deleteHog()
  }
})

hogForm.addEventListener("submit", e => {
  e.preventDefault()
  addHog()
})

function addHog() {
  const newName = hogForm.querySelector("input[name='name']")
  const newSpecialty = hogForm.querySelector("input[name='specialty']")
  const newMedal = hogForm.querySelector("input[name='medal']")
  const newWeight = hogForm.querySelector("input[name='weight']")
  const newImg = hogForm.querySelector("input[name='img']")
  const newGreased = hogForm.querySelector("input[name='greased']")

  return fetch("http://localhost:3000/hogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "name": newName.value,
      "specialty": newSpecialty.value,
      "greased": newGreased.checked,
      "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": newWeight.value,
      "highest medal achieved": newMedal.value,
      "image": newImg.value,
    })
  })
  .then(r => r.json())
  .then(data => {
    new Hog(data)
    const createdHog = Hog.find(data.id)
    hogContainer.innerHTML += createdHog.renderFullHog()
    hogForm.reset()
  })
}

fetchHogs()
