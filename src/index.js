const hogForm = document.getElementById("hog-form")
const hogContainer = document.getElementById("hog-container")

let allHogs = []

fetch("http://localhost:3000/hogs")
.then(res => res.json())
.then(data => {
  allHogs = data
  data.forEach((hog) => {
    hogContainer.innerHTML += renderHog(hog)
  })
})
function renderHog(hog) {
    const checkStatus = hog.greased ? "checked" : ""
    return `
      <div class="hog-card" data-id="${hog.id}">
        <h2>${hog.name}</h2>
        <img src="${hog.image}" alt="${hog.name}">
        <h4>Specialty: ${hog.specialty}</h4>
        <h4>Weight: ${hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]}</h4>
        <h4>Highest Medal: ${hog["highest medal achieved"]}</h4>
        <label for="greased">Greased?</label>
        <div id='piggy-${hog.id}'>
          <input type="checkbox" name="greased" class="grease-check" data-id="${hog.id}" data-greased="${hog.greased}" ${checkStatus}>
        </div>
        <button type="button" class="delete" data-id="${hog.id}">Delete Hog</button>
      </div>
    `
  }
hogContainer.addEventListener('click', (e) => {
  if(e.target.className === 'grease-check') {
  console.log(e.target.dataset)

    if (e.target.dataset.greased === "true") {
      // console.log(e.target.dataset.id, false)
      hogGreased(e.target.dataset.id, false)
    }
    else if (e.target.dataset.greased === "false") {
      // console.log(e.target.dataset.id, true)
        hogGreased(e.target.dataset.id, true)/*I was stuck with a type-o for about 30min haha (dataset !== datset)*/
    }
  }
else if (e.target.className === 'delete') {
  // console.log(e.target.dataset.id)
  deleteHog(e.target.dataset.id)
}

})
function hogGreased(id, boolean) {
  const piggyDiv = hogContainer.querySelector(`#piggy-${id}`)
  const headers = {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ greased: boolean})
  }
  fetch(`http://localhost:3000/hogs/${id}`, headers)
  .then(res => res.json())
  .then(hog => {
    console.log(hog)
    const checkStatus = hog.greased ? "checked" : ""
    piggyDiv.innerHTML = `
    <input type="checkbox" name="greased" class="grease-check" data-id="${hog.id}" data-greased="${hog.greased}" ${checkStatus}>
    `
  })
}
function deleteHog(id) {
    return fetch(`http://localhost:3000/hogs/${id}`, { method: "DELETE"} )
      .then(res => res.json())
      .then( () => {
        const deletedHog = hogContainer.querySelector(`.hog-card[data-id="${id}"]`)
        deletedHog.remove()
      })
  }
hogForm.addEventListener('submit', (e) => {
  e.preventDefault()
  // console.log(e.target)
  const newName = hogForm.querySelector("input[name='name']")
  const newSpecialty = hogForm.querySelector("input[name='specialty']")
  const newMedal = hogForm.querySelector("input[name='medal']")
  const newWeight = hogForm.querySelector("input[name='weight']")
  const newImg = hogForm.querySelector("input[name='img']")
  const newGreased = hogForm.querySelector("input[name='greased']")
  const headers = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "name": newName.value,
      "specialty": newSpecialty.value,
      "greased": newGreased.checked,
      "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": newWeight.value,
      "highest medal achieved": newMedal.value,
      "image": newImg.value
    })
  }
  fetch("http://localhost:3000/hogs", headers)
  .then(res => res.json())
  .then(data => {
    hogContainer.innerHTML += renderHog(data)
    hogForm.reset()
  })
})
